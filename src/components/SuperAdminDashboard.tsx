import React, { useState, useEffect, useRef } from 'react';
import { useSwagat } from '../context/SwagatContext';
import {
  superAdminApi,
  deptAdminApi,
  applicantApi
} from '../services/api';
import { getAllMockUsers } from '../lib/mockAuth';
import { BusinessType } from '../types/swagat';
import {
  ShieldAlert,
  Building2,
  GitBranch,
  Layers,
  Users,
  Upload,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  FileCode,
  Activity,
  Server,
  Lock,
  ChevronRight,
  RefreshCw,
  Eye,
  Trash2,
  Edit2
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { userProfile, logout } = useSwagat();
  const [activeTab, setActiveTab] = useState<'overview' | 'sectors' | 'trees' | 'departments' | 'users'>('overview');
  
  // Data states
  const [sectors, setSectors] = useState<BusinessType[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal / Form states
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [newSector, setNewSector] = useState({ name: '', code: '', description: '', icon: 'Building2', is_active: true });
  
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', code: '', ministry: '', default_sla_hours: 48, email: '' });

  // JSON Tree Import State
  const [selectedSectorForTree, setSelectedSectorForTree] = useState<string>('');
  const [treeJsonText, setTreeJsonText] = useState<string>('');
  const [treePreview, setTreePreview] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [secRes, deptRes] = await Promise.all([
        superAdminApi.getBusinessTypes(),
        superAdminApi.getDepartments()
      ]);
      setSectors(secRes);
      if (secRes.length > 0 && !selectedSectorForTree) {
        setSelectedSectorForTree(secRes[0].id);
      }
      setDepartments(deptRes);
      setUsersList(getAllMockUsers());
    } catch (err) {
      console.error('Failed to load super admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Add Sector
  const handleCreateSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSector.name || !newSector.code) return;
    try {
      const created = await superAdminApi.createBusinessType(newSector);
      setSectors((prev) => [...prev, created]);
      setIsSectorModalOpen(false);
      setNewSector({ name: '', code: '', description: '', icon: 'Building2', is_active: true });
      showFeedback('success', `Sector "${created.name}" created successfully!`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to create sector');
    }
  };

  // Add Department
  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return;
    try {
      const created = await superAdminApi.createDepartment(newDept);
      setDepartments((prev) => [...prev, created]);
      setIsDeptModalOpen(false);
      setNewDept({ name: '', code: '', ministry: '', default_sla_hours: 48, email: '' });
      showFeedback('success', `Department "${created.name}" registered successfully!`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to register department');
    }
  };

  // File import for Tree
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setTreeJsonText(text);
        const parsed = JSON.parse(text);
        setTreePreview(parsed);
        showFeedback('success', 'JSON tree structure validated successfully.');
      } catch (err) {
        showFeedback('error', 'Invalid JSON file format. Please check syntax.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportTree = async () => {
    if (!selectedSectorForTree) {
      showFeedback('error', 'Select a sector first');
      return;
    }
    try {
      let data = treePreview;
      if (!data && treeJsonText) {
        data = JSON.parse(treeJsonText);
      }
      if (!data) {
        showFeedback('error', 'Please upload or paste a valid JSON decision tree');
        return;
      }
      await superAdminApi.importTree(selectedSectorForTree, data);
      showFeedback('success', 'Decision tree imported into system database!');
      setTreeJsonText('');
      setTreePreview(null);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to import tree');
    }
  };

  // User role toggle
  const handleToggleUserRole = (userId: string, newRole: 'investor' | 'officer' | 'super_admin') => {
    const updated = usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setUsersList(updated);
    localStorage.setItem('swagat_mock_users', JSON.stringify(updated));
    showFeedback('success', 'User role updated successfully');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-purple-900/40 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-white">SWAGAT</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Super Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-400">National Single Window System Administration & Governance</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/40 text-xs">
            <Server className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Environment:</span>
            <span className="font-semibold text-purple-300">Production (Go + Postgres)</span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right">
              <p className="text-xs font-semibold text-white">{userProfile?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-purple-400">Global System Custodian</p>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-6">
        {/* Left Navigation Tabs */}
        <aside className="w-64 shrink-0 flex flex-col gap-2">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 mb-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 px-2">Navigation</p>
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'System Overview', icon: Activity },
                { id: 'sectors', label: 'Sector Management', icon: Layers },
                { id: 'trees', label: 'Tree Importer & Rules', icon: GitBranch },
                { id: 'departments', label: 'Departments & SLAs', icon: Building2 },
                { id: 'users', label: 'User Governance', icon: Users }
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 bg-gradient-to-b from-purple-950/40 to-slate-900/60 rounded-xl border border-purple-900/30 text-xs">
            <div className="flex items-center gap-2 text-purple-400 mb-2 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Privileged Clearance</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Super Admin possesses override authority on business sectors, department SLAs, and dynamic questionnaire graphs. Changes propagate instantly to all applicants.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Feedback banner */}
          {feedbackMsg && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium border ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {feedbackMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">System Infrastructure Overview</h1>
                <p className="text-xs text-slate-400 mt-1">Real-time health of national single window services, tree nodes & SLAs</p>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all" />
                  <p className="text-xs font-medium text-slate-400">Configured Sectors</p>
                  <p className="text-3xl font-extrabold text-white mt-2">{sectors.length}</p>
                  <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Ready for applicants
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />
                  <p className="text-xs font-medium text-slate-400">Integrated Depts</p>
                  <p className="text-3xl font-extrabold text-white mt-2">{departments.length}</p>
                  <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> State & Central bodies
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition-all" />
                  <p className="text-xs font-medium text-slate-400">Registered Users</p>
                  <p className="text-3xl font-extrabold text-white mt-2">{usersList.length}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Investors & Officers
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-pink-500/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl group-hover:bg-pink-600/20 transition-all" />
                  <p className="text-xs font-medium text-slate-400">SLA Enforcement</p>
                  <p className="text-3xl font-extrabold text-white mt-2">100%</p>
                  <p className="text-[11px] text-pink-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Automated escalation
                  </p>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-800/30">
                <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Admin Directives
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mb-4">
                  To launch a new industry or ministry, first create the sector or department record, then upload the corresponding JSON decision graph with approval mapping.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setActiveTab('sectors'); setIsSectorModalOpen(true); }}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Sector
                  </button>
                  <button
                    onClick={() => { setActiveTab('trees'); }}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Decision Tree
                  </button>
                  <button
                    onClick={() => { setActiveTab('departments'); setIsDeptModalOpen(true); }}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Register Department
                  </button>
                </div>
              </div>

              {/* Sectors Preview */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Sectors Preview</h3>
                  <button
                    onClick={() => setActiveTab('sectors')}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {sectors.slice(0, 3).map((s) => (
                    <div key={s.id} className="p-3.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-xs text-white">{s.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                          {s.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{s.description || 'Standard industry questionnaire & approval rules'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTOR MANAGEMENT */}
          {activeTab === 'sectors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Sector Management</h1>
                  <p className="text-xs text-slate-400 mt-1">Configure business types and industries available for applicant onboarding</p>
                </div>
                <button
                  onClick={() => setIsSectorModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Business Type
                </button>
              </div>

              <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3.5">Sector Name</th>
                      <th className="p-3.5">Sector Code</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sectors.map((sector) => (
                      <tr key={sector.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-semibold text-white flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                          {sector.name}
                        </td>
                        <td className="p-3.5 font-mono text-purple-300">{sector.code}</td>
                        <td className="p-3.5 text-slate-400 max-w-xs truncate">{sector.description || 'No description provided'}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedSectorForTree(sector.id);
                              setActiveTab('trees');
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300 font-medium mr-2"
                          >
                            Configure Tree
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TREE IMPORTER */}
          {activeTab === 'trees' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Questionnaire Decision Tree Importer</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Upload a structured JSON decision tree containing 4-step wizard nodes, conditions, and required department clearances.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Target Sector</label>
                    <select
                      value={selectedSectorForTree}
                      onChange={(e) => setSelectedSectorForTree(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Upload JSON Tree File</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".json"
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    JSON Payload (Paste or Inspect)
                  </label>
                  <textarea
                    rows={10}
                    value={treeJsonText}
                    onChange={(e) => {
                      setTreeJsonText(e.target.value);
                      try {
                        setTreePreview(JSON.parse(e.target.value));
                      } catch {
                        // ignore syntax while typing
                      }
                    }}
                    placeholder='{"roots": [{"step": 1, "question": "What is the nature of operation?", "options": [{"value": "Mfg", "required_docs": [...]}]}]}'
                    className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>

                {treePreview && (
                  <div className="p-3 bg-purple-950/30 rounded-lg border border-purple-800/40 text-xs text-purple-300 flex items-center justify-between">
                    <span>Valid JSON tree structure loaded with {Array.isArray(treePreview.roots) ? treePreview.roots.length : 'custom'} root nodes.</span>
                    <span className="font-semibold text-emerald-400">Ready to commit</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setTreeJsonText(
                        JSON.stringify(
                          {
                            sector_id: selectedSectorForTree,
                            steps: [
                              {
                                step: 1,
                                title: 'General Business Profile',
                                question: 'What is the scale of your facility?',
                                options: ['Micro Enterprise', 'Small Enterprise', 'Medium Enterprise', 'Mega Project']
                              },
                              {
                                step: 2,
                                title: 'Land & Environmental Clearance',
                                question: 'Will the facility generate industrial effluents?',
                                options: ['Zero Liquid Discharge', 'CETP Connected', 'Onsite ETP Plant']
                              },
                              {
                                step: 3,
                                title: 'Utility & Infrastructure',
                                question: 'Total high-tension connected power required (kVA)?',
                                options: ['Below 100 kVA', '100 - 500 kVA', 'Above 500 kVA (Dedicated Substation)']
                              },
                              {
                                step: 4,
                                title: 'Statutory Registrations & Labor',
                                question: 'Expected maximum workforce count?',
                                options: ['Under 20 workers', '20 - 100 workers', 'More than 100 workers']
                              }
                            ]
                          },
                          null,
                          2
                        )
                      );
                      setTreePreview({ status: 'sample' });
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Load Sample Template
                  </button>
                  <button
                    onClick={handleImportTree}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Commit Decision Tree to API
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPARTMENTS & SLAS */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Department & SLA Governance</h1>
                  <p className="text-xs text-slate-400 mt-1">Configure regulatory bodies, nodal officer contacts, and statutory turn-around SLAs</p>
                </div>
                <button
                  onClick={() => setIsDeptModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Department
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id || dept.code} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-sm text-white">{dept.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {dept.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{dept.ministry || 'State Regulatory Authority'}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-pink-400" />
                        Statutory SLA:
                      </span>
                      <span className="font-bold text-pink-300">{dept.default_sla_hours || 48} Hours Max</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USER GOVERNANCE */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">System User Directory & Roles</h1>
                <p className="text-xs text-slate-400 mt-1">Inspect mock authentication records, assign administrative roles and revoke permissions</p>
              </div>

              <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Current Role</th>
                      <th className="p-3.5">Department / Affiliation</th>
                      <th className="p-3.5 text-right">Switch Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-semibold text-white">{u.name}</td>
                        <td className="p-3.5 text-slate-400">{u.email}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'super_admin'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : u.role === 'officer'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{u.department || 'Applicant / Citizen'}</td>
                        <td className="p-3.5 text-right">
                          <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-0.5">
                            <button
                              onClick={() => handleToggleUserRole(u.id, 'investor')}
                              className={`px-2 py-1 text-[10px] rounded ${
                                u.role === 'investor' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Investor
                            </button>
                            <button
                              onClick={() => handleToggleUserRole(u.id, 'officer')}
                              className={`px-2 py-1 text-[10px] rounded ${
                                u.role === 'officer' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Officer
                            </button>
                            <button
                              onClick={() => handleToggleUserRole(u.id, 'super_admin')}
                              className={`px-2 py-1 text-[10px] rounded ${
                                u.role === 'super_admin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Super
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE SECTOR MODAL */}
      {isSectorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              Create Business Sector
            </h3>
            <form onSubmit={handleCreateSector} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Sector Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chemical & Petrochemical"
                  value={newSector.name}
                  onChange={(e) => setNewSector({ ...newSector, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Unique Sector Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PETRO_CHEM"
                  value={newSector.code}
                  onChange={(e) => setNewSector({ ...newSector, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe regulatory scope and target industrial activities..."
                  value={newSector.description}
                  onChange={(e) => setNewSector({ ...newSector, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsSectorModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/30"
                >
                  Save Sector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DEPT MODAL */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Register Regulatory Department
            </h3>
            <form onSubmit={handleCreateDept} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Pollution Control Board"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PCB"
                    value={newDept.code}
                    onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SLA Hours (Max)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newDept.default_sla_hours}
                    onChange={(e) => setNewDept({ ...newDept, default_sla_hours: parseInt(e.target.value) || 48 })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Parent Ministry</label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Environment, Forest and Climate Change"
                  value={newDept.ministry}
                  onChange={(e) => setNewDept({ ...newDept, ministry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/30"
                >
                  Register Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
