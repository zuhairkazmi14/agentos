use serde::{Serialize, Deserialize};
use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::Path;

const INSTALLED_FILE: &str = "agentos_installed_packs.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentPack {
    pub id: String,
    pub name: String,
    pub description: String,
    pub author: String,
    pub category: String,
    pub installed: bool,
    pub permissions: Vec<String>,
    pub version: String,
}

/// Helper to get the list of default available Agent Packs in the marketplace.
fn get_default_packs() -> Vec<AgentPack> {
    vec![
        AgentPack {
            id: "playwright_browser".to_string(),
            name: "Playwright Browser Automation".to_string(),
            description: "Automate web browsing, form fills, screenshots, and structural DOM extraction inside a secure sandbox.".to_string(),
            author: "AgentOS Core".to_string(),
            category: "Browser".to_string(),
            installed: false,
            permissions: vec![
                "network:egress:*".to_string(),
                "playwright:chromium:headless".to_string(),
                "sandbox:read:downloads/".to_string(),
            ],
            version: "1.2.0".to_string(),
        },
        AgentPack {
            id: "git_sync".to_string(),
            name: "Git Repo Sync & PR Builder".to_string(),
            description: "Interact with local git sub-folders to initialize repositories, stage files, build commits, and push pull requests.".to_string(),
            author: "Git-Pack-Org".to_string(),
            category: "DevTools".to_string(),
            installed: false,
            permissions: vec![
                "execute:git:status".to_string(),
                "execute:git:commit".to_string(),
                "write:workspace/.git".to_string(),
            ],
            version: "0.9.4".to_string(),
        },
        AgentPack {
            id: "sqlite_explorer".to_string(),
            name: "SQLite Schema Explorer".to_string(),
            description: "Inspect local database schemas, run safety-contained read-only SQL queries, and export reports in CSV.".to_string(),
            author: "Database Crew".to_string(),
            category: "Database".to_string(),
            installed: false,
            permissions: vec![
                "read:workspace/*.sqlite".to_string(),
                "read:workspace/*.db".to_string(),
                "write:workspace/reports/".to_string(),
            ],
            version: "1.0.1".to_string(),
        },
        AgentPack {
            id: "ciso_firewall".to_string(),
            name: "Prompt Injection Firewall".to_string(),
            description: "An offline, zero-latency local security firewall that intercepts and sanitizes scraped markdown web contents before LLM execution.".to_string(),
            author: "CISO-Safe".to_string(),
            category: "Security".to_string(),
            installed: false,
            permissions: vec![
                "read:sandbox/model-cache/".to_string(),
                "intercept:context:inbound".to_string(),
            ],
            version: "2.1.0".to_string(),
        },
        AgentPack {
            id: "web_search_duckduckgo".to_string(),
            name: "DuckDuckGo Web Search".to_string(),
            description: "Direct web search queries for retrieving current live information without tracking cookies.".to_string(),
            author: "Search System".to_string(),
            category: "Utilities".to_string(),
            installed: false,
            permissions: vec![
                "network:egress:html.duckduckgo.com".to_string(),
                "network:egress:api.duckduckgo.com".to_string(),
            ],
            version: "1.0.5".to_string(),
        },
        AgentPack {
            id: "linear_tracker".to_string(),
            name: "Linear Task Sync".to_string(),
            description: "Synchronize agent run results directly with Linear issues, marking items as resolved and posting comments.".to_string(),
            author: "Linear-Community".to_string(),
            category: "DevTools".to_string(),
            installed: false,
            permissions: vec![
                "network:egress:api.linear.app".to_string(),
                "read:workspace/linear.json".to_string(),
            ],
            version: "0.8.2".to_string(),
        },
    ]
}

/// Load the list of installed pack IDs from local storage.
fn load_installed_ids() -> Vec<String> {
    if !Path::new(INSTALLED_FILE).exists() {
        return vec![];
    }
    let mut file = match File::open(INSTALLED_FILE) {
        Ok(f) => f,
        Err(_) => return vec![],
    };
    let mut contents = String::new();
    if file.read_to_string(&mut contents).is_err() {
        return vec![];
    }
    serde_json::from_str(&contents).unwrap_or_default()
}

/// Save the list of installed pack IDs to local storage.
fn save_installed_ids(ids: &[String]) -> Result<(), String> {
    let json_data = serde_json::to_string_pretty(ids)
        .map_err(|e| format!("Failed to serialize installed packs list: {}", e))?;
    let mut file = File::create(INSTALLED_FILE)
        .map_err(|e| format!("Failed to create installed packs file: {}", e))?;
    file.write_all(json_data.as_bytes())
        .map_err(|e| format!("Failed to write installed packs file: {}", e))?;
    Ok(())
}

/// List all available Agent Packs with their installation states.
pub fn list_packs() -> Result<Vec<AgentPack>, String> {
    let installed_ids = load_installed_ids();
    let mut packs = get_default_packs();
    for pack in &mut packs {
        if installed_ids.contains(&pack.id) {
            pack.installed = true;
        }
    }
    Ok(packs)
}

/// Installs or uninstalls a specific Agent Pack.
pub fn toggle_install(pack_id: String, install: bool) -> Result<Vec<AgentPack>, String> {
    let mut installed_ids = load_installed_ids();
    
    if install {
        if !installed_ids.contains(&pack_id) {
            installed_ids.push(pack_id);
        }
    } else {
        installed_ids.retain(|id| id != &pack_id);
    }
    
    save_installed_ids(&installed_ids)?;
    list_packs()
}
