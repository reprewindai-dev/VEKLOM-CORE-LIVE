import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Settings, 
  ArrowRight, 
  Code2, 
  Terminal, 
  Cpu, 
  Layers, 
  Globe, 
  Key, 
  ShieldCheck
} from 'lucide-react';
import { GitHubRepo, WrappedAsset, Deployment } from '../types';

interface PipelineTracerProps {
  repositories: GitHubRepo[];
  currentAsset: WrappedAsset;
  currentDeployment: Deployment | null;
  verificationProgress: {
    githubConnected: boolean;
    sourceCreated: boolean;
    assetWrapped: boolean;
    deployed: boolean;
    terminalRun: boolean;
  };
  onUpdateStep: (
    step: 'githubConnected' | 'sourceCreated' | 'assetWrapped' | 'deployed' | 'terminalRun',
    payload: any,
    logMessage: string,
    route: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
    resData: any
  ) => void;
  onResetVerification: () => void;
}

export default function PipelineTracer({
  repositories,
  currentAsset,
  currentDeployment,
  verificationProgress,
  onUpdateStep,
  onResetVerification
}: PipelineTracerProps) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>('r1');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<string>('flow'); // flow | rest

  const selectedRepo = repositories.find(r => r.id === selectedRepoId) || repositories[0];

  // Logic to advance Step 1: GitHub selected
  const handleSelectRepo = () => {
    setIsProcessing('r1');
    setTimeout(() => {
      onUpdateStep(
        'githubConnected',
        { repoId: selectedRepo.id, name: selectedRepo.name, owner: selectedRepo.owner },
        `Initialized repository connection with ${selectedRepo.owner}/${selectedRepo.name} on branch ${selectedRepo.branch}`,
        '/api/v1/auth/github/repos/select',
        'POST',
        { status: 'connected', selected_repository: `${selectedRepo.owner}/${selectedRepo.name}` }
      );
      setIsProcessing(null);
    }, 1000);
  };

  // Logic to advance Step 2: Source compiler
  const handleVerifySource = () => {
    setIsProcessing('r2');
    setTimeout(() => {
      onUpdateStep(
        'sourceCreated',
        { sourceName: selectedRepo.name, engine: 'v2-GPC-Compiler' },
        `Sovereign GPC fully categorized source modules, structure trees, and standard dependencies for ${selectedRepo.name}`,
        '/api/v1/pipelines/nodes',
        'GET',
        { 
          source_authorized: true, 
          engine: 'GPC-Compiler-V5', 
          components_mapped: ['intelligent-crawler', 'mrl-embeddings', 'sovereign-router'] 
        }
      );
      setIsProcessing(null);
    }, 1200);
  };

  // Logic to advance Step 3: Wrap asset
  const handleWrapAsset = () => {
    setIsProcessing('r3');
    setTimeout(() => {
      onUpdateStep(
        'assetWrapped',
        { assetId: 'asset_sops_triage_8c7f4a', checksum: 'sha256-42d4a6e87f3a1b2c4c6b9e8' },
        `Secured and registered model payload as wrapped asset asset_sops_triage_8c7f4a on Project Genome Ledger`,
        '/api/v1/pipelines',
        'POST',
        { 
          registered: true, 
          asset_id: 'asset_sops_triage_8c7f4a', 
          compliance_metrics: { syntax: 'PASS', logic: 'PASS', security: 'PASS' } 
        }
      );
      setIsProcessing(null);
    }, 1200);
  };

  // Logic to advance Step 4: Create deployment
  const handleCreateDeployment = () => {
    setIsProcessing('r4');
    setTimeout(() => {
      onUpdateStep(
        'deployed',
        { 
          deploymentId: 'd_sops_77e9', 
          name: `${selectedRepo.name}-Deployment`, 
          modelTier: 'medium' 
        },
        `Provisioned active execution cluster for asset_sops_triage_8c7f4a. Node endpoint ready at dev-Sovereign-VM-host`,
        '/api/v1/deployments',
        'POST',
        { 
          status: 'running', 
          deployment_id: 'd_sops_77e9', 
          model_tier_allocated: 'medium',
          endpoint: 'https://ais-dev-vm.config.run' 
        }
      );
      setIsProcessing(null);
    }, 1400);
  };

  // Logic to advance Step 5: Execute terminal loop
  const handleExecuteTerminal = () => {
    setIsProcessing('r5');
    setTimeout(() => {
      onUpdateStep(
        'terminalRun',
        { executed: true, outputs: ['Triage event initialized', 'Arbiter check: 100% compliant', 'Success status 200'] },
        `Executed transactional query on deployment d_sops_77e9 matching wrapped asset asset_sops_triage_8c7f4a. Response committed to ledger.`,
        '/api/v1/demo/pipeline/run',
        'POST',
        { 
          execution_success: true, 
          deployment_id: 'd_sops_77e9', 
          telemetry: { token_cost_saved: '$0.045', dynamic_routing_route: 'medium-tier-ollama-8B' } 
        }
      );
      setIsProcessing(null);
    }, 1000);
  };

  // Get active step counter
  let activeStepNum = 1;
  if (verificationProgress.githubConnected) activeStepNum = 2;
  if (verificationProgress.sourceCreated) activeStepNum = 3;
  if (verificationProgress.assetWrapped) activeStepNum = 4;
  if (verificationProgress.deployed) activeStepNum = 5;
  if (verificationProgress.terminalRun) activeStepNum = 6;

  return (
    <div className="space-y-4">
      {/* Upper Progress Banner */}
      <div className="bg-[#111113] border border-[#222] rounded p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Sovereign Validation Trace / Sandbox Path</h3>
            <p className="text-[11px] text-gray-500">Verifying from repository connection to isolated query execution on sandboxed MicroVMs.</p>
          </div>
          <button 
            onClick={onResetVerification}
            className="text-[10px] font-mono text-gray-400 hover:text-orange-500 border border-[#222] hover:border-orange-500/20 px-3 py-1 bg-[#0A0A0B] rounded transition-colors"
          >
            Reset Gap Check
          </button>
        </div>

        {/* 5-step horizontal progression chart */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {[
            { step: 1, label: 'GitHub Connect', isDone: verificationProgress.githubConnected },
            { step: 2, label: 'Source Compile', isDone: verificationProgress.sourceCreated },
            { step: 3, label: 'Wrap & Register', isDone: verificationProgress.assetWrapped },
            { step: 4, label: 'Deploy microVM', isDone: verificationProgress.deployed },
            { step: 5, label: 'Query Execution', isDone: verificationProgress.terminalRun }
          ].map((item) => (
            <div 
              key={item.step}
              className={`p-3 rounded border transition-all flex flex-col justify-between ${
                item.isDone 
                  ? 'bg-green-500/5 border-green-500/20 text-green-500 font-mono' 
                  : activeStepNum === item.step 
                    ? 'bg-orange-600/10 border-orange-500/30 text-orange-400 font-bold border-l-2 border-l-orange-500 font-mono' 
                    : 'bg-[#0A0A0B] border-[#222] text-gray-500 font-mono'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[9px] font-bold tracking-tight">GATEWAY_0{item.step}</span>
                {item.isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                ) : activeStepNum === item.step ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                ) : null}
              </div>
              <h4 className="text-[10.5px] font-bold leading-tight mt-0.5 uppercase tracking-wide truncate">{item.label}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Main active control gateway card */}
      <div className="bg-[#111113] border border-[#222] rounded overflow-hidden">
        {/* Toggle step header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-[#222] bg-[#161618]">
          <div className="flex items-center gap-2">
            <Settings className="h-3.5 w-3.5 text-orange-550" />
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">
              {activeStepNum <= 5 ? `Active Verification: Station ${activeStepNum} of 5` : 'All Gap Stages Sealed!'}
            </span>
          </div>
          <div className="flex bg-[#0A0A0B] p-0.5 rounded border border-[#222] text-[10px] font-mono">
            <button 
              onClick={() => setActiveStepTab('flow')}
              className={`px-2.5 py-0.5 rounded transition-colors ${activeStepTab === 'flow' ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Interactive Flow
            </button>
            <button 
              onClick={() => setActiveStepTab('rest')}
              className={`px-2.5 py-0.5 rounded transition-colors ${activeStepTab === 'rest' ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              REST Route Map
            </button>
          </div>
        </div>

        {/* Step Cards based on step progression value */}
        <div className="p-4">
          {/* STEP 1: GITHUB CONNECTION */}
          {activeStepNum === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide font-mono">
                  <GitBranch className="h-4 w-4 text-orange-500" />
                  Connect GitHub Source Reference
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Select your active repository workspace target containing the sovereign blueprints, policy declarations, and code metrics.
                </p>
              </div>

              {activeStepTab === 'flow' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 tracking-wider block uppercase mb-1 font-mono">Choose Target Repository</span>
                      <select 
                        value={selectedRepoId}
                        onChange={(e) => setSelectedRepoId(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-[#222] text-[#E0E0E0] text-xs rounded p-2 outline-none focus:border-orange-500/30 font-mono"
                      >
                        {repositories.map(repo => (
                          <option key={repo.id} value={repo.id}>{repo.owner}/{repo.name} ({repo.branch})</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-[#0A0A0B] p-2.5 rounded border border-[#222] text-[10.5px] space-y-1 text-gray-400 font-mono">
                      <div>Repository owner: <span className="text-white font-bold">{selectedRepo.owner}</span></div>
                      <div>Primary branch: <span className="text-white font-bold">{selectedRepo.branch}</span></div>
                      <div>Route Status: <span className="text-green-500 font-bold bg-green-500/10 px-1 py-0.5 rounded text-[9.5px]">CONNECTED_STABLE</span></div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#0A0A0B] p-3.5 rounded border border-[#222] font-mono text-[11px] text-gray-400 space-y-3">
                    <p className="leading-relaxed">
                      This executes <code className="text-orange-500 bg-orange-600/10 border border-orange-500/10 px-1 py-0.5 rounded text-[10px]">POST /api/v select</code> to securely map authorization scopes into the live container database.
                    </p>
                    <button
                      onClick={handleSelectRepo}
                      disabled={isProcessing === 'r1'}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold rounded border border-orange-500/20 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isProcessing === 'r1' ? (
                        <span>MAPPING REPOSITORY IDENTIFIER...</span>
                      ) : (
                        <>
                          <span>COMMIT REPOSITORY HANDLER</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] font-mono text-xs text-gray-400 space-y-3">
                  <div className="flex justify-between border-b border-[#222] pb-1.5 text-[11px] font-bold">
                    <span className="text-orange-500">POST /api/v1/auth/github/repos/select</span>
                    <span className="text-green-500">Status 200 (BACKEND-OK)</span>
                  </div>
                  <pre className="p-2 bg-[#0D0D0E] rounded border border-[#222] text-[10.5px] text-gray-300 overflow-x-auto">{`{
  "repository_owner": "${selectedRepo.owner}",
  "repository_name": "${selectedRepo.name}",
  "branch": "${selectedRepo.branch}",
  "client_auth_source": "github_oauth"
}`}</pre>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SOURCE VERIFY */}
          {activeStepNum === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide font-mono">
                  <Code2 className="h-4 w-4 text-orange-500" />
                  GPC Source Configuration Parsing
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Execute syntactic interpretation on instructions, mapping neural configurations and database nodes safely.
                </p>
              </div>

              {activeStepTab === 'flow' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] text-xs space-y-3 font-mono">
                    <h5 className="font-bold text-orange-500 flex items-center gap-1.5 uppercase text-[10px] tracking-wide border-b border-[#222] pb-1.5">
                      <Cpu className="h-3 w-3" /> Compiler Telemetry
                    </h5>
                    <div className="space-y-2 text-[10.5px] text-gray-400">
                      <div className="flex justify-between">
                        <span>Input Repository:</span>
                        <span className="text-white font-bold">{selectedRepo.owner}/{selectedRepo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blueprint verification:</span>
                        <span className="text-green-500 font-bold bg-green-500/10 px-1 rounded text-[9.5px]">VERIFIED_OK</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Source Format:</span>
                        <span className="text-white">YAML Declarations / JSON-RPC</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#0A0A0B] p-3.5 rounded border border-[#222] font-mono text-[11px] text-gray-400 space-y-3">
                    <p className="leading-relaxed">
                      Sovereign compilers parse source schemas before constructing execution bundles to guarantee that memory sandboxes and cognitive limits are fully locked down.
                    </p>
                    <button
                      onClick={handleVerifySource}
                      disabled={isProcessing === 'r2'}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold rounded border border-orange-500/20 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isProcessing === 'r2' ? (
                        <span>INTERPRETING GPC BINDINGS...</span>
                      ) : (
                        <>
                          <span>EXECUTE GPC BLUEPRINT PARSER</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] font-mono text-xs text-gray-400 space-y-3">
                  <div className="flex justify-between border-b border-[#222] pb-1.5 text-[11px] font-bold">
                    <span className="text-orange-500">GET /api/v1/pipelines/nodes</span>
                    <span className="text-green-500">Status 200 (BACKEND-OK)</span>
                  </div>
                  <pre className="p-2 bg-[#0D0D0E] rounded border border-[#222] text-[10.5px] text-gray-300 overflow-x-auto">{`[
  { "id": "node_crawler_01", "name": "Repo Intelligent Crawler", "type": "crawler" },
  { "id": "node_mrl_01", "name": "Matryoshka Representation Learner", "type": "embeddings" },
  { "id": "node_router_01", "name": "Sovereign Economics Router", "type": "router" }
]`}</pre>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: WRAP ASSET */}
          {activeStepNum === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide font-mono">
                  <Layers className="h-4 w-4 text-orange-500" />
                  Asset Wrapping & Project Genome Submission
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Package the pipeline bytecode within a signed sandbox container.
                </p>
              </div>

              {activeStepTab === 'flow' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] text-xs space-y-3 font-mono">
                    <h5 className="font-bold text-orange-500 flex items-center gap-1.5 uppercase text-[10px] tracking-wide border-b border-[#222] pb-1.5">
                      <ShieldCheck className="h-3 w-3" /> Compliance Verification Core
                    </h5>
                    <div className="space-y-2 text-[10.5px] text-gray-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span>Abstract Syntax Tree validation (GPC Checklist)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span>Security scope bounds evaluation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span>Ledger cryptographic signing configuration</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#0A0A0B] p-3.5 rounded border border-[#222] font-mono text-[11px] text-gray-400 space-y-3">
                    <p className="leading-relaxed">
                      Sovereign code signatures are appended to produce a registered logical container bundle mapped on Project Genome records.
                    </p>
                    <button
                      onClick={handleWrapAsset}
                      disabled={isProcessing === 'r3'}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold rounded border border-orange-500/20 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isProcessing === 'r3' ? (
                        <span>SEALING ASSET BINDINGS AND HASHING...</span>
                      ) : (
                        <>
                          <span>SIGN & SECURE ASSET WRAPPER</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] font-mono text-xs text-gray-400 space-y-3">
                  <div className="flex justify-between border-b border-[#222] pb-1.5 text-[11px] font-bold">
                    <span className="text-orange-500">POST /api/v1/pipelines</span>
                    <span className="text-green-500">Status 200 (BACKEND-OK)</span>
                  </div>
                  <pre className="p-2 bg-[#0D0D0E] rounded border border-[#222] text-[10.5px] text-gray-300 overflow-x-auto">{`{
  "source_node_ref": "node_crawler_01",
  "policy_binding": "Veklom-Sovereign-OpsCore-3.2",
  "isolated_execution": true
}`}</pre>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: PROVISION DEPLOYMENT */}
          {activeStepNum === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide font-mono">
                  <Globe className="h-4 w-4 text-orange-500" />
                  Spin up Active Cluster Deployment
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Instantiate the isolated runtime microVM using your cryptographically signed asset verification wrapper.
                </p>
              </div>

              {activeStepTab === 'flow' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] text-xs space-y-3 font-mono">
                    <h5 className="font-bold text-orange-500 flex items-center gap-1.5 uppercase text-[10px] tracking-wide border-b border-[#222] pb-1.5">
                      <Key className="h-3 w-3" /> Deployment Parameters
                    </h5>
                    <div className="space-y-2 text-[10.5px] text-gray-400">
                      <div className="flex justify-between">
                        <span>Source Asset Hash:</span>
                        <span className="text-orange-400 font-bold font-mono">{currentAsset.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allocated Ingress Target:</span>
                        <span className="text-white">Veklom-MicroVM-Cluster-Central</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Routing Type:</span>
                        <span className="text-white font-mono">AHP Matrix Economy</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#0A0A0B] p-3.5 rounded border border-[#222] font-mono text-[11px] text-gray-400 space-y-3">
                    <p className="leading-relaxed">
                      Launches a sandbox sandbox server with structural firewall partitions and maps the API path to enable transaction tracing metrics.
                    </p>
                    <button
                      onClick={handleCreateDeployment}
                      disabled={isProcessing === 'r4'}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold rounded border border-orange-500/20 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isProcessing === 'r4' ? (
                        <span>BOOTSTRAPPING sandbox microVM...</span>
                      ) : (
                        <>
                          <span>LUNCH CLUSTER MICROVM NODE</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] font-mono text-xs text-gray-400 space-y-3">
                  <div className="flex justify-between border-b border-[#222] pb-1.5 text-[11px] font-bold">
                    <span className="text-orange-500">POST /api/v1/deployments</span>
                    <span className="text-green-500">Status 200 (BACKEND-OK)</span>
                  </div>
                  <pre className="p-2 bg-[#0D0D0E] rounded border border-[#222] text-[10.5px] text-gray-300 overflow-x-auto">{`{
  "asset_id": "asset_sops_triage_8c7f4a",
  "deployment_parameters": {
    "hardware_type": "high-concurrency-microvm",
    "maximum_concurrency_capacity": 120,
    "state_synchronization": "redis_lua_distributed_lease"
  }
}`}</pre>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: RUN AGENT TERMINAL QUERY */}
          {activeStepNum === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wide font-mono">
                  <Terminal className="h-4 w-4 text-orange-500" />
                  Execute Command Actions via Deployment ID
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Fire trace diagnostics utilizing both the authenticated active deployment reference and signature credentials!
                </p>
              </div>

              {activeStepTab === 'flow' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] text-xs space-y-2.5 font-mono">
                    <p className="text-orange-500 font-bold uppercase text-[10.5px] tracking-wide border-b border-[#222] pb-1.5">Terminal Diagnostic Status</p>
                    <div className="space-y-1 text-[10.5px] text-gray-500">
                      <div>$ veklomrun --trace-gap --dry</div>
                      <div>Target Node: d_sops_77e9 ... <span className="text-green-500 font-bold">STABLE</span></div>
                      <div>Asset digest checksum... <span className="text-green-500 font-bold">OK-MATCH</span></div>
                      <div>Dynamic route firewall... <span className="text-green-500 font-bold">PASS [L0]</span></div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-[#0A0A0B] p-3.5 rounded border border-[#222] font-mono text-[11px] text-gray-400 space-y-3">
                    <p className="leading-relaxed">
                      Launches queries directly with the active deployment, sealing execution validations down into the ledger to complete the full trace.
                    </p>
                    <button
                      onClick={handleExecuteTerminal}
                      disabled={isProcessing === 'r5'}
                      className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-mono font-bold rounded border border-orange-500/20 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isProcessing === 'r5' ? (
                        <span>Simulating execution trace...</span>
                      ) : (
                        <>
                          <span>Run Execution Verifier Loop</span>
                          <ArrowRight className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] font-mono text-xs text-gray-400 space-y-3">
                  <div className="flex justify-between border-b border-[#222] pb-1.5 text-[11px] font-bold">
                    <span className="text-orange-500">POST /api/v1/demo/pipeline/run</span>
                    <span className="text-green-500">Status 200 (BACKEND-OK)</span>
                  </div>
                  <pre className="p-2 bg-[#0D0D0E] rounded border border-[#222] text-[10.5px] text-gray-300">{`{
  "deployment_id": "d_sops_77e9",
  "query": "Trace diagnostic state integrity logs",
  "aribiter_confidence_checkpoint": "0.988"
}`}</pre>
                </div>
              )}
            </div>
          )}

          {/* ALL COMPLETED */}
          {activeStepNum === 6 && (
            <div className="bg-green-500/5 border border-green-500/20 p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono select-none">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-green-500 flex items-center gap-2 uppercase tracking-wide">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  Sovereign Gap-Trace Path Fully Connected!
                </h4>
                <p className="text-[11px] text-gray-400 leading-normal max-w-xl">
                  Gap tracing validation successfully sealed. The system securely handles GitHub repository connection, cognitive parsing, signed container submission, isolated cluster deployment and querying referencing verified deployment IDs.
                </p>
              </div>
              <button
                onClick={onResetVerification}
                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded text-xs border border-green-500/20 transition-all cursor-pointer text-center shrink-0"
              >
                Reset Verification Path
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic State Overview of Verified Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#111113] border border-[#222] p-3.5 rounded font-mono">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Source Connection Host</span>
          <p className="text-[9.5px] text-gray-500 mb-2">Maps linked repository coordinates.</p>
          <div className="flex items-center gap-2 text-[10.5px] font-medium bg-[#0A0A0B] p-2 rounded border border-[#222]">
            {verificationProgress.githubConnected ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span className="text-white truncate font-bold text-[10px]">{selectedRepo.owner}/{selectedRepo.name}</span>
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                <span className="text-gray-600 italic">Not Connected</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#111113] border border-[#222] p-3.5 rounded font-mono">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Ledger Target Hash</span>
          <p className="text-[9.5px] text-gray-500 mb-2">Cryptographic registry signatures.</p>
          <div className="flex items-center gap-2 text-[10.5px] font-medium bg-[#0A0A0B] p-2 rounded border border-[#222]">
            {verificationProgress.assetWrapped ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span className="text-white truncate font-mono text-[9px] font-bold">asset_sops_triage_8c7f4a (SHA-256)</span>
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                <span className="text-gray-600 italic">No Registry Found</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#111113] border border-[#222] p-3.5 rounded font-mono">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Run Deployment ID</span>
          <p className="text-[9.5px] text-gray-500 mb-2">Dynamic cluster routing indices.</p>
          <div className="flex items-center gap-2 text-[10.5px] font-medium bg-[#0A0A0B] p-2 rounded border border-[#222]">
            {verificationProgress.deployed ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-white truncate font-bold text-[10px]">d_sops_77e9 (Tier: OPTIMIZED)</span>
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-gray-700"></div>
                <span className="text-gray-600 italic">No Active VM Node</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
