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
fn load_runs() -> Result<Vec<AgentRunState>, String> { Ok(vec![]) }

