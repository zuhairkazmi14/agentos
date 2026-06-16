import React, { useState, useEffect } from 'react';
import { FileCode, Play, Terminal, Check } from 'lucide-react';

interface CodeFile {
  path: string;
  content: string;
  language: string;
}

interface CodePreviewProps {
  files: CodeFile[];
  status: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ files, status }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'sandbox'>('editor');
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-switch to sandbox when run is completed or files are added
  useEffect(() => {
    if (status === 'completed' && files.length > 0) {
      setActiveTab('sandbox');
    }
  }, [status, files.length]);

  const handleCopy = () => {
    if (files.length === 0) return;
    navigator.clipboard.writeText(files[activeFileIndex]?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Construct srcDoc for the sandbox iframe
  const getSandboxSrcDoc = () => {
    const htmlFile = files.find(f => f.path.endsWith('.html'));
    const cssFile = files.find(f => f.path.endsWith('.css'));
    const jsFile = files.find(f => f.path.endsWith('.js'));

    let htmlContent = htmlFile?.content || `
      <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #09090b; color: #a1a1aa; padding: 20px; text-align: center;">
        <h3 style="color: white; margin-bottom: 8px;">Waiting for Agent Execution</h3>
        <p style="font-size: 13px; max-width: 320px;">Once the Architect, Backend, Frontend, and QA finish scheduling, your code output will appear here dynamically.</p>
      </div>
    `;

    // Inject CSS if present
    if (cssFile) {
      if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `<style>${cssFile.content}</style></head>`);
      } else {
        htmlContent = `<style>${cssFile.content}</style>${htmlContent}`;
      }
    }

    // Inject JS if present
    if (jsFile) {
      const jsScriptTag = `<script>${jsFile.content}</script>`;
      if (htmlContent.includes('</body>')) {
        htmlContent = htmlContent.replace('</body>', `${jsScriptTag}</body>`);
      } else {
        htmlContent = `${htmlContent}${jsScriptTag}`;
      }
    }

    return htmlContent;
  };

  return (
    <div className="glass rounded-xl overflow-hidden flex flex-col h-full" style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}>
      
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#27272a] bg-[#0f0f13]" style={{ borderBottom: '1px solid #27272a', backgroundColor: '#0f0f13' }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'editor' ? 'bg-[#18181b] text-white border border-[#27272a]' : 'text-[#a1a1aa] hover:text-white'
            }`}
            style={activeTab === 'editor' ? { backgroundColor: '#18181b', border: '1px solid #27272a' } : {}}
          >
            <FileCode className="w-3.5 h-3.5" />
            Source Code
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'sandbox' ? 'bg-[#18181b] text-white border border-[#27272a]' : 'text-[#a1a1aa] hover:text-white'
            }`}
            style={activeTab === 'sandbox' ? { backgroundColor: '#18181b', border: '1px solid #27272a' } : {}}
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            Live Sandbox
          </button>
        </div>

        {activeTab === 'editor' && files.length > 0 && (
          <button
            onClick={handleCopy}
            className="text-[11px] font-medium px-2.5 py-1 rounded border border-[#27272a] hover:bg-[#18181b] text-[#a1a1aa] hover:text-white transition-all cursor-pointer"
            style={{ backgroundColor: '#09090b', border: '1px solid #27272a' }}
          >
            {copied ? (
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-400" /> Copied</span>
            ) : (
              'Copy Code'
            )}
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-[300px] overflow-hidden flex flex-col">
        {activeTab === 'editor' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {files.length > 0 ? (
              <>
                {/* File list sub-tab */}
                <div className="flex border-b border-[#27272a] bg-[#09090b] px-4 py-1.5 gap-2 overflow-x-auto" style={{ borderBottom: '1px solid #27272a' }}>
                  {files.map((file, idx) => (
                    <button
                      key={file.path}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded transition-all cursor-pointer ${
                        activeFileIndex === idx ? 'bg-[#18181b] text-indigo-300' : 'text-[#71717a] hover:text-[#a1a1aa]'
                      }`}
                      style={activeFileIndex === idx ? { backgroundColor: '#18181b', color: '#a5b4fc' } : {}}
                    >
                      {file.path}
                    </button>
                  ))}
                </div>

                {/* Code Viewer */}
                <div className="flex-1 overflow-auto p-4 bg-[#09090b] font-mono text-xs text-[#a1a1aa] leading-relaxed select-text" style={{ fontFamily: 'var(--font-mono)' }}>
                  <pre className="whitespace-pre-wrap">
                    <code>
                      {files[activeFileIndex]?.content}
                    </code>
                  </pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#71717a] gap-2 p-6 text-center">
                <Terminal className="w-8 h-8 text-[#27272a]" />
                <div>
                  <div className="text-xs font-semibold text-white">No code generated yet</div>
                  <p className="text-[11px] max-w-[240px] mt-1 text-[#71717a]">Enter a prompt above and click "Run Kernel Sequence" to start generating application code.</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-white relative flex flex-col h-full">
            <iframe
              title="AgentOS MVP Output Sandbox"
              srcDoc={getSandboxSrcDoc()}
              className="w-full h-full border-none flex-1 bg-white"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  );
};
