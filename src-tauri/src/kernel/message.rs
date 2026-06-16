use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum AgentRole {
    Architect,
    Backend,
    Frontend,
    QA,
}

impl std::fmt::Display for AgentRole {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AgentRole::Architect => write!(f, "Architect"),
            AgentRole::Backend => write!(f, "Backend"),
            AgentRole::Frontend => write!(f, "Frontend"),
            AgentRole::QA => write!(f, "QA"),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentMessage {
    pub id: String,
    pub sender: AgentRole,
    pub recipient: Option<AgentRole>,
    pub content: String,
    pub timestamp: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeFile {
    pub path: String,
    pub content: String,
    pub language: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentRunState {
    pub run_id: String,
    pub prompt: String,
    pub current_agent: Option<AgentRole>,
    pub status: String,
    pub progress: f32,
    pub total_tokens: u32,
    pub total_cost: f64,
    pub messages: Vec<AgentMessage>,
    pub files: Vec<CodeFile>,
}
