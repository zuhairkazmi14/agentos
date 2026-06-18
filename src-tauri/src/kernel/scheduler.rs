use std::collections::HashMap;
use tokio::sync::mpsc;
use crate::kernel::{AgentRole, AgentActor, AgentTask, AgentEvent, AgentRunState, AgentMessage, CodeFile};
use uuid::Uuid;
use tauri::Emitter;

pub struct OrchestrationScheduler;

impl OrchestrationScheduler {
    pub async fn run_orchestration(
        window: tauri::Window,
        prompt: String,
        _models: HashMap<String, String>,
    ) -> Result<AgentRunState, String> {
        let run_id = Uuid::new_v4().to_string();

        // Create the centralized feedback loop channel
        let (event_sender, mut event_receiver) = mpsc::channel::<AgentEvent>(100);

        // Create communication lines for each actor
        let (arch_tx, arch_rx) = mpsc::channel::<AgentTask>(10);
        let (back_tx, back_rx) = mpsc::channel::<AgentTask>(10);
        let (front_tx, front_rx) = mpsc::channel::<AgentTask>(10);
        let (qa_tx, qa_rx) = mpsc::channel::<AgentTask>(10);

        // Spawn actors in background async threads
        tokio::spawn(AgentActor::new(AgentRole::Architect, arch_rx, event_sender.clone()).run_loop());
        tokio::spawn(AgentActor::new(AgentRole::Backend, back_rx, event_sender.clone()).run_loop());
        tokio::spawn(AgentActor::new(AgentRole::Frontend, front_rx, event_sender.clone()).run_loop());
        tokio::spawn(AgentActor::new(AgentRole::QA, qa_rx, event_sender.clone()).run_loop());

        // Initialize state tracker
        let mut state = AgentRunState {
            run_id: run_id.clone(),
            prompt: prompt.clone(),
            current_agent: Some(AgentRole::Architect),
            status: "starting".to_string(),
            progress: 5.0,
            total_tokens: 0,
            total_cost: 0.0,
            messages: vec![
                AgentMessage {
                    id: "msg_init".to_string(),
                    sender: AgentRole::Architect,
                    recipient: None,
                    content: "Initializing kernel agent lifecycle scheduler. Connecting to model endpoints...".to_string(),
                    timestamp: 1718580000,
                }
            ],
            files: vec![],
        };

        // Dispatch initial task to Architect to boot orchestration sequence
        let _ = arch_tx.send(AgentTask {
            run_id: run_id.clone(),
            prompt: prompt.clone(),
            input_files: vec![],
        }).await;

        let mut steps_completed = 0;

        // Sequence loops
        while let Some(event) = event_receiver.recv().await {
            match event {
                AgentEvent::Progress { role, progress: agent_progress, message, tokens_used, cost_accrued, .. } => {
                    state.current_agent = Some(role);
                    state.status = format!("Agent {} is working...", role);
                    
                    // Scale progress: each step covers 20-25% of absolute progress
                    state.progress = (steps_completed as f32 * 23.0) + (agent_progress * 23.0) + 5.0;
                    state.total_tokens += tokens_used;
                    state.total_cost += cost_accrued;
                    
                    state.messages.push(AgentMessage {
                        id: Uuid::new_v4().to_string(),
                        sender: role,
                        recipient: None,
                        content: message,
                        timestamp: 1718580000,
                    });

                    let _ = window.emit("agent-progress", &state);
                }
                
                AgentEvent::Finished { role, output_files, .. } => {
                    state.files.extend(output_files.clone());
                    steps_completed += 1;

                    state.messages.push(AgentMessage {
                        id: Uuid::new_v4().to_string(),
                        sender: role,
                        recipient: None,
                        content: format!("Agent {} finished compilation check. Transferring outputs.", role),
                        timestamp: 1718580000,
                    });

                    match role {
                        AgentRole::Architect => {
                            let _ = back_tx.send(AgentTask {
                                run_id: run_id.clone(),
                                prompt: prompt.clone(),
                                input_files: output_files,
                            }).await;
                        }
                        AgentRole::Backend => {
                            let _ = front_tx.send(AgentTask {
                                run_id: run_id.clone(),
                                prompt: prompt.clone(),
                                input_files: output_files,
                            }).await;
                        }
                        AgentRole::Frontend => {
                            let _ = qa_tx.send(AgentTask {
                                run_id: run_id.clone(),
                                prompt: prompt.clone(),
                                input_files: output_files,
                            }).await;
                        }
                        AgentRole::QA => {
                            state.status = "completed".to_string();
                            state.progress = 100.0;
                            state.current_agent = None;
                            break; // Orchestration pipeline finished
                        }
                    }
                }
                
                AgentEvent::Failed { role, error, .. } => {
                    state.status = "failed".to_string();
                    state.current_agent = None;
                    return Err(format!("Pipeline runtime error in Agent {}: {}", role, error));
                }
            }
        }

        Ok(state)
    }
}
