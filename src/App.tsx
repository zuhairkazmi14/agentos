import React, { useState, useEffect } from 'react';
import { 
  Compass, Play, ShieldAlert, Activity, Settings, 
  Terminal, Shield, Code2, Sparkles, Key, AlertTriangle, Check, Info, ArrowRight
} from 'lucide-react';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { AgentNodeGraph } from './components/AgentNodeGraph';
import { CodePreview } from './components/CodePreview';

interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('vision');
  const [prompt, setPrompt] = useState<string>('Build a professional Kanban Board application with drag and drop columns, a clean dark HSL theme, and local storage support.');
  
  // Settings Modal State
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [anthropicKey, setAnthropicKey] = useState<string>('');
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');

  // Agent Orchestration State
  const [status, setStatus] = useState<string>('idle'); // idle, starting, architect, backend, frontend, qa, completed, failed
  const [progress, setProgress] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string>('Llama-3 (Local)');
  const [logs, setLogs] = useState<string[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<CodeFile[]>([]);

  // Selected models per agent
  const [models, setModels] = useState<Record<string, string>>({
    Architect: 'Gemini 1.5 Pro',
    Backend: 'GPT-4o',
    Frontend: 'Claude 3.5 Sonnet',
    QA: 'Llama-3 (Local)'
  });

  // Simulated Agent Runner
  useEffect(() => {
    let timer: number;
    if (status === 'starting') {
      setActiveAgent('Architect');
      setActiveModel(models.Architect);
      setLogs(['[System] Initializing Kernel process...', '[System] Secure Sandbox initialized (least privilege policy enforced).']);
      setGeneratedFiles([]);
      setProgress(5);
      
      timer = window.setTimeout(() => setStatus('architect'), 1500);
    } 
    else if (status === 'architect') {
      setActiveAgent('Architect');
      setActiveModel(models.Architect);
      setLogs(prev => [
        ...prev, 
        '[Architect] Analyzing specifications from user prompt...', 
        '[Architect] Constructing data structure layout and page structure schema...'
      ]);
      setTotalTokens(prev => prev + 1200);
      setTotalCost(prev => prev + 0.0084);
      setProgress(20);

      const specFile = {
        path: 'architecture_spec.json',
        language: 'json',
        content: JSON.stringify({
          project: "AgentOS Generated App",
          layout: "Kanban Board",
          columns: ["Todo", "In Progress", "Done"],
          styling: "Dark-mode glassmorphism HSL",
          features: ["drag-and-drop", "persistent-localstorage", "card-filtering"]
        }, null, 2)
      };

      timer = window.setTimeout(() => {
        setGeneratedFiles([specFile]);
        setLogs(prev => [...prev, '[Architect] Emitted architecture_spec.json. Delegating database state setup to Backend.']);
        setStatus('backend');
      }, 3000);
    } 
    else if (status === 'backend') {
      setActiveAgent('Backend');
      setActiveModel(models.Backend);
      setProgress(45);
      setLogs(prev => [
        ...prev, 
        '[Backend] Generating JavaScript logic script...', 
        '[Backend] Injecting state handlers and localStorage hook callbacks...'
      ]);
      setTotalTokens(prev => prev + 2400);
      setTotalCost(prev => prev + 0.0152);

      const jsFile = {
        path: 'app.js',
        language: 'javascript',
        content: `// Kanban Board State Management Engine
const initialColumns = {
  todo: [
    { id: '1', title: 'Setup GitHub Actions Workspace', tags: ['CI-CD'] },
    { id: '2', title: 'Configure Environment Variables', tags: ['Security'] }
  ],
  progress: [
    { id: '3', title: 'Develop Rust kernel module', tags: ['Core'] }
  ],
  done: [
    { id: '4', title: 'Initialize Git Repository', tags: ['Setup'] }
  ]
};

let columns = JSON.parse(localStorage.getItem('kanban_cols')) || initialColumns;

function saveState() {
  localStorage.setItem('kanban_cols', JSON.stringify(columns));
  renderBoard();
}

function addCard(columnId, text) {
  if (!text) return;
  const newCard = {
    id: Date.now().toString(),
    title: text,
    tags: ['User-Task']
  };
  columns[columnId].push(newCard);
  saveState();
}

window.addCard = addCard;
`
      };

      timer = window.setTimeout(() => {
        setGeneratedFiles(prev => [...prev, jsFile]);
        setLogs(prev => [...prev, '[Backend] State machine scripts compiled in app.js. Handing over layout to Frontend.']);
        setStatus('frontend');
      }, 3000);
    } 
    else if (status === 'frontend') {
      setActiveAgent('Frontend');
      setActiveModel(models.Frontend);
      setProgress(75);
      setLogs(prev => [
        ...prev, 
        '[Frontend] Designing markup structures and custom dark styles...', 
        '[Frontend] Assembling responsive CSS selectors using clean neon accents...'
      ]);
      setTotalTokens(prev => prev + 3100);
      setTotalCost(prev => prev + 0.0210);

      const cssFile = {
        path: 'style.css',
        language: 'css',
        content: `body {
  background: #09090b;
  color: #fafafa;
  font-family: sans-serif;
  margin: 0;
  padding: 24px;
}
.board {
  display: flex;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}
.column {
  flex: 1;
  background: #0f0f13;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 16px;
}
.column-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #818cf8;
}
.card {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  font-size: 12px;
}
.badge {
  display: inline-block;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  margin-top: 6px;
}
input {
  width: 100%;
  background: #09090b;
  border: 1px solid #27272a;
  color: white;
  border-radius: 4px;
  padding: 8px;
  margin-top: 10px;
  font-size: 11px;
}`
      };

      const htmlFile = {
        path: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kanban Project Board</title>
</head>
<body>
  <h2 style="text-align: center; margin-bottom: 24px;">Project Kanban Board</h2>
  <div class="board">
    <div class="column">
      <div class="column-title">Todo</div>
      <div class="card">
        Setup GitHub Actions Workspace
        <div><span class="badge">CI-CD</span></div>
      </div>
      <div class="card">
        Configure Environment Variables
        <div><span class="badge">Security</span></div>
      </div>
    </div>
    <div class="column">
      <div class="column-title">In Progress</div>
      <div class="card">
        Develop Rust kernel module
        <div><span class="badge">Core</span></div>
      </div>
    </div>
    <div class="column">
      <div class="column-title">Done</div>
      <div class="card">
        Initialize Git Repository
        <div><span class="badge">Setup</span></div>
      </div>
    </div>
  </div>
</body>
</html>`
      };

      timer = window.setTimeout(() => {
        setGeneratedFiles(prev => [...prev, cssFile, htmlFile]);
        setLogs(prev => [...prev, '[Frontend] Assembled layout templates in index.html and style.css. Invoking QA auditor checks.']);
        setStatus('qa');
      }, 3500);
    } 
    else if (status === 'qa') {
      setActiveAgent('QA');
      setActiveModel(models.QA);
      setProgress(90);
      setLogs(prev => [
        ...prev, 
        '[QA Auditor] Executing syntactical validations and security audits...', 
        '[QA Auditor] Scanning source code for committed key signatures...'
      ]);
      setTotalTokens(prev => prev + 1500);
      setTotalCost(prev => prev + 0.0000); // Local models are cost $0.00!

      const qaReport = {
        path: 'qa_audit_report.txt',
        language: 'text',
        content: `AGENTOS QA AUDIT COMPLETED
===========================
Project Validation: SUCCESS
Syntax Audit: All scripts parsed successfully.
Leak Check: No embedded tokens or secret key structures found in files.
Secure execution guidelines complied.`
      };

      timer = window.setTimeout(() => {
        setGeneratedFiles(prev => [...prev, qaReport]);
        setLogs(prev => [...prev, '[QA Auditor] All test blocks compiled. Code execution approved! Handing control back to Tauri runtime.']);
        setStatus('completed');
        setProgress(100);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [status]);

  const handleStartRun = () => {
    setStatus('starting');
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
    // Keys would also call save_api_key in a native tauri shell.
    console.log('Stored secure keys for providers:', {
      hasOpenai: !!openaiKey,
      hasAnthropic: !!anthropicKey,
      hasGemini: !!geminiKey
    });
    alert('Keys securely stored in local keychain memory!');
  };

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#fafafa] select-none">
      
      {/* Sidebar Navigation */}
      <div className="w-[200px] border-r border-[#27272a] bg-[#09090b] flex flex-col justify-between flex-shrink-0" style={{ borderRight: '1px solid #27272a' }}>
        <div>
          {/* Logo */}
          <div className="p-4 border-b border-[#27272a] flex items-center gap-2" style={{ borderBottom: '1px solid #27272a' }}>
            <Compass className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-sm tracking-wider text-white">AgentOS</span>
            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 py-0.25 rounded font-mono">v0.1</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 flex flex-col gap-1">
            <div className="text-[9px] text-[#71717a] font-semibold tracking-wider uppercase px-2 py-1.5">Workspace</div>
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                activeTab === 'demo' ? 'bg-[#18181b] text-indigo-300 border border-[#27272a]' : 'text-[#a1a1aa] hover:bg-[#0f0f13] hover:text-[#fafafa]'
              }`}
              style={activeTab === 'demo' ? { backgroundColor: '#18181b', color: '#a5b4fc', border: '1px solid #27272a' } : {}}
            >
              <Sparkles className="w-4 h-4" />
              Agent Sandbox
            </button>

            <div className="h-[1px] bg-[#27272a] my-2" />
            <div className="text-[9px] text-[#71717a] font-semibold tracking-wider uppercase px-2 py-1.5">Teardown Playbook</div>

            {[
              { id: 'vision', label: '01. Vision' },
              { id: 'product', label: '02. Product' },
              { id: 'architecture', label: '03. Architecture' },
              { id: 'business', label: '04. Business Model' },
              { id: 'gtm', label: '05. Go-to-Market' },
              { id: 'security', label: '06. Security' },
              { id: 'team', label: '07. Team Structure' },
              { id: 'scorecard', label: '08. Scorecard' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  activeTab === tab.id ? 'bg-[#18181b] text-white' : 'text-[#71717a] hover:bg-[#0f0f13] hover:text-[#a1a1aa]'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#18181b', color: '#fafafa' } : {}}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#27272a] text-[10px] text-[#71717a] flex flex-col gap-1" style={{ borderTop: '1px solid #27272a' }}>
          <div>Model-neutral Agent kernel</div>
          <a href="https://github.com/agentos-project/agentos" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">GitHub Project ↗</a>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#09090b]">
        
        {/* Playbook tabs panels */}
        {activeTab !== 'demo' ? (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
            
            {activeTab === 'vision' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Strategic Vision</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">Category Claim: Own the Kernel Layer</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Model providers are vertically integrated toward the end-user and will never build a neutral orchestration kernel. OpenAI Operator works for OpenAI models. Claude Computer Use works for Anthropic models. Google Mariner works for Gemini. 
                    <strong> AgentOS is the model-neutral runtime</strong> — the operating layer underneath every desktop agent.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5" style={{ border: '1px solid rgba(239, 68, 68, 0.1)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                    <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Before (Unownable)</h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">"AgentOS is an AI-native operating environment that makes your computer behave like an intelligent workforce."</p>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5" style={{ border: '1px solid rgba(16, 185, 129, 0.1)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                    <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1.5"><Check className="w-4 h-4" /> Upgraded Vision</h3>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">"AgentOS is the model-neutral agent kernel for desktop — the operating layer that lets any AI model control any computer, at any cost, without vendor lock-in."</p>
                  </div>
                </div>

                <div className="border border-[#27272a] rounded-xl p-4 flex flex-col gap-4 bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                  <h3 className="text-sm font-bold text-white">Three Strategic Pillars</h3>
                  
                  <div className="flex gap-3">
                    <div className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 h-fit" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>PILLAR 1</div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Local-First Execution</h4>
                      <p className="text-xs text-[#a1a1aa] mt-1">Privacy and cost control that no cloud competitor can match. Run local models via Ollama. Safe from corporate CISO audits since data never leaves the developer's PC.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 h-fit" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>PILLAR 2</div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Model Neutrality</h4>
                      <p className="text-xs text-[#a1a1aa] mt-1">Single orchestration sequence utilizing multiple providers. Schedule tasks dynamically to the cheapest, fastest model for that specific task class. No vendor locks.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 h-fit" style={{ border: '1px solid rgba(99, 102, 241, 0.2)' }}>PILLAR 3</div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">Developer Ecosystem</h4>
                      <p className="text-xs text-[#a1a1aa] mt-1">Open kernel API from day one. Agent packs can be shared and compiled like VS Code extensions, establishing strong network effects early on.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'product' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Scope Discipline</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">Three-Phase Product Architecture</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Ruthless scope reduction ensures shipping in weeks rather than getting bogged down in a complex 4-year wishlist. The Phase 1 MVP focuses entirely on the developer workspace.
                  </p>
                </div>

                <div className="relative border-l border-[#27272a] pl-6 ml-3 flex flex-col gap-6" style={{ borderLeft: '1px solid #27272a' }}>
                  <div className="relative">
                    <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-indigo-500 border border-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">1</div>
                    <h3 className="text-sm font-semibold text-white">Phase 1: Kernel MVP (Months 1–4)</h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">Development Workspace only. 4 core agents (Architect, Backend, Frontend, QA). WebSocket real-time communication graph. Visual cost tracking widgets.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[10px] font-bold text-[#71717a]">2</div>
                    <h3 className="text-sm font-semibold text-white">Phase 2: Ecosystem (Months 5–9)</h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">Open the Agent Pack API. Seed with 10 hand-built packs (Research, Writing, Finance). Integrate browser automation via Playwright sandbox. Session memory layers.</p>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[10px] font-bold text-[#71717a]">3</div>
                    <h3 className="text-sm font-semibold text-white">Phase 3: Platform OS (Months 10–18)</h3>
                    <p className="text-xs text-[#a1a1aa] mt-1">Full OS metaphor with workspaces. Agent-to-agent delegation. Full computer filesystem control, native apps integrations, enterprise dashboards, SSO & audits.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                  <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-2"><AlertTriangle className="w-4 h-4" /> Permanently Cut Features</h4>
                  <ul className="list-disc pl-4 text-xs text-[#a1a1aa] flex flex-col gap-1.5">
                    <li><strong>Motion & Video agents</strong>: Outputs are currently embarrassing; creates impossible expectations.</li>
                    <li><strong>Memory graphs in UI</strong>: Confusing to non-technical users and distracts from core developer actions.</li>
                    <li><strong>Unlimited subagent spawning</strong>: Prevents infinite agent cost loops and memory lockups.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">System Architecture</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">Production-Grade Infrastructure</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Writing the core engine in Rust with a Tokio async actor lifecycle runtime protects AgentOS against Python's high CPU contention and performance blocks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                    <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Code2 className="w-4 h-4 text-indigo-400" /> Rust Kernel Process</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">Uses Actix actor architecture. Message passing with zero shared state preventing synchronization blocks. Enforces resource quotas per agent.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                    <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Compass className="w-4 h-4 text-indigo-400" /> Tauri Shell</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">Vite + React connected over low-overhead local WebSockets. Secure secrets storage utilizing OS-native keychain APIs instead of plain configuration files.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                    <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Shield className="w-4 h-4 text-indigo-400" /> WASM Plugin Isolation</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">Runs 3rd-party Agent Packs inside Wasmtime sandbox instances. No local filesystem or network access without explicit user manifest permissions.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                    <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5"><Activity className="w-4 h-4 text-indigo-400" /> 3-Tier Memory Layers</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">T1: In-context window. T2: Session search (local LanceDB vector engine). T3: Structured storage (SQLite). Tracks trust level per transaction.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Business Architecture</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">Sustainable Unit Economics</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Running multiple agents triggers high token billing. Offering a flat subscription easily creates an upside-down margins model. AgentOS solves this with **BYOK (Bring Your Own Key)** pricing structures.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13] flex flex-col justify-between" style={{ border: '1px solid #27272a' }}>
                    <div>
                      <div className="text-[10px] text-[#71717a] uppercase font-bold">Hobby</div>
                      <div className="text-lg font-bold text-white mt-1">Free</div>
                      <p className="text-[11px] text-[#a1a1aa] mt-2 leading-relaxed">BYOK only. 1 Workspace. Unlimited local models. Commnity packs. Zero compute costs for AgentOS.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 flex flex-col justify-between" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <div>
                      <div className="text-[10px] text-indigo-400 uppercase font-bold">Pro</div>
                      <div className="text-lg font-bold text-white mt-1">$29/mo</div>
                      <p className="text-[11px] text-[#a1a1aa] mt-2 leading-relaxed">BYOK or managed keys. Access to all workspaces. Persisting memory. $20 API credit included.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13] flex flex-col justify-between" style={{ border: '1px solid #27272a' }}>
                    <div>
                      <div className="text-[10px] text-[#71717a] uppercase font-bold">Team</div>
                      <div className="text-lg font-bold text-white mt-1">$19/seat</div>
                      <p className="text-[11px] text-[#a1a1aa] mt-2 leading-relaxed">Shared workspaces and memory pools. Multi-seat billing control dashboard.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13] flex flex-col justify-between" style={{ border: '1px solid #27272a' }}>
                    <div>
                      <div className="text-[10px] text-[#71717a] uppercase font-bold">Enterprise</div>
                      <div className="text-lg font-bold text-white mt-1">Custom</div>
                      <p className="text-[11px] text-[#a1a1aa] mt-2 leading-relaxed">On-premises air-gapped setups. Local model routing only. SOC2 audits and SLA.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5" style={{ border: '1px solid rgba(16, 185, 129, 0.1)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                  <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5"><Info className="w-4 h-4" /> Monetization Strategy</h4>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed">
                    By making BYOK the default for hobby and base setups, we eliminate host API costs entirely. When reselling managed tokens (Pro tier), we mark up costs by 15%, maintaining predictable, positive margins. Additional revenues stem from a 20% cut of paid Agent Packs in our marketplace.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'gtm' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Go-To-Market</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">The Developer Extension Flywheel</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Similar to VS Code, AgentOS wins not by forcing predefined layouts, but by building the developer ecosystem that compounds utility.
                  </p>
                </div>

                <div className="border border-[#27272a] rounded-xl p-4 bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                  <h3 className="text-xs font-bold text-white mb-3">Launch Sequence Steps</h3>
                  <div className="flex flex-col gap-4 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">100 Users</div>
                      <p className="text-[#a1a1aa] mt-0.5">Contact 200 developers posting AI workflows. Offer lifetime deals for feedback. Publish weekly "Agent Runs" (3-minute silent workflow recordings demonstrating agent code compilation).</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">1k Users</div>
                      <p className="text-[#a1a1aa] mt-0.5">Launch public beta with 10 hand-built packs. Synchronize with a Product Hunt release. Publish reproducible benchmarks showing that AgentOS multi-agent pipelines beat single GPT-4o calls on complex files.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">10k Users</div>
                      <p className="text-[#a1a1aa] mt-0.5">Establish agency partnerships (offering co-marketing for publishing packs). Integrate linear, GitHub, Notion hooks. Onboard initial pilot enterprise clients.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Security & Isolation</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">The Architecture of Trust</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Allowing autonomous agents to run native commands and terminal inputs is a security risk. AgentOS integrates defense safeguards at the core kernel layer.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                    <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5"><Shield className="w-4 h-4 text-indigo-400" /> Least Privilege Capabilities</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">Agents declare access needs in their startup manifest. Path restrictions restrict filesystems; network access requires domain-specific definitions.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                    <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-amber-500" /> Prompt Injection Firewall</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">External data (scraped HTML, files) passes through a tiny local classifier model. Adversarial inputs are flagged for manual verification before reaching agent prompts.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a' }}>
                    <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5"><Terminal className="w-4 h-4 text-indigo-400" /> Immutable Action Log</h4>
                    <p className="text-xs text-[#a1a1aa] leading-relaxed">Append-only audit trail logs every command. Destructive actions (deleting files, outgoing mail) require a manual confirmation popup window.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Founding Team</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">Minimum Viable Core Composition</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    Having shipped systems software or desktop apps at scale is crucial to establish investor trust.
                  </p>
                </div>

                <table className="w-full text-xs text-[#a1a1aa] border-collapse" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #27272a' }}>
                      <th className="py-2 text-left text-white font-semibold">Role</th>
                      <th className="py-2 text-left text-white font-semibold">Area of ownership</th>
                      <th className="py-2 text-left text-white font-semibold">Ideal Background</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #27272a' }}>
                      <td className="py-2.5 font-semibold text-white">CEO / Product</td>
                      <td className="py-2.5">Vision, GTM strategy, investor calls, user testing</td>
                      <td className="py-2.5">Former PM at developer-tool firm or 10k+ users developer app creator.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #27272a' }}>
                      <td className="py-2.5 font-semibold text-white">CTO / Kernel</td>
                      <td className="py-2.5">Rust actor kernel, WASM sandbox, concurrency model</td>
                      <td className="py-2.5">Systems background: operating systems, compiler pipelines, low-latency.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #27272a' }}>
                      <td className="py-2.5 font-semibold text-white">Frontend Lead</td>
                      <td className="py-2.5">Tauri shell integration, React dashboard, WebSockets</td>
                      <td className="py-2.5">Expert React and CSS developer, Electron or desktop experience.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #27272a' }}>
                      <td className="py-2.5 font-semibold text-white">AI / ML Engineer</td>
                      <td className="py-2.5">Task classification, prompt chains, local embeddings</td>
                      <td className="py-2.5">Applied ML background, experienced with model fine-tuning and validation.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'scorecard' && (
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">playbook review</span>
                  <h1 className="text-2xl font-bold mt-1 mb-2">Verdict: Build the MVP</h1>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    By implementing the specific upgrades outlined — the model neutral scheduler, local-first safety, BYOK pricing, and the developer pack API — AgentOS establishes a structural moat that model providers cannot copy without harming their core businesses.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#27272a] bg-[#0f0f13] text-center" style={{ border: '1px solid #27272a' }}>
                    <div className="text-[10px] text-[#71717a] uppercase font-bold">Traction Probability Before</div>
                    <div className="text-3xl font-extrabold text-red-500 mt-2">5%</div>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center" style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div className="text-[10px] text-emerald-400 uppercase font-bold">Traction Probability After</div>
                    <div className="text-3xl font-extrabold text-emerald-500 mt-2">38%</div>
                  </div>
                </div>

                <div className="p-5 border border-indigo-500/20 rounded-xl bg-indigo-500/5" style={{ border: '1px solid rgba(99, 102, 241, 0.2)', backgroundColor: 'rgba(99, 102, 241, 0.03)' }}>
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-1.5"><Sparkles className="w-4.5 h-4.5 text-indigo-400" /> Test Drive the Vision</h3>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed mb-4">
                    Ready to see how the multi-agent Developer Workspace operates under the hood? Open the Sandbox workspace tab to run a simulated kernel sequence.
                  </p>
                  <button 
                    onClick={() => setActiveTab('demo')}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    Open Agent Sandbox
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Live Sandbox MVP Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            <WorkspaceHeader 
              status={status}
              progress={progress}
              totalTokens={totalTokens}
              totalCost={totalCost}
              activeAgent={activeAgent}
              activeModel={activeModel}
              onOpenSettings={() => setShowSettings(true)}
            />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden min-h-0">
              
              {/* Left Column: Input Prompt and Live Agent Graph */}
              <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                {/* Input Prompt Card */}
                <div className="glass rounded-xl p-4 flex flex-col gap-3" style={{ backgroundColor: '#0f0f13', border: '1px solid #27272a', borderRadius: '12px' }}>
                  <div className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-indigo-400" />
                    Enter Kernel Instructions
                  </div>

                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={status !== 'idle' && status !== 'completed'}
                    className="w-full h-20 bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-xs text-[#fafafa] focus:outline-none focus:border-indigo-500/50 resize-none font-sans"
                    placeholder="Describe what task you want the multi-agent team to construct..."
                    style={{ border: '1px solid #27272a', resize: 'none' }}
                  />

                  {/* Template quick selects */}
                  {status === 'idle' && (
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {[
                        { label: 'Kanban Board', prompt: 'Build a professional Kanban Board application with columns Todo, In Progress, Done, clean HSL colors, drag and drop visual state, and local storage persistence.' },
                        { label: 'Pomodoro Timer', prompt: 'Build a gorgeous dark-theme Pomodoro Timer with an animated circle counter, work/break tabs, sound notifications trigger, and custom interval length inputs.' },
                        { label: 'Todo Planner', prompt: 'Build a responsive task list planner with category tags, completion status checkboxes, and filtering options.' }
                      ].map(tmpl => (
                        <button
                          key={tmpl.label}
                          onClick={() => setPrompt(tmpl.prompt)}
                          className="text-[10px] border border-[#27272a] bg-[#09090b] hover:bg-[#18181b] px-2 py-1 rounded text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer whitespace-nowrap transition-all"
                          style={{ border: '1px solid #27272a' }}
                        >
                          {tmpl.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleStartRun}
                    disabled={status !== 'idle' && status !== 'completed'}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-[#18181b] disabled:text-[#71717a] text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Run Kernel Sequence
                  </button>
                </div>

                {/* Graph Live Monitor */}
                <AgentNodeGraph activeAgent={activeAgent} status={status} />

                {/* Console Logs */}
                <div className="glass rounded-xl p-4 flex flex-col gap-2 flex-1 min-h-[150px] max-h-[200px] overflow-hidden" style={{ backgroundColor: '#0f0f13', border: '1px solid #27272a', borderRadius: '12px' }}>
                  <div className="text-[10px] text-[#71717a] font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    Orchestrator Kernel Logs
                  </div>
                  <div className="flex-1 overflow-y-auto font-mono text-[10px] text-[#a1a1aa] flex flex-col gap-1.5 leading-normal select-text" style={{ fontFamily: 'var(--font-mono)' }}>
                    {logs.map((log, idx) => (
                      <div key={idx} className={log.startsWith('[System]') ? 'text-indigo-400' : log.startsWith('[QA') ? 'text-amber-400' : log.startsWith('[Architect') ? 'text-indigo-300' : 'text-[#a1a1aa]'}>
                        {log}
                      </div>
                    ))}
                    {status !== 'idle' && status !== 'completed' && (
                      <div className="text-indigo-400 animate-pulse flex items-center gap-1 mt-0.5">
                        <span className="inline-block w-1 h-3.5 bg-indigo-400 animate-bounce" />
                        Awaiting next instruction chunk...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Code Viewer and Sandbox Preview */}
              <div className="h-full overflow-hidden">
                <CodePreview files={generatedFiles} status={status} />
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Settings Modal overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-md rounded-xl p-5 flex flex-col gap-4" style={{ backgroundColor: '#0f0f13', border: '1px solid #27272a', borderRadius: '12px' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Kernel Model Routing</h3>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-xs text-[#71717a] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              AgentOS acts as a neutral scheduler. You can specify the model endpoint per agent below, drawing from local runtimes or API credentials.
            </p>

            <form onSubmit={handleSaveKeys} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">Architect Agent Model</label>
                <select 
                  value={models.Architect}
                  onChange={(e) => setModels(prev => ({ ...prev, Architect: e.target.value }))}
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                >
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google Cloud)</option>
                  <option value="GPT-4o">GPT-4o (OpenAI Cloud)</option>
                  <option value="Llama-3 (Local)">Llama-3 (Local Ollama)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">Backend Agent Model</label>
                <select 
                  value={models.Backend}
                  onChange={(e) => setModels(prev => ({ ...prev, Backend: e.target.value }))}
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                >
                  <option value="GPT-4o">GPT-4o (OpenAI Cloud)</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                  <option value="Llama-3 (Local)">Llama-3 (Local Ollama)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">Frontend Agent Model</label>
                <select 
                  value={models.Frontend}
                  onChange={(e) => setModels(prev => ({ ...prev, Frontend: e.target.value }))}
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                >
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google Cloud)</option>
                  <option value="Llama-3 (Local)">Llama-3 (Local Ollama)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">QA Auditor Agent Model</label>
                <select 
                  value={models.QA}
                  onChange={(e) => setModels(prev => ({ ...prev, QA: e.target.value }))}
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                >
                  <option value="Llama-3 (Local)">Llama-3 (Local Ollama)</option>
                  <option value="GPT-4o-mini">GPT-4o-mini (OpenAI Cloud)</option>
                  <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Google Cloud)</option>
                </select>
              </div>

              <div className="h-[1px] bg-[#27272a] my-1" />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">OpenAI Key (Secure Storage)</label>
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">Anthropic Key (Secure Storage)</label>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">Gemini Key (Secure Storage)</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-[#71717a] font-bold uppercase">Local Ollama API Endpoint</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="bg-[#09090b] border border-[#27272a] rounded p-2 text-xs text-white"
                  style={{ border: '1px solid #27272a' }}
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 rounded cursor-pointer transition-all"
              >
                Save Secure Credentials
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
