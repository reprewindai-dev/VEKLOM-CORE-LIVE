import React from 'react';
import { 
  GitFork, 
  Activity, 
  ShieldAlert, 
  Database,
  Network
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  verificationProgress: {
    githubConnected: boolean;
    sourceCreated: boolean;
    assetWrapped: boolean;
    deployed: boolean;
    terminalRun: boolean;
  };
}

export default function Sidebar({ currentTab, setCurrentTab, verificationProgress }: SidebarProps) {
  // Let's count how many steps of the trace are verified
  const verifiedCount = Object.values(verificationProgress).filter(Boolean).length;
  const verifiedPercent = Math.round((verifiedCount / 5) * 100);

  return (
    <div className="flex flex-col h-full bg-[#0D0D0E] text-[#E0E0E0] border-r border-[#222] w-56 shrink-0 transition-all duration-300 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#222] bg-[#111113]">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 bg-orange-600 flex items-center justify-center font-bold text-white rounded text-sm shrink-0 shadow">
            V
          </div>
          <div className="min-w-0">
            <h1 className="text-xs font-mono font-bold tracking-wider text-white uppercase truncate">Veklom Sovereign</h1>
            <p className="text-[10px] uppercase text-slate-500 tracking-tight">Core Live Studio</p>
          </div>
        </div>
      </div>

      <div className="my-3 px-3 uppercase tracking-wider text-[10px] text-gray-500 font-bold">System Routers</div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        <button
          onClick={() => setCurrentTab(' cockpit')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors text-left ${
            currentTab === ' cockpit' 
              ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' 
              : 'text-gray-400 hover:bg-[#1A1A1C] hover:text-[#E0E0E0] border border-transparent'
          }`}
        >
          <GitFork className="h-3.5 w-3.5 shrink-0" />
          <span>Pipeline Cockpit</span>
        </button>

        <button
          onClick={() => setCurrentTab('routing')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors text-left ${
            currentTab === 'routing' 
              ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' 
              : 'text-gray-400 hover:bg-[#1A1A1C] hover:text-[#E0E0E0] border border-transparent'
          }`}
        >
          <Activity className="h-3.5 w-3.5 shrink-0" />
          <span>Routing & Economics</span>
        </button>

        <button
          onClick={() => setCurrentTab('ledger')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors text-left ${
            currentTab === 'ledger' 
              ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' 
              : 'text-gray-400 hover:bg-[#1A1A1C] hover:text-[#E0E0E0] border border-transparent'
          }`}
        >
          <Database className="h-3.5 w-3.5 shrink-0" />
          <span>Governance Ledger</span>
        </button>

        <button
          onClick={() => setCurrentTab('explorer')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors text-left ${
            currentTab === 'explorer' 
              ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' 
              : 'text-gray-400 hover:bg-[#1A1A1C] hover:text-[#E0E0E0] border border-transparent'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          <span>API Route Inventory</span>
        </button>
      </nav>

      {/* Progress Card Pin of trace validation */}
      <div className="p-3 mx-3 my-4 bg-[#161618] rounded border border-[#222]">
        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">MATRIX_VERIFY</div>
        <div className="flex justify-between items-center text-[10px] text-green-500 font-mono">
          <span>{verifiedCount}/5 VERIFIED</span>
          <span>{verifiedPercent}% BACKEND-OK</span>
        </div>
        <div className="w-full bg-[#333] h-1 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500 ease-out" 
            style={{ width: `${(verifiedCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-[#222] bg-[#0A0A0B] text-[10px]">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1.5 font-mono text-slate-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
            <span>UTC 2026-06-06</span>
          </div>
          <span className="text-orange-500/80 font-mono">v0.8.2</span>
        </div>
        <p className="text-gray-500 truncate mt-1 text-[9px] font-mono select-all">veklomdev@gmail.com</p>
      </div>
    </div>
  );
}
