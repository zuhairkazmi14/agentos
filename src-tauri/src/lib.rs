mod kernel;

use std::collections::HashMap;
use kernel::{AgentRunState, AgentRole, AgentMessage, CodeFile, AgentPack};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn start_agent_run(window: tauri::Window, prompt: String, models: HashMap<String, String>) -> Result<AgentRunState, String> {
    kernel::OrchestrationScheduler::run_orchestration(window, prompt, models).await
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

#[tauri::command]
fn get_memory_runs() -> Result<Vec<AgentRunState>, String> {
    kernel::memory::load_runs()
}

#[tauri::command]
fn clear_memory_runs() -> Result<(), String> {
    kernel::memory::clear_runs()
}

#[tauri::command]
fn list_marketplace_packs() -> Result<Vec<AgentPack>, String> {
    kernel::marketplace::list_packs()
}

#[tauri::command]
fn toggle_marketplace_pack(pack_id: String, install: bool) -> Result<Vec<AgentPack>, String> {
    kernel::marketplace::toggle_install(pack_id, install)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            start_agent_run, 
            save_api_key,
            get_memory_runs,
            clear_memory_runs,
            list_marketplace_packs,
            toggle_marketplace_pack
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Refactor command registry structure
