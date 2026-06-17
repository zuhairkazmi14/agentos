use std::fs::{self, File};
use std::io::{Read, Write};
use crate::kernel::AgentRunState;

const MEMORY_FILE: &str = "agentos_memory.json";

