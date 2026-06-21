import React from 'react';
import { Cpu, DollarSign, Activity, Compass, Settings, Shield } from 'lucide-react';

interface WorkspaceHeaderProps {
  status: string;
  progress: number;
  totalTokens: number;
  totalCost: number;
  activeAgent: string | null;
  activeModel: string;
  onOpenSettings: () => void;
  installedPacksCount?: number;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  status,
  progress,
  totalTokens,
  totalCost,
  activeAgent,
  activeModel,
  onOpenSettings,
  installedPacksCount,
}) => {
  const getAgentColor = (agent: string | null) => {
    switch (agent?.toLowerCase()) {
      case 'architect':
        return 'var(--color-architect)';
      case 'backend':
        return 'var(--color-backend)';
      case 'frontend':
        return 'var(--color-frontend)';
      case 'qa':
        return 'var(--color-qa)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getStatusLabel = () => {
    if (status === 'idle') return 'Ready';
    if (status === 'starting') return 'Initializing Kernel...';
    if (status === 'completed') return 'Task Completed';
    if (status === 'failed') return 'Failed';
    return `Agent ${activeAgent} is working...`;
  };

  return (
    <div className="glass border-b border-[#27272a] p-4 flex flex-col gap-3" style={{ background: '#09090b', borderBottom: '1px solid #27272a' }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title and Badge */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center animate-pulse-glow" style={{ border: '1px solid rgba(99, 102, 241, 0.3)', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
            <Compass className="w-4 h-4 text-indigo-400" style={{ color: '#818cf8' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-white tracking-tight" style={{ fontSize: '15px', fontWeight: 600 }}>Developer Workspace</h1>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium tracking-wide uppercase" 
                    style={{ 
                      backgroundColor: status === 'idle' ? 'rgba(39, 39, 42, 0.5)' : status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
                      color: status === 'idle' ? '#a1a1aa' : status === 'completed' ? '#10b981' : '#6366f1',
                      border: `1px solid ${status === 'idle' ? '#27272a' : status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`
                    }}>
                {status}
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-0.5">{getStatusLabel()}</p>
          </div>
        </div>

        {/* Real-time Dashboard Metrics */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Model */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a', backgroundColor: '#0f0f13' }}>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" style={{ color: '#818cf8' }} />
            <div className="text-left">
              <div className="text-[9px] text-[#71717a] font-medium uppercase tracking-wider">Active Model</div>
              <div className="text-xs font-semibold text-[#fafafa] truncate max-w-[120px]" style={{ fontSize: '11px' }}>{activeModel}</div>
            </div>
          </div>

          {/* Tokens Metric */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a', backgroundColor: '#0f0f13' }}>
            <Activity className="w-3.5 h-3.5 text-emerald-400" style={{ color: '#34d399' }} />
            <div className="text-left">
              <div className="text-[9px] text-[#71717a] font-medium uppercase tracking-wider">Tokens Used</div>
              <div className="text-xs font-semibold text-[#fafafa]" style={{ fontSize: '11px' }}>{totalTokens.toLocaleString()}</div>
            </div>
          </div>

          {/* Cost Metric */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#27272a] bg-[#0f0f13]" style={{ border: '1px solid #27272a', backgroundColor: '#0f0f13' }}>
            <DollarSign className="w-3.5 h-3.5 text-blue-400" style={{ color: '#60a5fa' }} />
            <div className="text-left">
              <div className="text-[9px] text-[#71717a] font-medium uppercase tracking-wider">Accrued Cost</div>
              <div className="text-xs font-semibold text-[#fafafa]" style={{ fontSize: '11px', color: '#60a5fa' }}>
                ${totalCost.toFixed(5)}
              </div>
            </div>
          </div>

          {/* Local / Secure Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5" style={{ border: '1px solid rgba(16, 185, 129, 0.1)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
            <Shield className="w-3.5 h-3.5 text-emerald-500" style={{ color: '#10b981' }} />
            <span className="text-[10px] text-emerald-400 font-medium" style={{ color: '#34d399' }}>SECURE (LOCAL KEYCHAIN)</span>
          </div>

          {/* Active Sandbox / Packs Indicator */}
          {installedPacksCount !== undefined && installedPacksCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-500/10 bg-indigo-500/5" style={{ border: '1px solid rgba(99, 102, 241, 0.1)', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
              <span className="text-[10px] text-indigo-400 font-medium" style={{ color: '#a5b4fc' }}>{installedPacksCount} PACKS ACTIVE</span>
            </div>
          )}

          {/* Settings Button */}
          <button 
            onClick={onOpenSettings}
            className="p-2 rounded-lg border border-[#27272a] hover:bg-[#18181b] transition-all text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
            style={{ backgroundColor: '#0f0f13', border: '1px solid #27272a' }}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {status !== 'idle' && (
        <div className="w-full flex flex-col gap-1 mt-1">
          <div className="flex justify-between items-center text-[10px] text-[#71717a]">
            <span>Orchestration sequence progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1 bg-[#18181b] rounded-full overflow-hidden" style={{ height: '4px', backgroundColor: '#18181b', borderRadius: '2px' }}>
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${progress}%`, 
                backgroundColor: getAgentColor(activeAgent),
                boxShadow: `0 0 8px ${getAgentColor(activeAgent)}`
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// prop documentation: installedPacksCount tracks installed packages

// Render active badge indicators
