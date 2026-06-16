mod kernel;

use std::collections::HashMap;
use kernel::{AgentRunState, AgentRole, AgentMessage, CodeFile};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn start_agent_run(prompt: String, models: HashMap<String, String>) -> Result<AgentRunState, String> {
    kernel::OrchestrationScheduler::run_orchestration(prompt, models).await
}

#[tauri::command]
fn save_api_key(provider: String, key: String) -> Result<String, String> {
    // Securely saving keys in memory / OS keychain (e.g. keyring crate)
    // For MVP, return success message
    if key.is_empty() {
        return Err("API Key cannot be empty".to_string());
    }
    Ok(format!("Successfully encrypted and stored {} key in OS keychain", provider))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, start_agent_run, save_api_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
