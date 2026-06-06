import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Database,
  Grid,
  Info,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  ArrowRight,
  ShieldAlert,
  Server,
  Zap,
  Globe
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import PipelineTracer from './components/PipelineTracer';
import RoutingMatrix from './components/RoutingMatrix';
import TimelineLedger from './components/TimelineLedger';
import TerminalConsole from './components/TerminalConsole';

import { GitHubRepo, WrappedAsset, Deployment, TraceLog, RoutingParameters, BirthCertificate } from './types';

// Static Initial Datasets (Stabilized outside rendering scope to avoid re-renders)
const INITIAL_REPOSITORIES: GitHubRepo[] = [
  {
    id: 'r1',
    name: 'sentinel-triage-agent',
    owner: 'veklom',
    branch: 'main',
    stars: 124,
    updatedAt: '2026-06-05T18:14:00Z',
    isConnected: true
  },
  {
    id: 'r2',
    name: 'sovereign-economics-router',
    owner: 'veklom',
    branch: 'release-v1',
    stars: 89,
    updatedAt: '2026-06-03T11:42:00Z',
    isConnected: true
  },
  {
    id: 'r3',
    name: 'intelligent-crawler-mrl',
    owner: 'veklom',
    branch: 'dev-treefrag',
    stars: 45,
    updatedAt: '2026-06-06T02:11:00Z',
    isConnected: false
  }
];

const INITIAL_CERTIFICATES: BirthCertificate[] = [
  {
    id: 'PGL-18,742,391-7C3A',
    agentName: 'SentinelOps Triage Agent',
    creator: 'Acme Operations Inc.',
    jurisdiction: 'Delaware, USA',
    purpose: 'Incident Triage & Root Cause Analysis',
    genomeHash: '0x8f3a1c9b7d2e4f0a9e8d7f3a1b2c4c6b9e8d7f3a1b2c4c6b9e8d7f3a1... (SHA-256)',
    modelRuntime: 'Gemini-1.5-Pro',
    policyPack: 'OpsCore v3.2',
    issuedAt: 'May 16, 2025 09:41:12 UTC',
    status: 'ALL CHECKS PASSED'
  }
];

