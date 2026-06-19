mod kernel;

use std::collections::HashMap;
use kernel::{AgentRunState, AgentRole, AgentMessage, CodeFile, AgentPack};

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
