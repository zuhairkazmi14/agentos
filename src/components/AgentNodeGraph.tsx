import React from 'react';
import { FileText, Code2, MonitorPlay, CheckSquare } from 'lucide-react';

interface AgentNodeGraphProps {
  activeAgent: string | null;
  status: string;
}

export const AgentNodeGraph: React.FC<AgentNodeGraphProps> = ({ activeAgent, status }) => {
  const isAgentActive = (agent: string) => {
    return activeAgent?.toLowerCase() === agent.toLowerCase() && status !== 'completed' && status !== 'idle';
  };

  const getAgentNodeStyle = (agent: string, baseColor: string, activeBg: string) => {
    const isActive = isAgentActive(agent);
    return {
      border: isActive ? `2px solid ${baseColor}` : '1px solid #27272a',
      backgroundColor: isActive ? activeBg : '#0f0f13',
      boxShadow: isActive ? `0 0 20px ${baseColor}33` : 'none',
      transition: 'all 0.3s ease',
    };
  };

  return (
    <div className="glass rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden" 
         style={{ height: '360px', backgroundColor: '#0f0f13', borderRadius: '12px', border: '1px solid #27272a' }}>
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', 
             backgroundSize: '16px 16px' 
           }} 
      />

      <div className="text-[10px] text-[#71717a] font-medium tracking-wider uppercase mb-6 flex items-center gap-1.5 absolute top-4 left-4">
        <MonitorPlay className="w-3.5 h-3.5 text-indigo-400" />
        Kernel Orchestration Live-Stream
      </div>

      {/* Main Node Graph */}
      <div className="relative w-full max-w-[500px] h-[220px] flex items-center justify-between mt-4">
        
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="grad-arch-back" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="grad-back-qa" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="grad-qa-front" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="grad-front-qa" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Line 1: Architect -> Backend */}
          <path d="M 100,60 H 400" stroke="#27272a" strokeWidth="2" fill="none" />
          {isAgentActive('backend') && (
            <path d="M 100,60 H 400" stroke="url(#grad-arch-back)" strokeWidth="2" fill="none" className="animate-flow-line" />
          )}

          {/* Line 2: Backend -> QA */}
          <path d="M 400,60 V 160" stroke="#27272a" strokeWidth="2" fill="none" />
          {isAgentActive('qa') && activeAgent?.toLowerCase() === 'qa' && (
            <path d="M 400,60 V 160" stroke="url(#grad-back-qa)" strokeWidth="2" fill="none" className="animate-flow-line" />
          )}

          {/* Line 3: QA -> Frontend */}
          <path d="M 400,160 H 100" stroke="#27272a" strokeWidth="2" fill="none" />
          {isAgentActive('frontend') && (
            <path d="M 400,160 H 100" stroke="url(#grad-qa-front)" strokeWidth="2" fill="none" className="animate-flow-line" />
          )}

          {/* Line 4: Frontend -> QA */}
          <path d="M 100,160 V 60" stroke="#27272a" strokeWidth="2" fill="none" />
          {isAgentActive('architect') && status !== 'idle' && (
            <path d="M 100,160 V 60" stroke="#6366f1" strokeWidth="2" fill="none" className="animate-flow-line" />
          )}
        </svg>

        {/* Top-Left: Architect Node */}
        <div 
          className="absolute flex flex-col items-center p-3.5 rounded-xl border z-10 w-[120px]" 
          style={{ 
            ...getAgentNodeStyle('architect', '#6366f1', 'rgba(99, 102, 241, 0.1)'),
            top: '20px',
            left: '40px'
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" 
               style={{ backgroundColor: isAgentActive('architect') ? '#6366f1' : '#18181b' }}>
            <FileText className={`w-4 h-4 ${isAgentActive('architect') ? 'text-white' : 'text-indigo-400'}`} />
          </div>
          <span className="text-[11px] font-semibold text-white">Architect</span>
          <span className="text-[8px] text-[#a1a1aa] mt-0.5">Spec & Design</span>
        </div>

        {/* Top-Right: Backend Node */}
        <div 
          className="absolute flex flex-col items-center p-3.5 rounded-xl border z-10 w-[120px]" 
          style={{ 
            ...getAgentNodeStyle('backend', '#10b981', 'rgba(16, 185, 129, 0.1)'),
            top: '20px',
            right: '40px'
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" 
               style={{ backgroundColor: isAgentActive('backend') ? '#10b981' : '#18181b' }}>
            <Code2 className={`w-4 h-4 ${isAgentActive('backend') ? 'text-white' : 'text-emerald-400'}`} />
          </div>
          <span className="text-[11px] font-semibold text-white">Backend</span>
          <span className="text-[8px] text-[#a1a1aa] mt-0.5">Logic & DB</span>
        </div>

        {/* Bottom-Right: QA Auditor Node */}
        <div 
          className="absolute flex flex-col items-center p-3.5 rounded-xl border z-10 w-[120px]" 
          style={{ 
            ...getAgentNodeStyle('qa', '#f59e0b', 'rgba(245, 158, 11, 0.1)'),
            bottom: '20px',
            right: '40px'
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" 
               style={{ backgroundColor: isAgentActive('qa') ? '#f59e0b' : '#18181b' }}>
            <CheckSquare className={`w-4 h-4 ${isAgentActive('qa') ? 'text-white' : 'text-amber-400'}`} />
          </div>
          <span className="text-[11px] font-semibold text-white">QA Auditor</span>
          <span className="text-[8px] text-[#a1a1aa] mt-0.5">Test & Security</span>
        </div>

        {/* Bottom-Left: Frontend Node */}
        <div 
          className="absolute flex flex-col items-center p-3.5 rounded-xl border z-10 w-[120px]" 
          style={{ 
            ...getAgentNodeStyle('frontend', '#3b82f6', 'rgba(59, 130, 246, 0.1)'),
            bottom: '20px',
            left: '40px'
          }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" 
               style={{ backgroundColor: isAgentActive('frontend') ? '#3b82f6' : '#18181b' }}>
            <MonitorPlay className={`w-4 h-4 ${isAgentActive('frontend') ? 'text-white' : 'text-blue-400'}`} />
          </div>
          <span className="text-[11px] font-semibold text-white">Frontend</span>
          <span className="text-[8px] text-[#a1a1aa] mt-0.5">UI Component</span>
        </div>

      </div>

      {/* Small legend of active operations */}
      {status !== 'idle' && status !== 'completed' && activeAgent && (
        <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/10 bg-indigo-500/5"
             style={{ border: '1px solid rgba(99, 102, 241, 0.1)', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" 
                  style={{ backgroundColor: isAgentActive('architect') ? '#6366f1' : isAgentActive('backend') ? '#10b981' : isAgentActive('frontend') ? '#3b82f6' : '#f59e0b' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" 
                  style={{ backgroundColor: isAgentActive('architect') ? '#6366f1' : isAgentActive('backend') ? '#10b981' : isAgentActive('frontend') ? '#3b82f6' : '#f59e0b' }} />
          </span>
          <span className="text-[10px] font-medium text-indigo-300" style={{ color: '#a5b4fc' }}>
            {activeAgent === 'Architect' && 'Drafting systems architecture specification...'}
            {activeAgent === 'Backend' && 'Compiling API router logic & SQL tables...'}
            {activeAgent === 'Frontend' && 'Rendering JSX templates & CSS layers...'}
            {activeAgent === 'QA' && 'Linting outputs and auditing for credentials...'}
          </span>
        </div>
      )}
    </div>
  );
};
