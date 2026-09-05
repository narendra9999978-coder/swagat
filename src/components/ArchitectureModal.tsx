import React from 'react';
import { useJourney } from '../context/JourneyContext';
import { ARCHITECTURE_NODES } from '../data/architecture';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Database, 
  Network, 
  Server, 
  KeyRound, 
  FileLock, 
  Activity,
  Workflow,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ArchitectureModal: React.FC = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen } = useJourney();

  if (!isArchitectureModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-5xl w-full shadow-gov-xl border border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0B2545] px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-xl text-white">
                  SWAGAT GovTech System Architecture
                </h3>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                  Production Blueprint
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                High-throughput microservices architecture with IndiaStack &amp; OpenGov integrations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          
          {/* Architecture Visual Diagram Blueprint */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
            
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Full-Stack GovTech Topology
              </span>
              <h4 className="font-display font-bold text-lg text-white mt-1">
                Omnichannel Touchpoints → API Gateway → Department Matrix
              </h4>
            </div>

            {/* Layer 1: Touchpoints & Auth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 text-xs space-y-2">
                <div className="text-blue-400 font-bold flex items-center space-x-1.5">
                  <Network className="w-4 h-4" />
                  <span>1. Omnichannel Clients</span>
                </div>
                <div className="text-slate-300 space-y-1 font-mono text-[11px]">
                  <div>• React 19 Web SPA (PWA)</div>
                  <div>• Flutter Citizen Mobile App</div>
                  <div>• CSC Gram Panchayat Kiosks</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 text-xs space-y-2">
                <div className="text-rose-400 font-bold flex items-center space-x-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>2. Authentication &amp; RBAC</span>
                </div>
                <div className="text-slate-300 space-y-1 font-mono text-[11px]">
                  <div>• Aadhaar eKYC OTP &amp; Face-Auth</div>
                  <div>• JWT Session with RBAC claims</div>
                  <div>• Citizen / Officer / Inspector Roles</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 text-xs space-y-2">
                <div className="text-purple-400 font-bold flex items-center space-x-1.5">
                  <Server className="w-4 h-4" />
                  <span>3. High-Speed API &amp; Queue</span>
                </div>
                <div className="text-slate-300 space-y-1 font-mono text-[11px]">
                  <div>• Golang / Gin High-Throughput API</div>
                  <div>• NATS JetStream Event Queue</div>
                  <div>• PostgreSQL 16 + MinIO Store</div>
                </div>
              </div>
            </div>

            {/* Downward Flow Indicator */}
            <div className="flex items-center justify-center space-x-2 text-xs font-mono text-amber-400 py-1">
              <span>↓ Secure API Gateway (Kong / Apigee) with Mutual TLS ↓</span>
            </div>

            {/* Layer 2: Secure OpenGov Connectors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { name: 'DigiLocker', desc: 'Paperless Docs' },
                { name: 'PAN NSDL', desc: 'Tax ID Auth' },
                { name: 'e-Sign (UIDAI)', desc: 'Digital Legality' },
                { name: 'Treasury Payments', desc: 'Gov PG Gateway' },
                { name: 'Land Records', desc: 'Bhulekh / 7-12' },
                { name: 'SMS / Email Gateway', desc: 'OTP & Alerts' }
              ].map((conn, idx) => (
                <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-center">
                  <div className="text-xs font-bold text-emerald-300">{conn.name}</div>
                  <div className="text-[10px] text-slate-400">{conn.desc}</div>
                </div>
              ))}
            </div>

            {/* Layer 3: Multi-Department Parallel Dispatch */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4" />
                  <span>Parallel Department Dispatch &amp; RTS SLA Clocks</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Right to Public Services Mandate</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {['Pollution Control', 'Fire Services', 'Labour Dept', 'Factories Inspectorate', 'Electricity Discom'].map((dept, i) => (
                  <div key={i} className="p-2 bg-slate-950 rounded-lg text-center border border-white/10 text-xs font-semibold text-slate-200">
                    {dept}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Detailed Node Explanations */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-base text-slate-200">
              Key Architectural Modules:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ARCHITECTURE_NODES.map((node) => (
                <div key={node.id} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">{node.label}</span>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-blue-200">{node.tech}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {node.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Compliant with Digital Personal Data Protection (DPDP) Act 2023 &amp; MeitY Guidelines.
          </span>

          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-white text-[#0B2545] font-bold text-xs hover:bg-slate-100 transition"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
};
