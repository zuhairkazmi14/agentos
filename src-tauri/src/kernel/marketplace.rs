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
fn get_default_packs() -> Vec<AgentPack> { vec![] }

