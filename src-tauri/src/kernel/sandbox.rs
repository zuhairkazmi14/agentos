use std::path::{Path, PathBuf};

pub struct WorkspaceSandbox {
    root_path: PathBuf,
}

impl WorkspaceSandbox {
    pub fn new<P: AsRef<Path>>(root: P) -> Self {
        Self {
            root_path: root.as_ref().to_path_buf(),
        }
    }

    /// Verifies if a given subpath is inside the sandbox.
    pub fn verify_path<P: AsRef<Path>>(&self, subpath: P) -> Result<PathBuf, String> {
        let joined = self.root_path.join(subpath);
        
        // Normalize the path resolving any '..' or '.' segments to detect escape attempts.
        let normalized = self.normalize_path(&joined);
        
        if normalized.starts_with(&self.root_path) {
            Ok(normalized)
        } else {
            Err(format!(
                "Security Policy Violation: Target path escapes the sandboxed workspace folder: {:?}",
                normalized
            ))
        }
    }

    // Helper to normalize paths without requiring filesystem access (since files might not exist yet)
    fn normalize_path(&self, path: &Path) -> PathBuf {
        use std::path::Component;
        let mut normalized = PathBuf::new();
        for component in path.components() {
            match component {
                Component::ParentDir => {
                    normalized.pop();
                }
                Component::Normal(c) => {
                    normalized.push(c);
                }
                Component::CurDir => {}
                c => {
                    normalized.push(c.as_os_str());
                }
            }
        }
        normalized
    }
}
