use std::fs::{self, File};
use std::io::{Read, Write};
use crate::kernel::AgentRunState;

const MEMORY_FILE: &str = "agentos_memory.json";

/// Saves or updates an agent run record in the JSON memory vault.
pub fn save_run(run: AgentRunState) -> Result<(), String> {
    let mut runs = load_runs().unwrap_or_default();
    
    if let Some(pos) = runs.iter().position(|r| r.run_id == run.run_id) {
        runs[pos] = run;
    } else {
        runs.push(run);
    }
    
    let json_data = serde_json::to_string_pretty(&runs)
        .map_err(|e| format!("Failed to serialize memory: {}", e))?;
    
    let mut file = File::create(MEMORY_FILE)
        .map_err(|e| format!("Failed to create memory database: {}", e))?;
    
    file.write_all(json_data.as_bytes())
        .map_err(|e| format!("Failed to write memory database: {}", e))?;
    
    Ok(())
}

/// Loads all agent run records from the JSON memory vault.
pub fn load_runs() -> Result<Vec<AgentRunState>, String> {
    if !std::path::Path::new(MEMORY_FILE).exists() {
        return Ok(vec![]);
    }
    
    let mut file = File::open(MEMORY_FILE)
        .map_err(|e| format!("Failed to open memory database: {}", e))?;
    
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .map_err(|e| format!("Failed to read memory database: {}", e))?;
    
    if contents.trim().is_empty() {
        return Ok(vec![]);
    }
    
    let runs: Vec<AgentRunState> = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse memory database: {}", e))?;
        
    Ok(runs)
}

/// Clears all agent run records from the JSON memory vault.
pub fn clear_runs() -> Result<(), String> {
    if std::path::Path::new(MEMORY_FILE).exists() {
        fs::remove_file(MEMORY_FILE)
            .map_err(|e| format!("Failed to clear memory database: {}", e))?;
    }
    Ok(())
}
