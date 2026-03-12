/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, 
  Server, 
  Database, 
  RefreshCw, 
  Trash2, 
  ArrowRight, 
  Box, 
  Shield, 
  Zap, 
  Image as ImageIcon, 
  Wand2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ChevronRight,
  Info,
  Tag,
  Key,
  Lock,
  UserCheck,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---

type Tab = 'architecture' | 'cost-analysis' | 'security' | 'design' | 'worker-config' | 'ai-lab';

interface WorkerFlow {
  id: string;
  label: string;
  description: string;
  steps: string[];
  costImpact?: string;
}

// --- Components ---

const CustomerAccount = ({ 
  id, 
  name, 
  primaryRegion, 
  drRegion, 
  isActive,
  target = 'original',
  restoreSource = 'hot',
  showWorker = false
}: { 
  id: string, 
  name: string, 
  primaryRegion: string, 
  drRegion: string, 
  isActive: boolean,
  target?: 'original' | 'dr',
  restoreSource?: 'hot' | 'cold',
  showWorker?: boolean
}) => {
  return (
    <div className={`border-2 rounded-2xl p-4 transition-all duration-500 relative flex flex-col gap-4 ${
      isActive ? 'border-blue-500/50 bg-blue-500/5 shadow-lg shadow-blue-500/5' : 'border-zinc-800 bg-zinc-900/20 opacity-60'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{name}</span>
          <span className="text-[8px] text-zinc-500 font-mono">ID: {id}</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${isActive ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
          {isActive ? 'Restoring' : 'Protected'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Primary Region */}
        <div className={`border rounded-xl p-3 relative transition-all duration-500 ${
          isActive && target === 'original' 
            ? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/20' 
            : 'bg-zinc-800/50 border-zinc-700'
        }`}>
          <div className="absolute -top-2 left-2 bg-zinc-900 px-1 text-[7px] text-zinc-500 uppercase font-mono">{primaryRegion}</div>
          <div className="flex flex-col gap-2 mt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-zinc-900/40 p-1.5 rounded border border-zinc-700/30">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-2.5 h-2.5 text-orange-400" />
                  <span className="text-[7px] text-zinc-300 uppercase font-bold">Hot (Snapshots)</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 animate-pulse" />
              </div>
              <div className={`flex items-center justify-between bg-zinc-900/40 p-1.5 rounded border transition-all duration-500 ${
                isActive && target === 'original' && restoreSource === 'cold' ? 'border-blue-500/50 bg-blue-500/10' : 'border-zinc-700/30'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Cloud className={`w-2.5 h-2.5 ${isActive && target === 'original' && restoreSource === 'cold' ? 'text-blue-400' : 'text-blue-400/60'}`} />
                  <span className={`text-[7px] ${isActive && target === 'original' && restoreSource === 'cold' ? 'text-zinc-100' : 'text-zinc-300'} uppercase font-bold`}>Cold (S3 Repo)</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${isActive && target === 'original' && restoreSource === 'cold' ? 'bg-blue-500 animate-pulse' : 'bg-blue-500/50'}`} />
              </div>
            </div>
            {isActive && target === 'original' && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2 bg-blue-500/20 p-1.5 rounded border border-blue-500/30">
                  <Server className="w-3 h-3 text-blue-400" />
                  <span className="text-[8px] text-white font-bold">Target Instance</span>
                </div>
                {showWorker && (
                  <div className="flex items-center gap-2 bg-emerald-500/20 p-1.5 rounded border border-emerald-500/30">
                    <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span className="text-[8px] text-emerald-400 font-bold uppercase">Local Worker</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* DR Region */}
        <div className={`border border-dashed rounded-xl p-3 relative transition-all duration-500 ${
          isActive && target === 'dr' 
            ? 'bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/20' 
            : 'bg-zinc-800/30 border-zinc-700/50'
        }`}>
          <div className="absolute -top-2 left-2 bg-zinc-900 px-1 text-[7px] text-zinc-500 uppercase font-mono">{drRegion}</div>
          <div className="flex flex-col gap-2 mt-1">
            <div className="space-y-1.5 opacity-70">
              <div className="flex items-center justify-between bg-zinc-900/40 p-1.5 rounded border border-zinc-700/30">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-2.5 h-2.5 text-orange-400/60" />
                  <span className="text-[7px] text-zinc-400 uppercase font-bold">Hot (Snapshots)</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/30" />
              </div>
              <div className={`flex items-center justify-between bg-zinc-900/40 p-1.5 rounded border transition-all duration-500 ${
                isActive && target === 'dr' && restoreSource === 'cold' ? 'border-blue-500/50 bg-blue-500/10' : 'border-zinc-700/30'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Cloud className={`w-2.5 h-2.5 ${isActive && target === 'dr' && restoreSource === 'cold' ? 'text-blue-400' : 'text-blue-400/60'}`} />
                  <span className={`text-[7px] ${isActive && target === 'dr' && restoreSource === 'cold' ? 'text-zinc-100' : 'text-zinc-300'} uppercase font-bold`}>Cold (S3 Repo)</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${isActive && target === 'dr' && restoreSource === 'cold' ? 'bg-blue-500 animate-pulse' : 'bg-blue-500/50'}`} />
              </div>
            </div>
            {isActive && target === 'dr' && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2 bg-purple-500/20 p-1.5 rounded border border-purple-500/30">
                  <Server className="w-3 h-3 text-purple-400" />
                  <span className="text-[8px] text-white font-bold">DR Target</span>
                </div>
                {showWorker && (
                  <div className="flex items-center gap-2 bg-emerald-500/20 p-1.5 rounded border border-emerald-500/30">
                    <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span className="text-[8px] text-emerald-400 font-bold uppercase">Local Worker</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VPC Endpoints Indicator (Subtle) */}
      <div className="mt-1 flex items-center gap-2 opacity-40">
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500" />
          <div className="w-1 h-1 rounded-full bg-emerald-500" />
          <div className="w-1 h-1 rounded-full bg-emerald-500" />
        </div>
        <span className="text-[6px] text-zinc-500 uppercase font-mono tracking-tighter">VPC Endpoints (S3, EC2, STS)</span>
      </div>
    </div>
  );
};


const ArchitectureDiagram = () => {
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [deploymentModel, setDeploymentModel] = useState<'centralized' | 'customer'>('centralized');
  const [restoreSource, setRestoreSource] = useState<'hot' | 'cold'>('hot');
  const [restoreDest, setRestoreDest] = useState<'original' | 'dr'>('original');

  const customers = [
    { id: 'CUST-001', name: 'Global Retail', primary: 'us-east-1', dr: 'us-west-2' },
    { id: 'CUST-002', name: 'FinTech Solutions', primary: 'eu-central-1', dr: 'eu-west-1' },
    { id: 'CUST-003', name: 'Health Systems', primary: 'ap-southeast-1', dr: 'ap-northeast-1' },
  ];

  const getFlowSteps = (idx: number) => {
    const cust = customers[idx];
    const targetRegion = restoreDest === 'original' ? cust.primary : cust.dr;
    const sourceLabel = restoreSource === 'hot' ? 'Snapshot (Hot)' : 'S3 Bucket (Cold)';
    const workerLoc = deploymentModel === 'centralized' ? 'MSP Central VPC' : 'Customer VPC';
    
    const baseSteps = restoreSource === 'hot' 
      ? [
          `N2W identifies Target in Customer Account (${targetRegion})`,
          `N2W triggers AWS API to restore from ${sourceLabel} (API only)`,
          `AWS performs native snapshot restore to Target`,
          `Restore completed via orchestration (No Worker needed)`
        ]
      : [
          `N2W identifies Target in Customer Account (${targetRegion})`,
          deploymentModel === 'centralized' 
            ? `N2W launches Worker in MSP Central VPC (${targetRegion})`
            : `N2W assumes role and launches Worker in Customer VPC (${targetRegion})`,
          `AZ MATCH: Worker MUST launch in ${targetRegion} to match target`,
          `Worker streams data from ${sourceLabel} to Target (Data flow)`,
          `Worker terminates in ${deploymentModel === 'centralized' ? 'MSP' : 'Customer'} Account`
        ];

    return baseSteps;
  };

  const flows: Record<string, WorkerFlow> = {
    restore_c1: {
      id: 'restore_c1',
      label: 'Restore Customer 1',
      description: `Restore from ${restoreSource.toUpperCase()} to ${restoreDest.toUpperCase()} region.`,
      steps: getFlowSteps(0)
    },
    restore_c2: {
      id: 'restore_c2',
      label: 'Restore Customer 2',
      description: `Restore from ${restoreSource.toUpperCase()} to ${restoreDest.toUpperCase()} region.`,
      steps: getFlowSteps(1)
    },
    restore_c3: {
      id: 'restore_c3',
      label: 'Restore Customer 3',
      description: `Restore from ${restoreSource.toUpperCase()} to ${restoreDest.toUpperCase()} region.`,
      steps: getFlowSteps(2)
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Diagram Canvas */}
      <div className="flex-1 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 relative overflow-hidden min-h-[850px]">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 flex flex-col gap-8 h-full">
          
          {/* Instructions */}
          <div className="text-center mb-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold animate-pulse">
              Click <span className="text-emerald-400">Centralized VPC</span> or <span className="text-blue-400">Customer VPC</span> to see the different worker launch patterns for MSPs
            </p>
          </div>

          {/* Deployment & Restore Options */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex gap-1">
              <button 
                onClick={() => setDeploymentModel('centralized')}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  deploymentModel === 'centralized' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Cloud className="w-3 h-3" /> Centralized VPC
              </button>
              <button 
                onClick={() => setDeploymentModel('customer')}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  deploymentModel === 'customer' ? 'bg-blue-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Server className="w-3 h-3" /> Customer VPC
              </button>
            </div>

            <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex gap-1">
              <button 
                onClick={() => setRestoreSource('hot')}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  restoreSource === 'hot' ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Zap className="w-3 h-3" /> Hot (Snapshot)
              </button>
              <button 
                onClick={() => setRestoreSource('cold')}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  restoreSource === 'cold' ? 'bg-blue-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Cloud className="w-3 h-3" /> Cold (S3)
              </button>
            </div>

            <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex gap-1">
              <button 
                onClick={() => setRestoreDest('original')}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  restoreDest === 'original' ? 'bg-zinc-100 text-black' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Original Region
              </button>
              <button 
                onClick={() => setRestoreDest('dr')}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  restoreDest === 'dr' ? 'bg-purple-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                DR Account/Region
              </button>
            </div>
          </div>

          {/* MSP Central Account */}
          <div className={`border-2 rounded-2xl p-6 transition-all duration-500 ${
            deploymentModel === 'centralized' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/20'
          } relative`}>
            <div className="absolute -top-3 left-6 bg-emerald-500 text-black px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest">
              MSP CENTRAL ACCOUNT (Orchestration)
            </div>
            
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* N2W Server */}
              <div className="bg-zinc-800 border-2 border-emerald-500/50 p-5 rounded-2xl shadow-xl shadow-emerald-500/20 w-full lg:w-72 z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Server className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">N2W Server</h3>
                    <p className="text-[9px] text-zinc-500">Management Hub</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1 bg-zinc-900/50 p-2 rounded border border-zinc-700">
                    <div className="flex items-center gap-2 text-[9px] text-zinc-400">
                      <Shield className="w-3 h-3 text-emerald-500" /> N2WS Server Instance Role
                    </div>
                    <div className="text-[7px] text-zinc-500 font-mono pl-5">sts:AssumeRole enabled</div>
                  </div>
                </div>
              </div>

              {/* Centralized Worker VPC */}
              <div className={`flex-1 bg-zinc-900/80 border rounded-2xl p-5 relative transition-all duration-500 ${
                deploymentModel === 'centralized' ? 'border-emerald-500/20' : 'border-zinc-800 opacity-20'
              }`}>
                <div className="absolute -top-2 right-4 bg-zinc-800 px-2 text-[8px] text-emerald-500 font-mono uppercase">Centralized Worker VPC</div>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Primary Region Subnets */}
                  {customers.map((cust, i) => {
                    const isActiveWorker = activeFlow === `restore_c${i+1}` && 
                                         deploymentModel === 'centralized' && 
                                         restoreDest === 'original' &&
                                         restoreSource === 'cold';
                    return (
                      <div key={`${cust.id}-primary`} className={`border rounded-xl p-3 bg-zinc-900/50 flex flex-col gap-2 transition-all duration-500 ${
                        isActiveWorker ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-zinc-800'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-mono uppercase">{cust.primary}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${isActiveWorker ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-400 font-bold">Subnet {String.fromCharCode(65 + i)}</span>
                          <span className="text-[7px] text-zinc-600 uppercase font-mono">Primary Site</span>
                        </div>
                        
                        {isActiveWorker && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500 border border-emerald-400 p-2 rounded-lg flex items-center gap-2 shadow-lg"
                          >
                            <Zap className="w-3 h-3 text-black animate-pulse" />
                            <span className="text-[8px] text-black font-bold uppercase">Worker</span>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  {/* DR Region Subnets */}
                  {customers.map((cust, i) => {
                    const isActiveWorker = activeFlow === `restore_c${i+1}` && 
                                         deploymentModel === 'centralized' && 
                                         restoreDest === 'dr' &&
                                         restoreSource === 'cold';
                    return (
                      <div key={`${cust.id}-dr`} className={`border rounded-xl p-3 bg-zinc-900/50 flex flex-col gap-2 transition-all duration-500 ${
                        isActiveWorker ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-zinc-800'
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-zinc-500 font-mono uppercase">{cust.dr}</span>
                          <div className={`w-1.5 h-1.5 rounded-full ${isActiveWorker ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-zinc-400 font-bold">Subnet {String.fromCharCode(68 + i)}</span>
                          <span className="text-[7px] text-zinc-600 uppercase font-mono">DR Site</span>
                        </div>
                        
                        {isActiveWorker && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500 border border-emerald-400 p-2 rounded-lg flex items-center gap-2 shadow-lg"
                          >
                            <Zap className="w-3 h-3 text-black animate-pulse" />
                            <span className="text-[8px] text-black font-bold uppercase">Worker</span>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* VPC Endpoints */}
                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest">VPC Endpoints (Interface & Gateway)</span>
                    <Shield className="w-3 h-3 text-emerald-500/50" />
                  </div>
                  <div className="flex gap-2">
                    {['S3 Gateway', 'EC2 Interface', 'STS Interface'].map((ep) => (
                      <div key={ep} className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg p-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        <span className="text-[7px] text-zinc-400 font-bold uppercase">{ep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data & Orchestration Lines */}
          <div className="relative h-24">
            <div className="absolute inset-0 flex justify-around px-20">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex flex-col items-center gap-1 relative">
                  {restoreSource === 'cold' && activeFlow === `restore_c${i+1}` && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-1/2 -translate-y-1/2 -left-10 bg-zinc-900 border border-blue-500/50 p-2 rounded-xl z-20 shadow-2xl flex items-center gap-2"
                    >
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-[8px] text-blue-400 font-bold uppercase">S3 Repo</span>
                    </motion.div>
                  )}
                  
                  <div className={`w-px h-full bg-gradient-to-b ${restoreSource === 'hot' ? 'from-orange-500' : 'from-blue-500'} to-emerald-500 relative ${activeFlow === `restore_c${i+1}` ? 'opacity-100' : 'opacity-20'}`}>
                    {activeFlow === `restore_c${i+1}` && (
                      <motion.div 
                        animate={restoreSource === 'hot' ? { top: ['0%', '100%'] } : { top: ['100%', '0%', '100%'] }}
                        transition={{ repeat: Infinity, duration: restoreSource === 'hot' ? 1 : 2, ease: "linear" }}
                        className={`absolute w-1.5 h-1.5 ${restoreSource === 'hot' ? 'bg-orange-400' : 'bg-blue-400'} rounded-full -left-[2.5px] shadow-[0_0_10px_white]`}
                      />
                    )}
                  </div>
                  <div className="text-[7px] text-zinc-600 font-mono uppercase tracking-widest mt-2">
                    {restoreSource === 'hot' ? 'Snapshot Flow' : 'S3 Data Flow'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {customers.map((cust, idx) => {
              const isActive = activeFlow === `restore_c${idx + 1}`;
              return (
                <div key={cust.id} className="relative">
                  <CustomerAccount 
                    id={cust.id}
                    name={cust.name}
                    primaryRegion={cust.primary}
                    drRegion={cust.dr}
                    isActive={isActive}
                    target={restoreDest}
                    restoreSource={restoreSource}
                    showWorker={isActive && deploymentModel === 'customer' && restoreSource === 'cold'}
                  />
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Controls & Info */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
            <Zap className="w-4 h-4 text-emerald-400" /> MSP Restore Ops
          </h3>
          <div className="flex flex-col gap-3">
            {Object.values(flows).map((flow) => (
              <button
                key={flow.id}
                onClick={() => setActiveFlow(activeFlow === flow.id ? null : flow.id)}
                className={`text-left p-4 rounded-lg border transition-all ${
                  activeFlow === flow.id 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-tighter">{flow.label}</span>
                  {activeFlow === flow.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">{flow.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-4">Model Comparison</h4>
          <div className="space-y-4">
            <div className={`p-3 rounded-lg border transition-all ${deploymentModel === 'centralized' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 opacity-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-bold text-white uppercase">Centralized VPC</span>
              </div>
              <p className="text-[9px] text-zinc-400 leading-relaxed">
                Best for MSPs. Keeps customer VPCs clean. Centralized networking and billing in the MSP account.
              </p>
            </div>
            <div className={`p-3 rounded-lg border transition-all ${deploymentModel === 'customer' ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-800 opacity-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Server className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-bold text-white uppercase">Customer VPC</span>
              </div>
              <p className="text-[9px] text-zinc-400 leading-relaxed">
                Simplest networking. No cross-account VPC access needed. Worker is local to the data and target.
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {activeFlow && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 flex-1"
            >
              <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-4">Execution Steps</h4>
              <div className="flex flex-col gap-4">
                {flows[activeFlow].steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
                        {i + 1}
                      </div>
                      {i < flows[activeFlow].steps.length - 1 && <div className="w-px h-full bg-zinc-800 my-1" />}
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


const SecurityFlow = () => {
  const [step, setStep] = useState(0);

  const trustPolicy = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::MSP-ACCOUNT-ID:role/N2WS-Server-Role"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "N2WS-UNIQUE-ID-12345"
        }
      }
    }
  ]
}`;

  const steps = [
    {
      title: "1. Instance Identity",
      desc: "N2WS Server is assigned an IAM Instance Profile (Role) in the MSP Account.",
      icon: <Server className="w-5 h-5 text-emerald-400" />
    },
    {
      title: "2. Trust Handshake",
      desc: "Customer creates a role trusting the MSP Role, secured by a unique External ID.",
      icon: <Lock className="w-5 h-5 text-blue-400" />
    },
    {
      title: "3. API Call Flow",
      desc: "N2WS Server calls AWS STS to assume the customer role for cross-account access.",
      icon: <RefreshCw className="w-5 h-5 text-purple-400" />
    },
    {
      title: "4. Resource Access",
      desc: "N2WS performs backup/restore operations on Hot (Snapshots) and Cold (S3) storage.",
      icon: <Database className="w-5 h-5 text-orange-400" />
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: MSP Account */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Cloud className="w-16 h-16" />
            </div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> MSP Account
            </h3>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
                  <Server className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-[10px]">
                  <div className="text-white font-bold">N2WS Server Instance</div>
                  <div className="text-zinc-500 font-mono">i-0abcd1234efgh5678</div>
                </div>
              </div>
              <div className="border-t border-zinc-700 pt-3">
                <div className="flex items-center gap-2 text-[9px] text-zinc-400 mb-2">
                  <UserCheck className="w-3 h-3 text-emerald-500" /> Attached IAM Role:
                </div>
                <div className="bg-zinc-950 p-2 rounded font-mono text-[9px] text-emerald-500/80 break-all">
                  arn:aws:iam::111222333:role/N2WS-Server-Role
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Code className="w-4 h-4" /> API Call (STS)
            </h3>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-[10px] text-purple-400 space-y-1">
              <div>aws sts assume-role \\</div>
              <div className="pl-4">--role-arn arn:aws:iam::999888777:role/N2WS-Backup \\</div>
              <div className="pl-4">--role-session-name N2WS-Session \\</div>
              <div className="pl-4">--external-id N2WS-UNIQUE-ID-12345</div>
            </div>
          </div>
        </div>

        {/* Middle: The Connection */}
        <div className="flex flex-col items-center justify-center gap-8 py-12">
          <div className="relative w-full flex flex-col items-center">
            <div className="w-px h-32 bg-gradient-to-b from-emerald-500 via-purple-500 to-blue-500 relative">
              <motion.div 
                animate={{ top: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute w-2 h-2 bg-white rounded-full -left-[3.5px] shadow-[0_0_15px_white]"
              />
            </div>
            <div className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest -mt-16 z-10 shadow-xl">
              AssumeRole Handshake
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            {steps.map((s, i) => (
              <button 
                key={i}
                onClick={() => setStep(i)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                  step === i ? 'bg-zinc-800 border-zinc-600 shadow-lg' : 'bg-zinc-900/30 border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="mt-1">{s.icon}</div>
                <div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-tight">{s.title}</div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Customer Account */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Box className="w-16 h-16" />
            </div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Customer Account
            </h3>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                  <Key className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-[10px]">
                  <div className="text-white font-bold">N2WS Backup Role</div>
                  <div className="text-zinc-500 font-mono">arn:aws:iam::999888777:role/N2WS-Backup</div>
                </div>
              </div>
              <div className="border-t border-zinc-700 pt-3">
                <div className="flex items-center gap-2 text-[9px] text-zinc-400 mb-2">
                  <Lock className="w-3 h-3 text-blue-500" /> Trust Policy (External ID):
                </div>
                <div className="bg-zinc-950 p-3 rounded font-mono text-[8px] text-blue-400/80 overflow-x-auto whitespace-pre">
                  {trustPolicy}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase mb-2 flex items-center gap-2">
              <Info className="w-3 h-3" /> Security Note
            </h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              The <strong>External ID</strong> is a unique secret shared between N2WS and the customer. It prevents the "Confused Deputy" problem by ensuring the role can only be assumed by the specific N2WS instance it was intended for.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
const DesignConsiderations = () => {
  const benefits = [
    { title: "Non-Intrusive", desc: "Zero footprint in customer VPCs; no temporary compute or network changes required in tenant environments." },
    { title: "IP Conservation", desc: "Prevents consuming limited subnet IP capacity in production workload VPCs." },
    { title: "Network Segmentation", desc: "Maintains strict segmentation boundaries by isolating temporary compute." },
    { title: "Centralized Control", desc: "Easier monitoring, logging, and consistent network configuration across tenants." },
    { title: "Simplified Scaling", desc: "Allows multi-tenant scaling without modifying every workload VPC." }
  ];

  const requirements = [
    { title: "AZ Awareness", desc: "MSP must identify all customer AZs in advance to ensure the Centralized VPC has subnets ready for restores." },
    { title: "AZ Matching", desc: "Worker MUST launch in the same Availability Zone as the restore target (EBS is AZ-scoped)." },
    { title: "API Connectivity", desc: "Worker VPC requires HTTPS (443) access to AWS APIs via IGW or VPC Endpoints." },
    { title: "Subnet Density", desc: "Requires at least one dedicated subnet per Availability Zone used for restores." },
    { title: "No Workloads", desc: "The Worker VPC should exist solely for temporary instances; no application workloads." }
  ];

  const lifecycle = [
    { title: "On-Demand Compute", desc: "Launched only for Cold (S3) restores, repository writes, or file-level recovery. Hot restores are API-only." },
    { title: "Dynamic Location", desc: "Launched in target region/account for data streaming, or snapshot region for file-level exploration." },
    { title: "Secure Communication", desc: "Communicates with N2WS server over HTTPS (443) and SSH (22). Network must allow this." },
    { title: "Customizable", desc: "Instance type, VPC, and Security Groups are pre-configurable in the N2WS console." }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Design Benefits
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                <div className="text-[11px] font-bold text-white uppercase mb-1">{b.title}</div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Critical Requirements
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {requirements.map((r, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                <div className="text-[11px] font-bold text-white uppercase mb-1">{r.title}</div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Worker Lifecycle & Data Transfer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {lifecycle.map((l, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col gap-2">
              <div className="text-[10px] font-bold text-white uppercase">{l.title}</div>
              <p className="text-[9px] text-zinc-500 leading-relaxed">{l.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-[10px] font-bold text-orange-400 uppercase mb-2">
            <Info className="w-3 h-3" /> Data Transfer Considerations
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-300 uppercase">Cross-Region Transfer</div>
              <p className="text-[9px] text-zinc-500">Transfers between regions incur AWS data transfer costs and increased latency.</p>
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-300 uppercase">IAM Permissions</div>
              <p className="text-[9px] text-zinc-500">Workers require roles to write to S3, create volumes, and manage EC2 resources.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CostAnalysis = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Local Restore (Same AZ)</h3>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tracking-tighter">ZERO TRANSFER COST</div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            By using the Centralized VPC to launch the worker in the <span className="text-zinc-300 font-bold">exact same AZ</span> as the target, you avoid all AWS data transfer fees. You only pay for the temporary compute runtime.
          </p>
          <div className="mt-auto pt-4 border-t border-zinc-800 text-[10px] font-mono text-zinc-400">
            Efficiency: 100% | Latency: Lowest
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">DR Restore (Cross Region)</h3>
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono tracking-tighter">EGRESS APPLIES</div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Only applicable when restoring from a DR copy in a different region. Standard AWS egress rates (~$0.02-$0.09/GB) apply for the cross-region data movement.
          </p>
          <div className="mt-auto pt-4 border-t border-zinc-800 text-[10px] font-mono text-zinc-400">
            Path: DR Region → Primary Region
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-emerald-500/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Cost Flow Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 border-r border-zinc-800 space-y-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">Normal Day (No Restore)</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase">Hot (Snapshot) storage cost</div>
                    <div className="text-[10px] text-zinc-500 italic">Billed to Customer</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase">Cold (S3) storage cost</div>
                    <div className="text-[10px] text-zinc-500 italic">Billed to Customer</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="p-8 space-y-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">Restore Event</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase">Worker Runtime & Volumes</div>
                    <div className="text-[10px] text-zinc-500 italic">Billed to the account where workers are launched (MSP Account in Centralized)</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <RefreshCw className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase">Data Transfer</div>
                    <div className="text-[10px] text-zinc-500 italic">Associated data transfer costs are billed to the worker's account</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Trash2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase">ZeroEBS™ Storage Savings</div>
                    <div className="text-[10px] text-zinc-500 italic">Eliminates original EBS snapshots after successful S3/Glacier copy</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase">Worker Tagging</div>
                    <div className="text-[10px] text-zinc-500 italic">Automatic tags for chargeback</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Chargeback</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            N2WS allows you to automatically <span className="text-zinc-300 font-bold">tag workers</span> with customer IDs, project codes, or department names.
          </p>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-[10px] space-y-2">
            <div className="text-zinc-500"># Example AWS Tags</div>
            <div className="flex justify-between">
              <span className="text-emerald-500">Customer:</span>
              <span className="text-zinc-300">GlobalRetail</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-500">Operation:</span>
              <span className="text-zinc-300">Restore</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-500">CostCenter:</span>
              <span className="text-zinc-300">Ops-2024</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-400 italic">
            Easily export these tags to AWS Cost Explorer for precise billing.
          </p>
        </div>
      </div>
    </div>
  );
};


const AILab = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      // @ts-ignore - window.aistudio is injected
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } catch (e) {
      console.error("Failed to check API key", e);
    }
  };

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error("No image data returned from model.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key session expired. Please re-select your key.");
      } else {
        setError(err.message || "Failed to generate image. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col gap-8">
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Wand2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Nano Banana 2</h2>
            <p className="text-sm text-zinc-400">Generate technical diagrams or conceptual art using Gemini 3.1 Flash Image</p>
          </div>
        </div>

        {!hasKey ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700">
            <Shield className="w-12 h-12 text-zinc-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">API Key Required</h3>
            <p className="text-sm text-zinc-400 max-w-md mb-6">
              To use high-quality image generation, you must select a paid Gemini API key from your Google Cloud project.
            </p>
            <button
              onClick={handleSelectKey}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Select API Key <ExternalLink className="w-4 h-4" />
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 underline"
            >
              Learn about Gemini API billing
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate (e.g., 'A futuristic cloud architecture diagram with glowing nodes and data streams')..."
                className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none transition-all"
              />
              <button
                onClick={generateImage}
                disabled={isGenerating || !prompt.trim()}
                className="absolute bottom-4 right-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    Generate <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="aspect-square w-full max-w-lg mx-auto bg-zinc-800/50 rounded-2xl border border-zinc-700 flex items-center justify-center overflow-hidden relative group">
              {generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="AI Generated" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a 
                      href={generatedImage} 
                      download="n2w-ai-diagram.png"
                      className="px-4 py-2 bg-white text-black font-bold rounded-lg flex items-center gap-2"
                    >
                      Download Image
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-600">
                  <ImageIcon className="w-12 h-12" />
                  <span className="text-sm font-medium">Your generated image will appear here</span>
                </div>
              )}
              {isGenerating && (
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  <div className="text-center">
                    <p className="text-white font-medium">Creating your masterpiece...</p>
                    <p className="text-xs text-zinc-500 mt-1">This usually takes 10-20 seconds</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
          <Info className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-white mb-1">High Quality</h4>
          <p className="text-[10px] text-zinc-500">Uses Gemini 3.1 Flash Image for 1K resolution outputs.</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
          <Zap className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-white mb-1">Fast Iteration</h4>
          <p className="text-[10px] text-zinc-500">Optimized for quick conceptualization of complex systems.</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
          <Shield className="w-5 h-5 text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-white mb-1">Secure</h4>
          <p className="text-[10px] text-zinc-500">Direct integration with your own Google Cloud API keys.</p>
        </div>
      </div>
    </div>
  );
};

const WorkerConfiguration = () => {
  const parameters = [
    {
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
      title: "User & Account",
      desc: "Select the User and Account that the new worker is associated with."
    },
    {
      icon: <Cloud className="w-4 h-4 text-blue-400" />,
      title: "Region",
      desc: "Applied to all workers launched in this region for this account. Separate config needed for each account/region combo."
    },
    {
      icon: <Key className="w-4 h-4 text-orange-400" />,
      title: "Key Pair",
      desc: "Select a key pair for SSH access. Using 'Don't use key pair' disables SSH connections."
    },
    {
      icon: <Box className="w-4 h-4 text-purple-400" />,
      title: "VPC",
      desc: "Must be able to access the subnet where N2W is running and the S3 endpoint."
    },
    {
      icon: <Lock className="w-4 h-4 text-red-400" />,
      title: "Security Group",
      desc: "Must allow outgoing connections to the N2W server and to the S3 endpoint."
    },
    {
      icon: <ArrowRight className="w-4 h-4 text-yellow-400" />,
      title: "Subnet",
      desc: "Choose 'Any' for automatic AZ matching with the restore target. Specific subnets must match the target AZ."
    },
    {
      icon: <Shield className="w-4 h-4 text-indigo-400" />,
      title: "Worker Role",
      desc: "Attach an IAM role or use 'No Role' for temporary credentials generated by N2W."
    },
    {
      icon: <Zap className="w-4 h-4 text-pink-400" />,
      title: "Network Access",
      desc: "Direct connection or via HTTP proxy. Required for communication with N2W and AWS APIs."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Info className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Cost Optimization Tip</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            To keep transfer fee costs down when using Copy to S3, create an <span className="text-emerald-400 font-bold">S3 VPC Endpoint</span> in the worker's VPC.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {parameters.map((p, i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-colors group">
            <div className="mb-4 p-2 bg-zinc-950 rounded-lg w-fit group-hover:bg-zinc-800 transition-colors">
              {p.icon}
            </div>
            <h5 className="text-[11px] font-bold text-white uppercase tracking-widest mb-2">{p.title}</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-400" /> Subnet Selection Logic
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Automatic Selection ('Any')</div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              N2W will automatically choose a subnet that is in the same Availability Zone as the one you are restoring to. This ensures EBS volume compatibility.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter">Manual Selection</div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              If you choose a specific subnet that is not in the same AZ as the restore target, you will be prompted to choose a different subnet during the recovery process.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Operations List */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-400" /> Worker Operations
          </h4>
          <div className="space-y-4">
            {[
              { title: "Copy to S3 (Backup)", desc: "The worker reads data from EBS snapshots or volumes and writes it to the S3 Repository for long-term, low-cost storage." },
              { title: "Restore from S3 (Recovery)", desc: "The worker pulls block data from the S3 Repository and writes it directly to new EBS volumes in the target account." },
              { title: "File Level Recovery (FLR)", desc: "The worker mounts the S3-based backup data and provides a temporary file browser for individual file extraction." },
              { title: "Disaster Recovery", desc: "Facilitates cross-region and cross-account recovery by streaming data from S3 to the DR target region." }
            ].map((op, i) => (
              <div key={i} className="flex gap-4 p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-200 uppercase mb-1">{op.title}</div>
                  <p className="text-[9px] text-zinc-500 leading-relaxed">{op.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Paths */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-blue-400" /> Data & Instance Paths
          </h4>
          <div className="space-y-6">
            {/* S3 to Target Path */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Path: S3 to Target (Recovery)</div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['S3 Bucket', 'VPC Endpoint', 'Worker', 'EBS Volume', 'Target Instance'].map((step, i, arr) => (
                  <React.Fragment key={step}>
                    <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      <span className="text-[9px] font-bold text-zinc-300 uppercase">{step}</span>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-700 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed italic">
                * Note: Using an S3 VPC Endpoint (Gateway) ensures data stays within the AWS backbone, reducing costs and increasing security.
              </p>
            </div>

            {/* Instance Recovery Path */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Path: Instance Reconstitution</div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {['Worker Data Sync', 'Volume Detach', 'Snapshot Creation', 'AMI Registration', 'Instance Launch'].map((step, i, arr) => (
                  <React.Fragment key={step}>
                    <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
                      <span className="text-[9px] font-bold text-zinc-300 uppercase">{step}</span>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-700 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[9px] text-zinc-500 leading-relaxed italic">
                * Note: N2WS Server orchestrates the final launch via AWS APIs once the worker has finished the block-level data transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('architecture');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">N2WS Technical Guide</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Architecture & AI Lab</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'architecture' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Architecture
            </button>
            <button
              onClick={() => setActiveTab('cost-analysis')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'cost-analysis' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Cost Analysis
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'security' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Security & IAM
            </button>
            <button
              onClick={() => setActiveTab('worker-config')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'worker-config' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Worker Config
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'design' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab('ai-lab')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'ai-lab' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Wand2 className="w-3 h-3" /> AI Lab
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://docs.n2ws.com/user-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              Official Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-64px)] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'architecture' ? (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">System Architecture</h2>
                <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                  When N2W copies data to or restores data from a Storage Repository, or Explores snapshots, it launches a temporary ‘worker’ instance to perform the actual work, such as writing objects into the repository or exploring snapshots.
                </p>
              </div>
              <ArchitectureDiagram />
            </motion.div>
          ) : activeTab === 'cost-analysis' ? (
            <motion.div
              key="cost-analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Cost Flow Analysis</h2>
                <p className="text-sm text-zinc-400 max-w-2xl">
                  Understanding how N2WS minimizes costs by keeping storage in customer accounts and using temporary compute only when needed.
                </p>
              </div>
              <CostAnalysis />
            </motion.div>
          ) : activeTab === 'security' ? (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Security & Trust Relationships</h2>
                <p className="text-sm text-zinc-400 max-w-2xl">
                  N2WS uses cross-account IAM roles and the AWS Security Token Service (STS) to securely manage customer resources without requiring long-term access keys.
                </p>
              </div>
              <SecurityFlow />
            </motion.div>
          ) : activeTab === 'worker-config' ? (
            <motion.div
              key="worker-config"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Worker Configuration</h2>
                <p className="text-sm text-zinc-400 max-w-2xl">
                  Detailed parameters and requirements for configuring temporary worker instances across accounts and regions.
                </p>
              </div>
              <WorkerConfiguration />
            </motion.div>
          ) : activeTab === 'design' ? (
            <motion.div
              key="design"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Design Considerations</h2>
                <p className="text-sm text-zinc-400 max-w-2xl">
                  Architectural requirements and benefits of using a Centralized Worker VPC for multi-tenant or large-scale environments.
                </p>
              </div>
              <DesignConsiderations />
            </motion.div>
          ) : (
            <motion.div
              key="ai-lab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <AILab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 right-6 pointer-events-none">
        <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-2xl">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">System Operational</span>
        </div>
      </footer>
    </div>
  );
}
