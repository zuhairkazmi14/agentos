# Contributing to AgentOS

We are thrilled that you are interested in contributing to AgentOS! As an open-source, model-neutral desktop agent kernel, we rely on contributors like you to build a secure, robust ecosystem.

---

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:
*   Be respectful and welcoming to all contributors.
*   Prioritize user privacy and security (never submit PRs that leak secrets, disable sandboxing, or open unauthorized network egress).
*   Avoid adding vendor lock-in to any single model provider.

---

## Development Setup

To set up the workspace for local development:

### 1. Fork & Clone
Fork the repository on GitHub and clone it locally:
```bash
git clone https://github.com/your-username/agentOS.git
cd agentOS
```

### 2. Node.js Frontend Development
Installs all dependencies and runs the Vite local development server for browser testing:
```bash
npm install
npm run dev
```

### 3. Rust Kernel Development (Optional)
If you are working on native integrations or Tauri commands, you need to install Rust. Visit [rustup.rs](https://rustup.rs) to install.
Verify your toolchain and run:
```bash
# Check rust versions
rustc --version
cargo --version

# Run the Tauri application in debug mode
npm run tauri dev
```

---

## Branching & Commit Guidelines

*   **Branch names**:
    *   Features: `feature/brief-description`
    *   Bug fixes: `bugfix/brief-description`
    *   Docs: `docs/brief-description`
*   **Commit messages**: Use semantic commit structures:
    *   `feat: add Ollama model routing`
    *   `fix: fix WebSocket reconnection timing`
    *   `docs: update installation instructions`

---

## Coding Standards

### Frontend (TypeScript + React)
*   Format using Prettier.
*   Ensure TypeScript compiles without warnings (`npm run lint` or `npx tsc --noEmit`).
*   Keep components small, responsive, and styled using the core CSS variables in `src/index.css`.

### Backend (Rust)
*   Format code using `cargo fmt`.
*   Run `cargo clippy` to check for common issues.
*   Ensure all Tauri commands are documented and use proper serialization (`serde`).

---

## Security Policies

> [!CAUTION]
> **API Keys and Credentials**: Under no circumstances should API keys, secrets, or `.env` files be committed to this repository. The `.gitignore` includes patterns to prevent accidental staging. Always double check with `git diff --staged` before committing.

*   If you discover a security vulnerability, please do NOT create a public issue. Email security@agentos.dev instead.
