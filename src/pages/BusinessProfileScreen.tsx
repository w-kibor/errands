import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Wallet,
  Users,
  Tag,
  UploadCloud,
  Plus,
  ShieldCheck,
  UserPlus,
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { BusinessRole } from '../types';

export const BusinessProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentBusiness,
    currentMemberRole,
    userBusinesses,
    selectBusiness,
    topupCorporateWallet,
    inviteTeamMember,
    createCostCenter,
    createBranch,
    createBusinessProfile
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'team' | 'branches_costs' | 'bulk'>('overview');

  // Modal States
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('5000');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isCreateBizModalOpen, setIsCreateBizModalOpen] = useState(false);

  // Form States
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<BusinessRole>('STAFF_REQUESTER');
  const [costCode, setCostCode] = useState('');
  const [costName, setCostName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [newBizName, setNewBizName] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');

  // Bulk Dispatch State
  const [bulkCsvText, setBulkCsvText] = useState(`[
  {
    "pickup": { "address": "Mombasa Road HQ, Nairobi" },
    "dropoff": { "address": "Westlands Mall, Nairobi" },
    "packageType": "DOCUMENT",
    "urgency": "NORMAL",
    "requireOtp": true,
    "requireSignature": true
  },
  {
    "pickup": { "address": "Kilimani Warehouse, Nairobi" },
    "dropoff": { "address": "CBD Junction, Nairobi" },
    "packageType": "SMALL_BOX",
    "urgency": "EXPRESS",
    "requireOtp": true,
    "requireSignature": false
  }
]`);
  const [bulkStatus, setBulkStatus] = useState<string | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const handleTopup = async () => {
    const val = Number(topupAmount);
    if (!val || val <= 0) return;
    try {
      await topupCorporateWallet(val, 'MPESA');
      setIsTopupModalOpen(false);
      window.alert(`Successfully topped up KES ${val.toLocaleString()} to Corporate Wallet via M-Pesa STK Push!`);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Top-up failed');
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteTeamMember({
        name: inviteName,
        email: inviteEmail,
        phone: invitePhone,
        role: inviteRole
      });
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInvitePhone('');
      window.alert('Team member invitation sent!');
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Invite failed');
    }
  };

  const handleAddCostCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCostCenter(costCode, costName);
      setIsCostCenterModalOpen(false);
      setCostCode('');
      setCostName('');
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Cost center creation failed');
    }
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBranch({ name: branchName, address: branchAddress });
      setIsBranchModalOpen(false);
      setBranchName('');
      setBranchAddress('');
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Branch creation failed');
    }
  };

  const handleCreateNewBiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBusinessProfile({
        name: newBizName,
        email: newBizEmail,
        phone: newBizPhone
      });
      setIsCreateBizModalOpen(false);
      setNewBizName('');
      setNewBizEmail('');
      setNewBizPhone('');
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Business creation failed');
    }
  };

  const handleExecuteBulkDispatch = async () => {
    if (!currentBusiness) return;
    setIsProcessingBulk(true);
    setBulkStatus(null);

    try {
      const items = JSON.parse(bulkCsvText);
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Please enter a valid JSON array of errand jobs');
      }

      const res = await fetch(`http://localhost:4000/api/business/${currentBusiness.id}/errands/bulk-dispatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'chem'
        },
        body: JSON.stringify({
          filename: `batch-${Date.now()}.json`,
          items
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bulk dispatch failed');

      setBulkStatus(`Success! Dispatched ${data.orderCount} corporate errands. Wallet auto-deducted.`);
    } catch (err) {
      setBulkStatus(`Error: ${err instanceof Error ? err.message : 'Invalid JSON input'}`);
    } finally {
      setIsProcessingBulk(false);
    }
  };

  // If no corporate business profile created yet
  if (!currentBusiness) {
    return (
      <div className="flex flex-col h-full bg-slate-50 px-6 py-10 items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
          <Building2 size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Business Profile Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
          Set up your corporate profile to manage team dispatching, prepaid wallets, and cost centers.
        </p>
        <button
          onClick={() => setIsCreateBizModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Create Corporate Business</span>
        </button>

        {/* Create Biz Modal */}
        <AnimatePresence>
          {isCreateBizModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl text-left space-y-4">
                <h3 className="text-xl font-extrabold text-slate-900">Register Corporate Profile</h3>
                <form onSubmit={handleCreateNewBiz} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Company Name</label>
                    <input
                      required
                      type="text"
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      placeholder="e.g. Acme Logistics Ltd"
                      className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Corporate Email</label>
                    <input
                      required
                      type="email"
                      value={newBizEmail}
                      onChange={(e) => setNewBizEmail(e.target.value)}
                      placeholder="billing@acme.com"
                      className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Contact Phone (+254)</label>
                    <input
                      required
                      type="tel"
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      placeholder="+254712345678"
                      className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateBizModalOpen(false)}
                      className="flex-1 py-3 text-slate-500 font-bold border rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                    >
                      Create Profile
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white overflow-y-auto no-scrollbar">
      {/* Top Bar Header */}
      <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md z-30 px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg text-white tracking-tight">{currentBusiness.name}</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">
                {currentMemberRole || 'OWNER_ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Corporate B2B Management</p>
          </div>
        </div>

        {/* Business Selector Dropdown */}
        {userBusinesses.length > 1 && (
          <select
            value={currentBusiness.id}
            onChange={(e) => selectBusiness(e.target.value)}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 outline-none"
          >
            {userBusinesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Hero Wallet Balance Card */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden border border-blue-500/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Corporate Prepaid Wallet</p>
              <h2 className="text-3xl font-black text-white mt-1">
                KES {(currentBusiness.wallet?.balance || 0).toLocaleString()}
              </h2>
            </div>
            <button
              onClick={() => setIsTopupModalOpen(true)}
              className="bg-white text-blue-900 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md hover:bg-blue-50 transition-all flex items-center space-x-1.5"
            >
              <Plus size={14} />
              <span>Top Up Wallet</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs">
            <div>
              <p className="text-blue-200 text-[10px]">Team Members</p>
              <p className="font-extrabold text-white text-sm mt-0.5">{currentBusiness._count?.members || 1}</p>
            </div>
            <div>
              <p className="text-blue-200 text-[10px]">Total Orders</p>
              <p className="font-extrabold text-white text-sm mt-0.5">{currentBusiness._count?.orders || 0}</p>
            </div>
            <div>
              <p className="text-blue-200 text-[10px]">Branches</p>
              <p className="font-extrabold text-white text-sm mt-0.5">{currentBusiness.branches?.length || 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="px-6 pb-4">
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl space-x-1 overflow-x-auto no-scrollbar border border-slate-700/50">
          {[
            { id: 'overview', label: 'Profile', icon: Building2 },
            { id: 'wallet', label: 'Wallet & Ledger', icon: Wallet },
            { id: 'team', label: 'Team & RBAC', icon: Users },
            { id: 'branches_costs', label: 'Branches & Costs', icon: Tag },
            { id: 'bulk', label: 'Bulk Dispatch', icon: UploadCloud }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 px-6 pb-8 space-y-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck size={16} className="text-blue-400" />
                <span>Corporate Registration Details</span>
              </h3>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">Company Name</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">{currentBusiness.name}</p>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">Corporate Email</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">{currentBusiness.email}</p>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">Contact Phone</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">{currentBusiness.phone}</p>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                  <p className="text-slate-400">Tax ID / KRA Pin</p>
                  <p className="font-extrabold text-white text-sm mt-0.5">{currentBusiness.taxId || 'KRA-P051928491A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WALLET TAB */}
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Wallet Ledger</h3>
              <button
                onClick={() => setIsTopupModalOpen(true)}
                className="text-xs font-bold text-blue-400 hover:underline flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Top Up</span>
              </button>
            </div>

            <div className="space-y-2">
              {(currentBusiness.wallet?.transactions || []).length === 0 ? (
                <div className="bg-slate-800/40 p-6 text-center text-slate-400 rounded-2xl text-xs">
                  No transactions recorded yet. Top up your corporate wallet to get started.
                </div>
              ) : (
                currentBusiness.wallet?.transactions?.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-xs">{tx.description}</span>
                        {tx.costCenter && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-mono">
                            {tx.costCenter.code}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Ref: {tx.referenceId || tx.id.slice(-8)}</p>
                    </div>
                    <span
                      className={`font-black text-sm ${
                        tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}KES {Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Team Members & RBAC Roles</h3>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5"
              >
                <UserPlus size={14} />
                <span>Invite Member</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(currentBusiness.members || []).map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-xs">{m.user?.name || 'Team Member'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.user?.email || m.user?.phone}</p>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRANCHES & COSTS TAB */}
        {activeTab === 'branches_costs' && (
          <div className="space-y-6">
            {/* Cost Centers */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Tagged Cost Centers</h3>
                <button
                  onClick={() => setIsCostCenterModalOpen(true)}
                  className="text-xs text-blue-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Add Code</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(currentBusiness.costCenters || []).map((cc) => (
                  <div key={cc.id} className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
                    <p className="font-mono text-blue-400 font-extrabold text-xs">{cc.code}</p>
                    <p className="text-white font-semibold text-xs mt-1">{cc.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Branches */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Branch Locations</h3>
                <button
                  onClick={() => setIsBranchModalOpen(true)}
                  className="text-xs text-blue-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Add Branch</span>
                </button>
              </div>

              <div className="space-y-2">
                {(currentBusiness.branches || []).map((b) => (
                  <div key={b.id} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white text-xs">{b.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{b.address}</p>
                    </div>
                    {b.isPrimary && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                        HQ Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BULK DISPATCH TAB */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-3xl space-y-3">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
                <FileSpreadsheet size={16} />
                <span>Bulk CSV / JSON Errand Dispatch Engine</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paste your array of corporate errand orders below. The engine auto-calculates total fare, deducts your corporate wallet balance, and creates jobs with PoD OTP verification codes.
              </p>

              <textarea
                rows={8}
                value={bulkCsvText}
                onChange={(e) => setBulkCsvText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs font-mono text-blue-200 outline-none focus:border-blue-500"
              />

              {bulkStatus && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-bold ${
                    bulkStatus.startsWith('Success')
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {bulkStatus}
                </div>
              )}

              <button
                disabled={isProcessingBulk}
                onClick={handleExecuteBulkDispatch}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center space-x-2"
              >
                {isProcessingBulk ? (
                  <span>Processing Batch...</span>
                ) : (
                  <>
                    <UploadCloud size={16} />
                    <span>Dispatch Bulk Batch Errand</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TOP UP MODAL */}
      <AnimatePresence>
        {isTopupModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-left space-y-4">
              <h3 className="text-lg font-bold text-white">Top Up Corporate Wallet</h3>
              <p className="text-xs text-slate-400">Enter M-Pesa STK Push top-up amount (KES):</p>
              
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white font-extrabold text-xl p-3.5 rounded-2xl text-center outline-none focus:border-blue-500"
              />

              <div className="grid grid-cols-3 gap-2">
                {['2000', '5000', '10000'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTopupAmount(preset)}
                    className="py-2 bg-slate-800 text-xs font-bold text-slate-300 rounded-xl hover:bg-slate-700"
                  >
                    KES {Number(preset).toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTopupModalOpen(false)}
                  className="flex-1 py-3 text-slate-400 font-bold border border-slate-700 rounded-2xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopup}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs hover:bg-blue-700"
                >
                  Pay via M-Pesa
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INVITE MEMBER MODAL */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md text-left space-y-4">
              <h3 className="text-lg font-bold text-white">Invite Team Member</h3>
              <form onSubmit={handleInviteMember} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Name</label>
                  <input
                    required
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Email</label>
                  <input
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Phone</label>
                  <input
                    required
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="+254712345678"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">RBAC Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as BusinessRole)}
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  >
                    <option value="STAFF_REQUESTER">Staff / Requester</option>
                    <option value="MANAGER_DISPATCHER">Manager / Dispatcher</option>
                    <option value="OWNER_ADMIN">Owner / Admin</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 py-3 text-slate-400 font-bold border border-slate-700 rounded-2xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs hover:bg-blue-700"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COST CENTER MODAL */}
      <AnimatePresence>
        {isCostCenterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-left space-y-4">
              <h3 className="text-lg font-bold text-white">Create Cost Center Tag</h3>
              <form onSubmit={handleAddCostCenter} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Cost Code (e.g. #MARKETING)</label>
                  <input
                    required
                    type="text"
                    value={costCode}
                    onChange={(e) => setCostCode(e.target.value)}
                    placeholder="#MARKETING"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Department / Title</label>
                  <input
                    required
                    type="text"
                    value={costName}
                    onChange={(e) => setCostName(e.target.value)}
                    placeholder="Marketing Department"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCostCenterModalOpen(false)}
                    className="flex-1 py-3 text-slate-400 font-bold border border-slate-700 rounded-2xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs hover:bg-blue-700"
                  >
                    Add Code
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BRANCH MODAL */}
      <AnimatePresence>
        {isBranchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-left space-y-4">
              <h3 className="text-lg font-bold text-white">Add Branch Location</h3>
              <form onSubmit={handleAddBranch} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">Branch Name</label>
                  <input
                    required
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="Westlands Outlet"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300">Address / Location</label>
                  <input
                    required
                    type="text"
                    value={branchAddress}
                    onChange={(e) => setBranchAddress(e.target.value)}
                    placeholder="Sarit Centre, Westlands, Nairobi"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBranchModalOpen(false)}
                    className="flex-1 py-3 text-slate-400 font-bold border border-slate-700 rounded-2xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl text-xs hover:bg-blue-700"
                  >
                    Save Branch
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
