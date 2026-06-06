import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Shield,
  Layers,
  Award
} from 'lucide-react';
import { BirthCertificate } from '../types';

interface TimelineLedgerProps {
  certificates: BirthCertificate[];
  onIssueNewBlock: () => void;
}

export default function TimelineLedger({ certificates, onIssueNewBlock }: TimelineLedgerProps) {
  const [selectedCert, setSelectedCert] = useState<BirthCertificate | null>(certificates[0] || null);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  const mockEvents = [
    {
      id: 'e1',
      type: 'DEPLOYMENT',
      title: 'Deployed v1.3.2 to Production',
      time: 'May 16, 09:30 UTC',
      block: 'Block 18,742,210',
      status: 'success'
    },
    {
      id: 'e2',
      type: 'TEST_RESULT',
      title: 'Red Team Test Passed Successfully',
      time: 'May 16, 08:12 UTC',
      block: 'Block 18,741,998',
      status: 'success'
    },
    {
      id: 'e3',
      type: 'MUTATION',
      title: 'Policy Update (OpsCore v3.2)',
      time: 'May 15, 22:47 UTC',
      block: 'Block 18,741,331',
      status: 'neutral'
    },
    {
      id: 'e4',
      type: 'INCIDENT',
      title: 'High Latency Detected & Recovered via Arbiter Loop',
      time: 'May 15, 19:02 UTC',
      block: 'Block 18,740,812',
      status: 'warning'
    },
    {
      id: 'e5',
      type: 'TEST_RESULT',
      title: 'Evals Regression Testing: Passed (98.4%)',
      time: 'May 15, 16:33 UTC',
      block: 'Block 18,740,119',
      status: 'success'
    }
  ];

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 1500);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* View Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#E0E0E0] font-mono">Project Genome Ledger</h2>
          <p className="text-xs text-slate-500">Verifying immutable audit trails for autonomous systems.</p>
        </div>
        <button 
          onClick={onIssueNewBlock}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold rounded text-xs border border-orange-500/20 transition-all cursor-pointer"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Issue Birth Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Issue Certificate Detail (Viewer) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#111113] p-4 rounded border border-[#222] relative overflow-hidden select-text">
            {/* Ambient visual badge */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl"></div>

            <div className="flex justify-between items-start border-b border-[#222] pb-3 mb-3">
              <div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-green-500/10 text-green-550 border border-green-500/20 mb-1.5">
                  STATUS_OK
                </span>
                <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-orange-500" />
                  AGENT_BIRTH_CERTIFICATE_METRIC
                </h3>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-500 font-mono">LEDGER_ID</p>
                <p className="text-[10px] text-white font-mono font-bold leading-tight">{selectedCert?.id || 'PGL-18,742,391-7C3A'}</p>
              </div>
            </div>

            {selectedCert && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 text-[11px] font-mono">
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Agent Name</label>
                  <p className="text-white font-bold text-xs">{selectedCert.agentName}</p>
                </div>
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Creator Address</label>
                  <p className="text-white font-bold flex items-center gap-1 text-xs">
                    {selectedCert.creator}
                    <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                  </p>
                </div>
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Jurisdiction / Sovereignty</label>
                  <p className="text-gray-300 font-medium">{selectedCert.jurisdiction}</p>
                </div>
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Purpose / Mission Boundary</label>
                  <p className="text-gray-300 font-medium leading-normal">{selectedCert.purpose}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-gray-500 block text-[9.5px] font-bold">Genome SHA-256 Hash Digest</label>
                  <div className="flex items-center bg-[#0A0A0B] px-2 py-1 rounded border border-[#222] text-[10px] text-gray-400 justify-between">
                    <span className="truncate pr-2">{selectedCert.genomeHash}</span>
                    <button 
                      onClick={() => handleCopyHash(selectedCert.genomeHash)}
                      className="text-[10px] uppercase text-orange-500 hover:text-orange-400 font-bold ml-2 shrink-0 cursor-pointer"
                    >
                      {copiedState ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Model Runtime</label>
                  <code className="text-gray-300 font-mono text-[10px]">{selectedCert.modelRuntime}</code>
                </div>
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Policy Pack Version</label>
                  <code className="text-gray-300 font-mono text-[10px]">{selectedCert.policyPack}</code>
                </div>
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Timestamp Issued (UTC)</label>
                  <p className="text-gray-400 font-mono text-[10px]">{selectedCert.issuedAt}</p>
                </div>
                <div>
                  <label className="text-gray-500 block text-[9.5px] font-bold">Enforced Attestations</label>
                  <div className="flex flex-wrap gap-1.5 mt-1 font-sans">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-[#0A0A0B] border border-[#222] text-orange-500 font-mono font-bold">
                      <Shield className="h-2.5 w-2.5 shrink-0" /> CODESIGNED
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-[#0A0A0B] border border-[#222] text-orange-500 font-mono font-bold">
                      <Layers className="h-2.5 w-2.5 shrink-0" /> BOUNDED
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-[#222] flex justify-between items-center text-[10px] text-gray-500 select-none">
              <span className="flex items-center gap-1 text-green-500 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" /> LEDGER_CHECKS_SUCCEEDED
              </span>
              <span className="font-mono">PROTECTED BY ARBITER_SHIELD_V4_KERNEL</span>
            </div>
          </div>

          {/* Lineage Tree Explorer View */}
          <div className="bg-[#111113] border border-[#222] rounded p-4 shadow-sm select-none">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Lineage Ancestry / Lineage Trees</h4>
            
            <div className="flex flex-col items-center md:flex-row justify-center gap-2 text-[10px] font-semibold text-gray-400">
              <div className="bg-[#0A0A0B] p-2 rounded border border-[#222] text-center w-full md:w-40 font-mono">
                <p className="text-gray-400">Foundation Model</p>
                <p className="text-gray-600 font-mono mt-0.5 text-[9.5px]">GPT-4o (2025-05-12)</p>
              </div>
              <div className="text-gray-700 font-bold text-sm hidden md:block">→</div>
              <div className="bg-[#0A0A0B] p-2 rounded border border-[#222] text-center w-full md:w-40 relative font-mono">
                <div className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-gray-400">Knowledge Index</p>
                <p className="text-gray-600 font-mono mt-0.5 text-[9.5px]">Graph retriever v1.4</p>
              </div>
              <div className="text-gray-700 font-bold text-sm hidden md:block">→</div>
              <div className="bg-[#0A0A0B] p-2 rounded border border-orange-500/30 bg-orange-600/5 text-center w-full md:w-40 font-mono">
                <p className="text-orange-500 font-bold">{selectedCert?.agentName || 'Target Agent'}</p>
                <p className="text-gray-500 font-mono mt-0.5 text-[9.5px]">Active Wrapper</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Timeline Logs */}
        <div className="lg:col-span-5 bg-[#111113] rounded border border-[#222] p-4 flex flex-col h-[490px]">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono mb-3 flex items-center justify-between select-none">
            <span>Ledger Block Timeline</span>
            <span className="text-[9.5px] font-mono text-green-550 bg-green-500/10 border border-green-500/15 font-bold px-1.5 py-0.5 rounded">MAINNET_LIVE</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 font-mono">
            {mockEvents.map((ev) => (
              <div key={ev.id} className="relative pl-5 border-l border-[#222] last:border-l-0 pb-1.5 select-text">
                <div className={`absolute left-[-3.5px] top-1.5 h-1.5 w-1.5 rounded-full ${
                  ev.status === 'success' ? 'bg-green-500' : ev.status === 'warning' ? 'bg-orange-500' : 'bg-gray-700'
                }`}></div>
                <div className="flex items-center gap-1.5 text-[9.5px]">
                  <span className="font-bold text-orange-500">{ev.type}</span>
                  <span className="text-gray-600 font-medium">{ev.time}</span>
                </div>
                <h4 className="text-[11px] font-bold text-white mt-1 leading-normal">{ev.title}</h4>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{ev.block}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#222] text-[10px] text-gray-600 font-sans leading-normal select-none">
            Every transaction is committed to the physical ledger and assigned a secure block hash. Use emission hooks to issue dynamic birth certificate records directly on ArbiterOS database.
          </div>
        </div>
      </div>
    </div>
  );
}
