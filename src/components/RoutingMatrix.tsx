import React, { useState } from 'react';
import { 
  Sliders, 
  HelpCircle, 
  Coins, 
  Zap, 
  TrendingDown, 
  Activity 
} from 'lucide-react';
import { RoutingParameters } from '../types';

interface RoutingMatrixProps {
  initialParams: RoutingParameters;
  onParamsChange: (params: RoutingParameters) => void;
}

export default function RoutingMatrix({ initialParams, onParamsChange }: RoutingMatrixProps) {
  const [params, setParams] = useState<RoutingParameters>(initialParams);
  const [promptVolume, setPromptVolume] = useState<number>(100000); // Daily Prompt Volume

  const handleSliderChange = (key: keyof RoutingParameters, val: number) => {
    const updated = { ...params, [key]: val };
    setParams(updated);
    onParamsChange(updated);
  };

  // 1. Calculate Unified Score using Analytic Hierarchy Process (AHP) formulation:
  // Business Risk (40% weight) + Accuracy Req (25% weight) + Reasoning Depth (20% weight) + Dynamic Inverse Cost concern (15% weight)
  const unifiedScore = parseFloat((
    (params.businessRisk * 0.40) + 
    (params.accuracyRequirement * 0.25) + 
    (params.reasoningDepth * 0.20) + 
    ((100 - params.costSensitivity) * 0.15)
  ).toFixed(1));

  // 2. Determine resulting model tier
  let selectedTier: 'fast' | 'medium' | 'strong' = 'medium';
  let tierInfo = {
    name: 'MEDIUM TIER (OPTIMIZED)',
    model: 'Veklom-Medium-Ollama-8B',
    latency: '345ms',
    costPerMillion: '$1.50',
    description: 'Perfect balance of capability, structured formatting constraints and reasonable SLA.',
    colorClass: 'text-orange-500 bg-orange-600/10 border-orange-500/20'
  };

  if (unifiedScore > 72) {
    selectedTier = 'strong';
    tierInfo = {
      name: 'STRONG TIER (FRONTIER)',
      model: 'Gemini-1.5-Pro',
      latency: '1,280ms',
      costPerMillion: '$7.00',
      description: 'Frontier performance for mission-critical logic compliance, policy bounds, and deep reasoning.',
      colorClass: 'text-red-500 bg-red-500/10 border-red-500/25'
    };
  } else if (unifiedScore < 38) {
    selectedTier = 'fast';
    tierInfo = {
      name: 'FAST TIER (UTILITY)',
      model: 'Gemini-2.5-Flash-Lite',
      latency: '110ms',
      costPerMillion: '$0.30',
      description: 'Ultralight weight processing, standard validation, syntax formatting, and fast token generation.',
      colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/25'
    };
  }

  // 3. Compute detailed economics comparing Always-Strong vs Always-Cheap vs ArbiterOS Dynamic:
  // Standard prices per 1k transactions
  const strongCostPerTx = 0.007; // $7.00 per million -> $0.007 per 1,000
  const fastCostPerTx = 0.0003; // $0.30 per million -> $0.0003 per 1,000
  const mediumCostPerTx = 0.0015; // $1.50 per million -> $0.0015 per 1,000

  // Calculate dynamic average transaction cost depending on the current sliders (unifiedScore determines ratio)
  const strongRatio = Math.max(0, (unifiedScore - 30) / 70); 
  const fastRatio = Math.max(0, (90 - unifiedScore) / 70);
  const mediumRatio = Math.max(0, 1 - strongRatio - fastRatio);

  const avgDynamicCostPerTx = (strongRatio * strongCostPerTx) + (mediumRatio * mediumCostPerTx) + (fastRatio * fastCostPerTx);

  const alwaysStrongDailyCost = (promptVolume / 1000) * strongCostPerTx * 1000;
  const alwaysCheapDailyCost = (promptVolume / 1000) * fastCostPerTx * 1000;
  const dynamicDailyCost = (promptVolume / 1000) * avgDynamicCostPerTx * 1000;

  // Let's compute average token savings % (Dynamic compared to Always-Strong)
  const savingsPct = parseFloat((((alwaysStrongDailyCost - dynamicDailyCost) / alwaysStrongDailyCost) * 100).toFixed(1));

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#E0E0E0] font-mono">Sovereign Probability Routing Matrix</h2>
        <p className="text-xs text-slate-500">Determine dynamic model selection dynamically using qualitative slider inputs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-6 bg-[#111113] border border-[#222] rounded p-4 space-y-4 shadow-sm select-none">
          <div className="flex items-center gap-2 pb-1.5 border-b border-[#222]">
            <Sliders className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">Multi-Criteria Constraints</span>
          </div>

          {/* Business Risk Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                Business Risk
                <HelpCircle className="h-3 w-3 text-gray-500 cursor-help" title="High risk tasks require deep reasoning & guardrails to avoid silent failure." />
              </span>
              <span className="text-orange-500 font-mono text-[11px] font-bold">{params.businessRisk} / 100</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={params.businessRisk}
              onChange={(e) => handleSliderChange('businessRisk', parseInt(e.target.value))}
              className="w-full accent-orange-600 bg-[#0A0A0B] h-1.5 rounded cursor-pointer" 
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>Low (Sandbox exploration)</span>
              <span>Highly Critical (Mainnet Transactions)</span>
            </div>
          </div>

          {/* Accuracy Requirement Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                Accuracy Requirement
                <HelpCircle className="h-3 w-3 text-gray-500 cursor-help" title="Determines if full structured validating and deterministic checks must execute." />
              </span>
              <span className="text-orange-500 font-mono text-[11px] font-bold">{params.accuracyRequirement} / 100</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={params.accuracyRequirement}
              onChange={(e) => handleSliderChange('accuracyRequirement', parseInt(e.target.value))}
              className="w-full accent-orange-600 bg-[#0A0A0B] h-1.5 rounded cursor-pointer" 
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>Approximate Guess OK</span>
              <span>Strict Zero-Error SLA</span>
            </div>
          </div>

          {/* Reasoning Depth Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                Reasoning Depth
                <HelpCircle className="h-3 w-3 text-gray-500 cursor-help" title="Complex agent logic pathways need high reasoning power." />
              </span>
              <span className="text-orange-500 font-mono text-[11px] font-bold">{params.reasoningDepth} / 100</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={params.reasoningDepth}
              onChange={(e) => handleSliderChange('reasoningDepth', parseInt(e.target.value))}
              className="w-full accent-orange-600 bg-[#0A0A0B] h-1.5 rounded cursor-pointer" 
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>Task-level Operations</span>
              <span>Complete Cognitive Planning</span>
            </div>
          </div>

          {/* Cost Sensitivity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-300 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                Cost Sensitivity
                <HelpCircle className="h-3 w-3 text-gray-500 cursor-help" title="Higher values prioritize routing to low-cost utility models." />
              </span>
              <span className="text-orange-500 font-mono text-[11px] font-bold">{params.costSensitivity} / 100</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={params.costSensitivity}
              onChange={(e) => handleSliderChange('costSensitivity', parseInt(e.target.value))}
              className="w-full accent-orange-600 bg-[#0A0A0B] h-1.5 rounded cursor-pointer" 
            />
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>Price is no object</span>
              <span>Ultra-Tight Budget constraints</span>
            </div>
          </div>
        </div>

        {/* Real-time Decision Output Panel */}
        <div className="lg:col-span-6 bg-[#111113] border border-[#222] rounded p-4 space-y-4 shadow-sm flex flex-col justify-between select-none">
          <div>
            <div className="flex items-center gap-2 pb-1.5 border-b border-[#222] mb-3">
              <Activity className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider">AHP Compiler Score Result</span>
            </div>

            {/* Large Score Indicator */}
            <div className="flex items-center gap-4 bg-[#0A0A0B] p-3 rounded border border-[#222]">
              <div className="text-center shrink-0">
                <div className="h-16 w-16 rounded-full border-2 border-dashed border-orange-550/30 flex items-center justify-center bg-[#111113] shadow-inner">
                  <span className="text-xl font-mono font-black text-orange-500">{unifiedScore}</span>
                </div>
                <span className="text-[8px] text-gray-500 font-mono mt-1 block tracking-wider uppercase">AHP Rating</span>
              </div>
              <div>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold border ${tierInfo.colorClass} mb-1.5`}>
                  {tierInfo.name}
                </span>
                <p className="text-[11px] text-gray-300 leading-normal">
                  Mapped to <strong className="text-white font-mono">{tierInfo.model}</strong>.
                </p>
                <div className="grid grid-cols-2 gap-x-4 mt-2 text-[10.5px]">
                  <div>
                    <span className="text-gray-500 font-mono">Latency profile:</span>
                    <p className="font-mono text-white font-bold">{tierInfo.latency}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-mono">Cost per M tokens:</span>
                    <p className="font-mono text-white font-bold">{tierInfo.costPerMillion}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10.5px] text-gray-400 mt-3 leading-normal bg-[#0D0D0E]/80 p-2 border border-[#222] rounded">
              💡 <strong className="text-white font-bold font-mono">Arbiter rule</strong>: {tierInfo.description}
            </p>
          </div>

          <div className="bg-[#0A0A0B] p-2.5 rounded border border-[#222]">
            <h5 className="text-[10px] font-bold text-gray-400 font-mono uppercase mb-1.5 flex items-center justify-between">
              <span>Dynamic Routing Path</span>
              <span className="text-[9px] text-green-500 font-mono bg-green-500/10 border border-green-500/15 px-1 py-0.2 rounded font-bold">INTEGRATED</span>
            </h5>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="bg-[#111113] border border-[#222] px-1.5 py-0.5 rounded text-gray-400">Routable_Prompt</span>
              <span className="text-gray-600 font-bold">&gt;</span>
              <span className="bg-orange-600/10 border border-orange-500/20 px-1.5 py-0.5 rounded text-orange-500 font-bold">
                AHP Router ({unifiedScore})
              </span>
              <span className="text-gray-600 font-bold">&gt;</span>
              <span className="bg-[#111113] border border-[#222] px-1.5 py-0.5 rounded text-white">{tierInfo.model.split('-')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Economics Simulation Card */}
      <div className="bg-[#111113] border border-[#222] rounded p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#222] pb-2.5">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#E0E0E0]">Daily Economics Simulator</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10.5px]">
            <label className="text-gray-500 font-bold">Prompt Volume / Day:</label>
            <input 
              type="number"
              value={promptVolume}
              onChange={(e) => setPromptVolume(Math.max(1, parseInt(e.target.value) || 0))}
              className="bg-[#0A0A0B] border border-[#222] px-2 py-0.5 text-xs rounded text-white font-mono w-28 text-center focus:border-orange-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] text-center font-mono">
            <span className="text-[10px] text-gray-500 block">Method A: Always-Strong</span>
            <p className="text-lg font-bold text-red-500 mt-1">${alwaysStrongDailyCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            <p className="text-[9px] text-gray-600 mt-1 uppercase">SLA: 100%, Budget: Destroyed</p>
          </div>

          <div className="bg-[#0A0A0B] p-3 rounded border border-[#222] text-center font-mono">
            <span className="text-[10px] text-gray-500 block">Method B: Always-Cheap</span>
            <p className="text-lg font-bold text-red-400 mt-1">${alwaysCheapDailyCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            <p className="text-[9px] text-gray-600 mt-1 uppercase">SLA: 86.8%, Failure Probability: 13.2%</p>
          </div>

          <div className="bg-[#0A0A0B] p-3 rounded border border-orange-500/25 bg-orange-600/5 text-center font-mono">
            <div className="flex items-center justify-center gap-1">
              <span className="text-[10px] text-orange-400 font-bold uppercase">Method C: Arbiter dynamic</span>
              <TrendingDown className="h-3 w-3 text-green-500" />
            </div>
            <p className="text-lg font-bold text-orange-500 mt-1">${dynamicDailyCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            <p className="text-[9.5px] text-green-550 font-bold mt-1 bg-green-500/10 px-1 py-0.5 rounded border border-green-550/15 inline-block uppercase">Saved {savingsPct}% Token Cost!</p>
          </div>
        </div>

        <div className="p-3 bg-[#0D0D0E]/80 border border-[#222] rounded text-xs text-gray-400 flex items-start gap-2 select-none leading-relaxed font-mono">
          <Zap className="h-3.5 w-3.5 text-orange-550 shrink-0 mt-0.5" />
          <p className="text-[11px]">
            By dynamically evaluating task risk profiles, standard schema requirements and cost tolerances from your sliders, <strong className="text-white">ArbiterOS</strong> safely routes routines to smaller models while reserving costly frontier models purely for mission-critical logic, providing robust production guarantees at optimal price metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