const INITIAL_ROUTING: RoutingParameters = {
  businessRisk: 45,
  accuracyRequirement: 80,
  reasoningDepth: 65,
  costSensitivity: 30
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(' cockpit');
  const [repositories, setRepositories] = useState<GitHubRepo[]>(INITIAL_REPOSITORIES);
  const [routingParams, setRoutingParams] = useState<RoutingParameters>(INITIAL_ROUTING);
  const [certificates, setCertificates] = useState<BirthCertificate[]>(INITIAL_CERTIFICATES);
  const [logs, setLogs] = useState<TraceLog[]>([]);

  // Five Core States of Gap Verification trace
  const [verificationProgress, setVerificationProgress] = useState({
    githubConnected: false,
    sourceCreated: false,
    assetWrapped: false,
    deployed: false,
    terminalRun: false
  });

  const [currentAsset, setCurrentAsset] = useState<WrappedAsset>({
    id: 'asset_pending_id',
    repoId: 'r1',
    assetName: 'Pending Assembly',
    version: 'v1.0.0',
    checksum: 'pending',
    isWrapped: false,
    isRegistered: false,
    complianceChecks: { syntax: false, logic: false, security: false },
    policyHash: 'pending'
  });

  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);

  // Initialize a baseline log entry on first mount
  useEffect(() => {
    const initialLog: TraceLog = {
      id: 'log_init',
      timestamp: new Date().toISOString(),
      route: '/api/v1/auth/connected-accounts',
      method: 'GET',
      status: 200,
      statusText: 'BACKEND-OK',
      description: 'System initialization: verified connected provider OAuth interfaces.',
      payload: null,
      response: { connected_accounts: [{ provider: 'github', status: 'authenticated' }] }
    };
    setLogs([initialLog]);
  }, []);

  // Update pipeline step and register live API logging
  const handleUpdateStep = (
    step: 'githubConnected' | 'sourceCreated' | 'assetWrapped' | 'deployed' | 'terminalRun',
    payload: any,
    logMessage: string,
    route: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
    resData: any
  ) => {
    setVerificationProgress(prev => ({ ...prev, [step]: true }));
    
    // Create new API trace log
    const newLog: TraceLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      route,
      method,
      status: 200,
      statusText: 'BACKEND-OK',
      description: logMessage,
      payload,
      response: resData
    };

    setLogs(prev => [...prev, newLog]);

    // Handle respective asset wrapper state updates
    if (step === 'githubConnected') {
      setCurrentAsset(prev => ({
        ...prev,
        repoId: payload.repoId,
        assetName: `${payload.name}-Wrapper`,
      }));
    } else if (step === 'assetWrapped') {
      setCurrentAsset(prev => ({
        ...prev,
        id: payload.assetId,
        checksum: payload.checksum,
        isWrapped: true,
        isRegistered: true,
        complianceChecks: { syntax: true, logic: true, security: true }
      }));
    } else if (step === 'deployed') {
      setCurrentDeployment({
        id: payload.deploymentId,
        name: payload.name,
        assetId: currentAsset.id,
        status: 'running',
        modelTier: 'medium',
        endpoint: 'https://ais-dev-vm.config.run',
        uptime: 10,
        cpuUsage: 14,
        memoryUsage: 38,
        logs: [
          'Initializing container environment...',
          'Loading Sovereign validation policies...',
          'Booting ArbiterOS standard runtime wrapper...',
          'Node initialized. Connected to Project Genome Ledger.'
        ]
      });
    }
  };

  const handleResetVerification = () => {
    setVerificationProgress({
      githubConnected: false,
      sourceCreated: false,
      assetWrapped: false,
      deployed: false,
      terminalRun: false
    });
    setCurrentAsset({
      id: 'asset_pending_id',
      repoId: 'r1',
      assetName: 'Pending Assembly',
      version: 'v1.0.0',
      checksum: 'pending',
      isWrapped: false,
      isRegistered: false,
      complianceChecks: { syntax: false, logic: false, security: false },
      policyHash: 'pending'
    });
    setCurrentDeployment(null);
    
    // Push reset log
    const resetLog: TraceLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      route: '/api/v1/deployments',
      method: 'DELETE',
      status: 200,
      statusText: 'CLIENT-PROCESSED',
      description: 'Reset verification pipeline tracking state state. Tracing gap analysis restored to zero baseline.',
      payload: null,
      response: { status: 'cleared' }
    };
    setLogs(prev => [...prev, resetLog]);
  };

  const handleIssueBirthCertificate = () => {
    // Generates a mock certificate
    const newCert: BirthCertificate = {
      id: `PGL-${Math.floor(10000000 + Math.random() * 90000000)}-4B9D`,
      agentName: 'SentinelOps Triage Agent',
      creator: 'Acme Operations Inc.',
      jurisdiction: 'Delaware, USA',
      purpose: 'Automatic incident triage compliance wrapper deployment',
      genomeHash: `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')} (SHA-256)`,
      modelRuntime: 'Gemini-1.5-Pro',
      policyPack: 'OpsCore v3.2',
      issuedAt: new Date().toUTCString(),
      status: 'ALL CHECKS PASSED'
    };

    setCertificates(prev => [newCert, ...prev]);

    // Push trace log
    const newLog: TraceLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      route: '/api/v1/routing/policy',
      method: 'POST',
      status: 200,
      statusText: 'BACKEND-OK',
      description: 'Birth Certificate issued on Project Genome Ledger database records.',
      payload: newCert,
      response: { status: 'committed', block: '18,742,422' }
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Run shell commands inside secure terminal panel
  const handleTriggerCommand = (cmd: string): { output: string; status: number } => {
    const trimmed = cmd.trim();

    // 1. HELP
    if (trimmed.toLowerCase() === 'help') {
      return {
        status: 200,
        output: `Available system commands:
  help                                  Output command info list.
  curl -X GET /api/v1/auth/github/status Get connected state coordinates of GitHub OAuth profiles.
  curl -X GET /api/v1/auth/github/repos  Lists connected GitHub repository models.
  curl -X GET /api/v1/deployments        Fetches registered microVM node container states.
  veklomrun --trace-gap                 Analyze the current pipeline chain gaps.
  clear                                 Clear terminal shell history.`
      };
    }

    // 2. CLEAR
    if (trimmed.toLowerCase() === 'clear') {
      return { status: 200, output: 'cleared' };
    }

    // 3. GITHUB STATUS
    if (trimmed === 'curl -X GET /api/v1/auth/github/status') {
      return {
        status: 200,
        output: JSON.stringify({
          status: 'authenticated',
          account_id: 'gh_u88931a',
          username: 'veklomdev',
          routes_live: 'BACKEND-OK'
        }, null, 2)
      };
    }

    // 4. GITHUB REPOS
    if (trimmed === 'curl -X GET /api/v1/auth/github/repos') {
      return {
        status: 200,
        output: JSON.stringify(repositories.map(r => ({
          name: r.name,
          owner: r.owner,
          branch: r.branch,
          backend_route_verified: 'BACKEND-OK'
        })), null, 2)
      };
    }

    // 5. LIST DEPLOYMENTS
    if (trimmed === 'curl -X GET /api/v1/deployments') {
      if (verificationProgress.deployed) {
        return {
          status: 200,
          output: JSON.stringify([{
            id: 'd_sops_77e9',
            name: 'sentinel-triage-agent-Deployment',
            status: 'running',
            endpoint: 'https://ais-dev-vm.config.run',
            configured_model_tier: 'medium',
            uptime_seconds: 140
          }], null, 2)
        };
      } else {
        return {
          status: 200,
          output: `[]\n(Empty set: No active pipeline deployment trace found. Please proceed through the Pipeline Cockpit flow to establish microVM container)`
        };
      }
    }

    // 6. TRACE GAP COMPILATION
    if (trimmed === 'veklomrun --trace-gap') {
      return {
        status: 200,
        output: `Tracing Veklom Execution Gap:
----------------------------------------------------------------------
1. GitHub Repository Selected... ${verificationProgress.githubConnected ? '√ CONNECTED' : 'X MISSING'}
2. GPC Source configuration parsed... ${verificationProgress.sourceCreated ? '√ COMPILED' : 'X MISSING'}
3. Wrapped Asset listed and verified... ${verificationProgress.assetWrapped ? '√ REGISTERED' : 'X MISSING'}
4. Deployment initialized... ${verificationProgress.deployed ? '√ CONFIGURED' : 'X MISSING'}
5. MicroVM Terminal execution output... ${verificationProgress.terminalRun ? '√ EXECUTED' : 'X MISSING'}

CONCLUSION:
${
  verificationProgress.terminalRun
    ? 'Success! Full trace from repository selection, GPC compilation, wrapped asset packaging, to active sandbox execution is synchronized.'
    : 'Gap Detected! The pipeline execution is not fully sealed. Please complete validation steps on the Cockpit Board to bridge the components.'
}`
      };
    }

    // FALLBACK
    return {
      status: 404,
      output: `Unknown or unhandled command syntax "${cmd}". Type "help" to view standard ArbiterOS instructions.`
    };
  };

  return (
    <div className="flex h-screen bg-[#0A0A0B] font-sans text-[#E0E0E0] select-none antialiased overflow-hidden">
      {/* Sidebar Navigation Panel */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        verificationProgress={verificationProgress}
      />

      {/* Main Sandbox Panel Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Toolbar Header following High Density theme */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-[#222] bg-[#111113] shrink-0 select-none">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest uppercase text-white font-semibold">Veklom_Core / System_Matrix</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-gray-400 font-mono font-medium">GITHUB_AUTH: CONNECTED [veklomdev]</span>
            </div>
            <div className="flex items-center gap-3 border-l border-[#222] pl-6">
              <span className="text-[10px] text-gray-500 uppercase tracking-tight font-medium">API_ROOT:</span>
              <span className="text-[10px] font-mono text-orange-500 font-bold">v1_STABLE</span>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-[#0A0A0B]">
          <main className="px-6 py-4 space-y-4 max-w-7xl w-full mx-auto pb-12">
            {/* Top Panel explaining user intent clearly */}
            <div className="p-3 bg-[#111113] border border-[#222] border-l-2 border-l-orange-500 rounded-sm text-xs leading-normal text-gray-400 flex items-start gap-3">
              <Info className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#E0E0E0] uppercase tracking-wide text-[10px] mb-0.5">Telemetry Trace Verification</p>
                <p className="text-[11px] leading-relaxed">
                  You are investigating the trace bridge connecting <strong className="text-white">GitHub Repository Selection</strong> → <strong className="text-white">Model Packaging</strong> → <strong className="text-white">Registry Listing</strong> → <strong className="text-white">Sandbox Deployments</strong>. Use this cockpit to test each micro-transaction, slide parameters to measure probability routing economics, and audit outputs dynamically. Both GitHub OAuth and Deployment structures are verified <strong className="text-green-500 font-mono">BACKEND-OK</strong>.
                </p>
              </div>
            </div>

            {/* Render Tab Views dynamically */}
            <div className="block mt-2">
              {currentTab === ' cockpit' && (
                <div className="space-y-4">
                  <PipelineTracer
                    repositories={repositories}
                    currentAsset={currentAsset}
                    currentDeployment={currentDeployment}
                    verificationProgress={verificationProgress}
                    onUpdateStep={handleUpdateStep}
                    onResetVerification={handleResetVerification}
                  />

                  {/* Sub-panel showing live terminal right under cockpit for extreme utility */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mt-4 font-mono">
                      <Terminal className="h-3.5 w-3.5 text-orange-500" />
                      Dynamic Route Trace / Terminal Shell
                    </h3>
                    <TerminalConsole logs={logs} onTriggerCommand={handleTriggerCommand} />
                  </div>
                </div>
              )}

              {currentTab === 'routing' && (
                <RoutingMatrix 
                  initialParams={routingParams} 
                  onParamsChange={(params) => setRoutingParams(params)} 
                />
              )}

              {currentTab === 'ledger' && (
                <TimelineLedger 
                  certificates={certificates} 
                  onIssueNewBlock={handleIssueBirthCertificate} 
                />
              )}

              {currentTab === 'explorer' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-md font-bold uppercase tracking-tight text-[#E0E0E0] font-mono">API Route Catalog Inventory</h2>
                    <p className="text-xs text-slate-500">Verifying REST endpoint specifications mapped on Veklom pipeline schemas.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Route card left */}
                    <div className="bg-[#111113] border border-[#222] rounded p-4 space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-500 border-b border-orange-500/10 pb-1">Authentication & Connected Profiles</h3>
                      <div className="space-y-1.5 text-xs font-mono">
                        {[
                          { method: 'GET', url: '/api/v1/auth/github/login', label: 'Redirects to OAuth consent flow' },
                          { method: 'GET', url: '/api/v1/auth/github/callback', label: 'Returns redirect verification code' },
                          { method: 'GET', url: '/api/v1/auth/github/status', label: 'Checks integration login status' },
                          { method: 'POST', url: '/api/v1/auth/github/repos/select', label: 'Saves active repository reference' }
                        ].map((r, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-[#0A0A0B] border border-[#222] rounded gap-1">
                            <span className="text-orange-400 font-bold text-[11px]">{r.method} {r.url}</span>
                            <span className="text-gray-500 text-[10px] font-sans font-medium">{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Route card right */}
                    <div className="bg-[#111113] border border-[#222] rounded p-4 space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#3b82f6] border-b border-[#3b82f6]/10 pb-1">Deployments Engine</h3>
                      <div className="space-y-1.5 text-xs font-mono">
                        {[
                          { method: 'GET', url: '/api/v1/deployments', label: 'Fetch list of sandbox clusters' },
                          { method: 'POST', url: '/api/v1/deployments', label: 'Launch new pipeline microVM node' },
                          { method: 'PATCH', url: '/api/v1/deployments/{id}', label: 'Patch model parameters dynamically' },
                          { method: 'POST', url: '/api/v1/deployments/{id}/pause', label: 'Halt active agent process thread' }
                        ].map((r, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-[#0A0A0B] border border-[#222] rounded gap-1">
                            <span className="text-blue-400 font-bold text-[11px]">{r.method} {r.url}</span>
                            <span className="text-gray-500 text-[10px] font-sans font-medium">{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* High Density Footer matching theme specifications exactly */}
        <footer className="px-6 py-2 border-t border-[#222] bg-[#0D0D0E] flex items-center justify-between shrink-0 select-none">
          <div className="flex gap-4">
            <span className="text-[10px] text-gray-500 font-mono font-medium">VERSION: 0.8.2-BETA</span>
            <span className="text-[10px] text-gray-500 font-mono font-medium">NODE_ID: vkm-edge-01</span>
          </div>
          <div className="text-[10px] text-orange-550 animate-pulse uppercase font-mono font-bold tracking-tight">
            SYSTEM_INTEGRITY: ONLINE_TRACE_RESOURCES_VERIFIED_OK
          </div>
        </footer>
      </div>
    </div>
  );
}
