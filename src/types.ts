// Types and Interfaces for Veklom Sovereign AI Hub

export interface GitHubRepo {
  id: string;
  name: string;
  owner: string;
  branch: string;
  stars: number;
  updatedAt: string;
  isConnected: boolean;
}

export interface WrappedAsset {
  id: string;
  repoId: string;
  assetName: string;
  version: string;
  checksum: string; // SHA-256
  isWrapped: boolean;
  isRegistered: boolean;
  complianceChecks: {
    syntax: boolean;
    logic: boolean;
    security: boolean;
  };
  policyHash: string;
}

export interface PipelineNode {
  id: string;
  name: string;
  type: 'crawler' | 'rag' | 'mrl' | 'router' | 'executor' | 'ledger' | 'terminal';
  status: 'active' | 'idle' | 'warning' | 'error';
  latency: number;
}

export interface Deployment {
  id: string;
  name: string;
  assetId: string;
  status: 'pending' | 'running' | 'paused' | 'error';
  modelTier: 'fast' | 'medium' | 'strong';
  endpoint: string;
  uptime: number; // in seconds
  cpuUsage: number;
  memoryUsage: number;
  logs: string[];
}

export interface TraceLog {
  id: string;
  timestamp: string;
  route: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  status: number;
  statusText: 'BACKEND-OK' | 'MOCK-OK' | 'CLIENT-PROCESSED' | 'ERROR';
  description: string;
  payload: any;
  response: any;
}

export interface RoutingParameters {
  businessRisk: number; // 1 - 100
  accuracyRequirement: number; // 1 - 100
  reasoningDepth: number; // 1 - 100
  costSensitivity: number; // 1 - 100
}

export interface BirthCertificate {
  id: string;
  agentName: string;
  creator: string;
  jurisdiction: string;
  purpose: string;
  genomeHash: string;
  modelRuntime: string;
  policyPack: string;
  issuedAt: string;
  status: 'ALL CHECKS PASSED' | 'PENDING' | 'FAILED';
}
