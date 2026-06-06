import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Play, RotateCcw, Copy, Check } from 'lucide-react';
import { TraceLog } from '../types';

interface TerminalConsoleProps {
  logs: TraceLog[];
  onTriggerCommand: (cmd: string) => { output: string; status: number };
}

export default function TerminalConsole({ logs, onTriggerCommand }: TerminalConsoleProps) {
  const [inputVal, setInputVal] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
    { type: 'output', text: 'Veklom Sovereign Matrix Router Node [v0.8.2]' },
    { type: 'output', text: 'Status: ONLINE_TRACE_RESOURCES_VERIFIED_OK. Use short-keys below or run "help" to start.' },
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleCommandSubmit = (commandText: string) => {
    const trimmed = commandText.trim();
    if (!trimmed) return;

    const newHistory = [...terminalHistory, { type: 'input' as const, text: `root@veklom:~# ${trimmed}` }];
    
    // Execute command action
    const result = onTriggerCommand(trimmed);

    newHistory.push({ type: 'output' as const, text: result.output });
    
    setTerminalHistory(newHistory);
    setInputVal('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandSubmit(inputVal);
    }
  };

  const commandShortcuts = [
    { label: 'Check API Status', cmd: 'curl -X GET /api/v1/auth/github/status' },
    { label: 'Explore Repos', cmd: 'curl -X GET /api/v1/auth/github/repos' },
    { label: 'Fetch Deployments', cmd: 'curl -X GET /api/v1/deployments' },
    { label: 'Map Trace Gaps', cmd: 'veklomrun --trace-gap' },
  ];

  const handleCopyLog = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    copiedIndex === index ? setCopiedIndex(null) : setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Visual Terminal Sandbox */}
      <div className="lg:col-span-7 flex flex-col bg-[#0D0D0E] border border-[#222] rounded h-[430px] overflow-hidden shadow-sm">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#222] bg-[#161618] shrink-0 select-none">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Route Call Trace / Terminal</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600/30 border border-orange-500/20"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500/30 border border-green-500/20"></span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500/30 border border-blue-500/20"></span>
          </div>
        </div>

        {/* Scrollable Command Line View */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-[11px] text-[#A9B1D6] space-y-1.5 select-text selection:bg-orange-500/10">
          {terminalHistory.map((item, idx) => (
            <div 
              key={idx} 
              className={`whitespace-pre-wrap leading-relaxed ${
                item.type === 'input' ? 'text-white font-bold' : 'text-[#A9B1D6]'
              }`}
            >
              {item.text}
            </div>
          ))}
          <div className="flex items-center gap-1 pt-1">
            <span className="text-orange-500 font-bold">root@veklom:~#</span>
            <span className="text-white animate-pulse">█</span>
          </div>
        </div>

        {/* Short-cut Quick Click Panel */}
        <div className="p-2 bg-[#111113] border-t border-[#222] flex flex-wrap gap-1.5 shrink-0 select-none">
          {commandShortcuts.map((shortcut, idx) => (
            <button
              key={idx}
              onClick={() => handleCommandSubmit(shortcut.cmd)}
              className="px-2 py-0.5 bg-[#0A0A0B] border border-[#222] rounded font-mono text-[9px] text-gray-400 hover:text-orange-500 hover:border-orange-500/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <Play className="h-2 w-2 text-orange-500 fill-orange-500 shrink-0" />
              <span>{shortcut.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-2 border-t border-[#222] bg-[#0A0A0B] shrink-0 flex items-center gap-2 select-none">
          <span className="text-orange-500 font-mono text-xs font-bold select-none">$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Input console instruction, or perform direct button queries..."
            className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 font-mono text-xs select-text placeholder-gray-600"
          />
          <button
            onClick={() => handleCommandSubmit(inputVal)}
            className="p-1 px-2.5 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold rounded text-[10px] border border-orange-500/20 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Send className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

      {/* API Router Sync Auditing Logger Panel */}
      <div className="lg:col-span-5 flex flex-col bg-[#111113] border border-[#222] rounded h-[430px] p-4 shadow-sm select-none">
        <div className="flex justify-between items-center pb-2.5 border-b border-[#222] mb-3 shrink-0">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">Live Debug Console / Intercept</h3>
            <p className="text-[9.5px] text-gray-600">Dynamic intercept mapping client to REST endpoints.</p>
          </div>
          <button 
            type="button" 
            onClick={() => {
              setTerminalHistory([
                { type: 'output', text: 'Veklom Sovereign Matrix Router Node [v0.8.2]' },
                { type: 'output', text: 'Status: ONLINE_TRACE_RESOURCES_VERIFIED_OK. Use short-keys below or run "help" to start.' },
              ]);
            }}
            title="Clear console log"
            className="p-1 hover:bg-[#1A1A1C] rounded text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Trace log cards */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 font-mono text-[11px]">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full text-gray-600 space-y-2">
              <Terminal className="h-7 w-7 text-gray-700 stroke-[1.5]" />
              <p className="text-xs">No Rest API intercepts detected.</p>
              <p className="text-[9.5px] max-w-xs text-gray-700 leading-normal">Select coordinates on the tracer deck above to record live telemetry logs.</p>
            </div>
          ) : (
            logs.slice().reverse().map((log, index) => {
              const isSuccess = log.status >= 200 && log.status < 300;
              return (
                <div key={log.id} className="bg-[#0A0A0B] p-2.5 rounded border border-[#222] hover:border-orange-500/20 transition-all space-y-1.5 relative group">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1 py-0.5 rounded text-[9px] font-mono font-bold border ${
                        log.method === 'POST' ? 'bg-blue-500/10 text-blue-400 border-blue-500/15' : 'bg-green-500/10 text-green-500 border-green-500/15'
                      }`}>
                        {log.method}
                      </span>
                      <span className="font-mono text-gray-400 font-medium">{log.route}</span>
                    </div>
                    <span className={`px-1 py-0.2 rounded font-mono text-[9px] ${
                      isSuccess ? 'bg-green-500/10 text-green-500 border border-green-500/15' : 'bg-red-500/10 text-red-400 border-red-500/15'
                    }`}>
                      {log.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-300 font-sans tracking-wide leading-normal">{log.description}</p>
                  
                  {log.payload && Object.keys(log.payload).length > 0 && (
                    <div className="p-1.5 bg-[#0D0D0E] border border-[#222] rounded text-[9.5px] text-gray-500 overflow-x-auto max-h-24">
                      <span className="text-orange-500 font-bold">PAYLOAD:</span> {JSON.stringify(log.payload, null, 1)}
                    </div>
                  )}

                  {log.response && (
                    <div className="p-1.5 bg-[#0D0D0E] border border-[#222] rounded text-[9.5px] text-gray-500 overflow-x-auto max-h-24">
                      <span className="text-green-500 font-bold">RESPONSE:</span> {JSON.stringify(log.response, null, 1)}
                    </div>
                  )}

                  <button
                    onClick={() => handleCopyLog(JSON.stringify(log, null, 2), index)}
                    className="absolute right-2 top-2 p-1 bg-[#111113] border border-[#222] rounded opacity-0 group-hover:opacity-100 hover:bg-[#1A1A1C] transition-opacity text-gray-400 cursor-pointer"
                    title="Copy telemetry record"
                  >
                    {copiedIndex === index ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
