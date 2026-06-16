use tokio::sync::mpsc;
use crate::kernel::{AgentRole, CodeFile};

#[derive(Debug)]
pub struct AgentTask {
    pub run_id: String,
    pub prompt: String,
    pub input_files: Vec<CodeFile>,
}

#[derive(Debug)]
pub enum AgentEvent {
    Progress {
        run_id: String,
        role: AgentRole,
        progress: f32,
        message: String,
        tokens_used: u32,
        cost_accrued: f64,
    },
    Finished {
        run_id: String,
        role: AgentRole,
        output_files: Vec<CodeFile>,
    },
    Failed {
        run_id: String,
        role: AgentRole,
        error: String,
    },
}

pub struct AgentActor {
    role: AgentRole,
    receiver: mpsc::Receiver<AgentTask>,
    sender: mpsc::Sender<AgentEvent>,
}

impl AgentActor {
    pub fn new(
        role: AgentRole,
        receiver: mpsc::Receiver<AgentTask>,
        sender: mpsc::Sender<AgentEvent>,
    ) -> Self {
        Self {
            role,
            receiver,
            sender,
        }
    }

    pub async fn run_loop(mut self) {
        while let Some(task) = self.receiver.recv().await {
            let role = self.role;
            let sender = self.sender.clone();
            
            // Spawn an async block to simulate computation workloads
            tokio::spawn(async move {
                let _ = sender.send(AgentEvent::Progress {
                    run_id: task.run_id.clone(),
                    role,
                    progress: 0.1,
                    message: format!("Agent {} loaded module contexts. Processing prompts...", role),
                    tokens_used: 1200,
                    cost_accrued: if role == AgentRole::QA { 0.0 } else { 0.006 },
                }).await;

                // Simulate networking / model reasoning time
                tokio::time::sleep(tokio::time::Duration::from_millis(1500)).await;

                let files = match role {
                    AgentRole::Architect => vec![
                        CodeFile {
                            path: "architecture_spec.json".to_string(),
                            content: r#"{
  "project": "AgentOS Generated Task Dashboard",
  "layout": "Kanban Columns",
  "styling": "Dark glass theme"
}"#.to_string(),
                            language: "json".to_string(),
                        }
                    ],
                    AgentRole::Backend => vec![
                        CodeFile {
                            path: "app.js".to_string(),
                            content: r#"// Backend State Engine
const state = { columns: ['Todo', 'Done'] };
console.log('State scheduler online.', state);
"#.to_string(),
                            language: "javascript".to_string(),
                        }
                    ],
                    AgentRole::Frontend => vec![
                        CodeFile {
                            path: "index.html".to_string(),
                            content: r#"<!DOCTYPE html>
<html>
<head><title>AgentOS Dashboard</title></head>
<body style="background:#09090b; color:#fafafa; font-family:sans-serif; text-align:center;">
  <h2>AgentOS Workspace Sandbox</h2>
  <p>Your multi-agent program runs in secure execution mode.</p>
</body>
</html>"#.to_string(),
                            language: "html".to_string(),
                        },
                        CodeFile {
                            path: "style.css".to_string(),
                            content: r#"body { margin: 0; padding: 20px; }"#.to_string(),
                            language: "css".to_string(),
                        }
                    ],
                    AgentRole::QA => vec![
                        CodeFile {
                            path: "qa_audit_report.txt".to_string(),
                            content: r#"QA AUDIT: COMPLIANT. No leak signatures found."#.to_string(),
                            language: "text".to_string(),
                        }
                    ],
                };

                let _ = sender.send(AgentEvent::Finished {
                    run_id: task.run_id,
                    role,
                    output_files: files,
                }).await;
            });
        }
    }
}
