import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Branch, AuditLog, Product, Customer, Order } from '../types';
import { 
  Store, Building, Plus, Edit, Trash2, Check, X, Shield, Eye, Copy, Archive, 
  RefreshCw, MapPin, Phone, Mail, Clock, Upload, CheckSquare, Square, Download, 
  Printer, ShieldAlert, Activity, FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const BranchAndDataManager: React.FC = () => {
  const { 
    branches, switchBranch, settings, updateSettings, 
    products, deleteProduct, updateProduct,
    customers, orders
  } = useStore();

  const [activeTab, setActiveTab] = useState<'branches' | 'data_management' | 'archived' | 'audit_log'>('branches');
  
  // Local state for branch list (so admin can add/edit/delete seamlessly)
  const [branchList, setBranchList] = useState<Branch[]>(branches);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Branch form
  const [branchForm, setBranchForm] = useState({
    name: '',
    address: '',
    city: 'Nairobi',
    phone: '+254 700 123 456',
    email: 'info@decent.co.ke',
    manager: 'Esta Njoki Mbugua',
    openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
    status: 'Open' as 'Open' | 'Closed' | 'Under Maintenance',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    isMainBranch: false
  });

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'LOG-1001',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      administratorName: settings.adminName || 'Esta Njoki Mbugua',
      action: 'Super Admin Login & Workspace Authentication',
      details: 'Managing Director session initialized'
    },
    {
      id: 'LOG-1002',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      administratorName: settings.adminName || 'Esta Njoki Mbugua',
      action: 'Branch Nairobi Flagship Store Activated',
      details: 'Set as primary retail headquarters'
    }
  ]);

  const addAuditEntry = (action: string, details?: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      administratorName: settings.adminName || 'Esta Njoki Mbugua',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Branch Image Upload
  const handleBranchImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setBranchForm(prev => ({ ...prev, imageUrl: evt.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save or Edit Branch
  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim()) return;

    if (editingBranch) {
      // Update existing
      const updated = branchList.map(b => b.id === editingBranch.id ? {
        ...b,
        name: branchForm.name,
        address: branchForm.address,
        city: branchForm.city,
        phone: branchForm.phone,
        email: branchForm.email,
        manager: branchForm.manager,
        openingHours: branchForm.openingHours,
        status: branchForm.status,
        imageUrl: branchForm.imageUrl,
        isMainBranch: branchForm.isMainBranch
      } : b);
      setBranchList(updated);
      addAuditEntry(`Branch Edited: ${branchForm.name}`, `Code: ${editingBranch.code}`);
      alert(`Branch "${branchForm.name}" updated successfully!`);
    } else {
      // Add new
      const newCode = `BR-${branchForm.city.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
      const newBranch: Branch = {
        id: `b_${Date.now()}`,
        name: branchForm.name,
        code: newCode,
        address: branchForm.address,
        city: branchForm.city,
        phone: branchForm.phone,
        email: branchForm.email,
        manager: branchForm.manager,
        openingHours: branchForm.openingHours,
        status: branchForm.status,
        imageUrl: branchForm.imageUrl,
        isMainBranch: branchForm.isMainBranch,
        active: false
      };
      setBranchList([newBranch, ...branchList]);
      addAuditEntry(`Branch Created: ${branchForm.name}`, `Code: ${newCode}`);
      alert(`New branch "${branchForm.name}" created with code ${newCode}!`);
    }

    setIsAddBranchOpen(false);
    setEditingBranch(null);
  };

  // Delete Branch with confirmation explanation
  const handleDeleteBranch = (branch: Branch) => {
    const confirmMsg = `Delete Branch "${branch.name}" (${branch.code})?\n\nDeleting this branch will remove its profile. All historical sales and financial records associated with this branch will remain safely stored for reports and compliance.\n\nAre you sure you want to proceed?`;
    if (confirm(confirmMsg)) {
      setBranchList(prev => prev.filter(b => b.id !== branch.id));
      addAuditEntry(`Branch Deleted: ${branch.name}`, `Code: ${branch.code}`);
      alert(`Branch "${branch.name}" deleted.`);
    }
  };

  // Toggle Branch Status
  const handleToggleBranchStatus = (branchId: string) => {
    setBranchList(prev => prev.map(b => {
      if (b.id === branchId) {
        const nextStatus = b.status === 'Open' ? 'Closed' : 'Open';
        addAuditEntry(`Branch Status Changed: ${b.name}`, `New status: ${nextStatus}`);
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  // Set Main Branch
  const handleSetMainBranch = (branchId: string) => {
    setBranchList(prev => prev.map(b => ({ ...b, isMainBranch: b.id === branchId })));
    switchBranch(branchId);
    const b = branchList.find(x => x.id === branchId);
    if (b) {
      addAuditEntry(`Main Branch Set: ${b.name}`);
      alert(`"${b.name}" is now set as the Main Branch for Decent Collection.`);
    }
  };

  // DATA MANAGEMENT STATES (Products, Customers, Orders, Payments, Inventory)
  const [dataCategory, setDataCategory] = useState<'products' | 'customers' | 'orders'>('products');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ id: string; name: string; type: string } | null>(null);

  // Selection toggle
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = (ids: string[]) => {
    if (selectedIds.length === ids.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ids);
    }
  };

  // Archive Item
  const handleArchiveItem = (p: Product) => {
    updateProduct(p.id, { archived: true });
    addAuditEntry(`Product Archived: ${p.name}`, `ID: ${p.id}`);
    alert(`Product "${p.name}" has been moved to Archive.`);
  };

  // Restore Item
  const handleRestoreItem = (p: Product) => {
    updateProduct(p.id, { archived: false });
    addAuditEntry(`Product Restored from Archive: ${p.name}`, `ID: ${p.id}`);
    alert(`Product "${p.name}" has been restored to live inventory.`);
  };

  // Delete Item with explicit prompt confirmation
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;

    if (deleteConfirmItem.type === 'product') {
      deleteProduct(deleteConfirmItem.id);
      addAuditEntry(`Product Deleted: ${deleteConfirmItem.name}`, `ID: ${deleteConfirmItem.id}`);
    }

    alert(`${deleteConfirmItem.type.toUpperCase()} "${deleteConfirmItem.name}" permanently deleted.`);
    setDeleteConfirmItem(null);
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Permanently delete ${selectedIds.length} selected item(s)? This action cannot be undone.`)) {
      selectedIds.forEach(id => {
        deleteProduct(id);
      });
      addAuditEntry(`Bulk Items Deleted`, `${selectedIds.length} records removed`);
      setSelectedIds([]);
      alert(`Selected records deleted.`);
    }
  };

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      updateProduct(id, { archived: true });
    });
    addAuditEntry(`Bulk Items Archived`, `${selectedIds.length} products archived`);
    setSelectedIds([]);
    alert(`Selected products archived.`);
  };

  const activeProducts = products.filter(p => !p.archived);
  const archivedProducts = products.filter(p => p.archived);

  return (
    <div className="space-y-6 font-sans text-white">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1A1810] via-[#2A2410] to-[#1A1810] border border-[#D4AF37]/50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-xl font-extrabold font-heading text-white tracking-wide">
              Branch Management & Full Data Control (Super Admin)
            </h2>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl">
            Authorized Super Administrator Portal • Complete control over store branches, record archives, bulk data operations, and automated audit activity logs.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#111111] px-4 py-2 rounded-xl border border-[#D4AF37]/40 shadow-inner">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-extrabold flex items-center justify-center text-xs">
            EA
          </div>
          <div>
            <div className="text-xs font-extrabold text-white">{settings.adminName || 'Esta Njoki Mbugua'}</div>
            <div className="text-[10px] text-[#D4AF37] font-bold uppercase">Super Administrator</div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-[#2A2A2A] gap-4 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('branches')}
          className={`pb-2.5 transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'branches' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>🏪 Branch Management ({branchList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('data_management')}
          className={`pb-2.5 transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'data_management' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>📂 Full Data Control & Records</span>
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`pb-2.5 transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'archived' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>🗃 Archived Records ({archivedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_log')}
          className={`pb-2.5 transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'audit_log' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>📋 Activity Log & Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* ------------------ TAB 1: BRANCH MANAGEMENT ------------------ */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#141414] border border-[#2B2B2B] rounded-2xl p-4">
            <div>
              <h3 className="font-extrabold text-white text-base font-heading">🏪 Store Branches & Locations</h3>
              <p className="text-xs text-gray-400">Manage all retail outlets, main headquarters, operating hours, and branch managers.</p>
            </div>
            <button
              onClick={() => {
                setEditingBranch(null);
                setBranchForm({
                  name: '',
                  address: '',
                  city: 'Nairobi',
                  phone: '+254 700 123 456',
                  email: 'info@decent.co.ke',
                  manager: 'Esta Njoki Mbugua',
                  openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
                  status: 'Open',
                  imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
                  isMainBranch: false
                });
                setIsAddBranchOpen(true);
              }}
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-xl flex items-center gap-2 uppercase tracking-wider shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Branch</span>
            </button>
          </div>

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branchList.map(branch => (
              <div 
                key={branch.id}
                className={`bg-[#141414] border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all ${
                  branch.isMainBranch ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]/50' : 'border-[#2B2B2B] hover:border-[#444]'
                }`}
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-black">
                    <img src={branch.imageUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop'} alt={branch.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {branch.isMainBranch && (
                        <span className="bg-[#D4AF37] text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow">
                          ⭐ Main Branch
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow ${
                        branch.status === 'Open' ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                      }`}>
                        {branch.status || 'Open'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-black/80 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                          {branch.code}
                        </span>
                        <h4 className="text-base font-extrabold text-white font-heading mt-1">{branch.name}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{branch.openingHours || 'Mon - Sat: 8am - 8pm'}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-[#D4AF37] font-semibold">
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span>Manager: {branch.manager}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#111111] border-t border-[#262626] flex flex-wrap gap-2 justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingBranch(branch);
                        setBranchForm({
                          name: branch.name,
                          address: branch.address,
                          city: branch.city || 'Nairobi',
                          phone: branch.phone,
                          email: branch.email || 'info@decent.co.ke',
                          manager: branch.manager,
                          openingHours: branch.openingHours || 'Mon - Sat: 8:00 AM - 8:00 PM',
                          status: branch.status || 'Open',
                          imageUrl: branch.imageUrl || '',
                          isMainBranch: branch.isMainBranch || false
                        });
                        setIsAddBranchOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#222] hover:bg-[#333] text-gray-200 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#D4AF37]" /> Edit
                    </button>

                    <button
                      onClick={() => handleToggleBranchStatus(branch.id)}
                      className="px-3 py-1.5 bg-[#222] hover:bg-[#333] text-gray-200 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Status
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {!branch.isMainBranch && (
                      <button
                        onClick={() => handleSetMainBranch(branch.id)}
                        className="px-3 py-1.5 bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/40 rounded-lg text-xs font-bold"
                      >
                        Set Main
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteBranch(branch)}
                      className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg"
                      title="Delete Branch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADD / EDIT BRANCH MODAL */}
          {isAddBranchOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#141414] border border-[#D4AF37] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
                  <h3 className="font-extrabold text-white text-base font-heading">
                    {editingBranch ? `✏ Edit Branch (${editingBranch.code})` : '➕ Add New Store Branch'}
                  </h3>
                  <button onClick={() => setIsAddBranchOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveBranch} className="space-y-3 text-xs">
                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Branch Name *</label>
                    <input
                      type="text"
                      required
                      value={branchForm.name}
                      onChange={(e) => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Kilimani Luxury Outlet"
                      className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">County / City *</label>
                      <input
                        type="text"
                        required
                        value={branchForm.city}
                        onChange={(e) => setBranchForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Status</label>
                      <select
                        value={branchForm.status}
                        onChange={(e) => setBranchForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Physical Address *</label>
                    <input
                      type="text"
                      required
                      value={branchForm.address}
                      onChange={(e) => setBranchForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="e.g., Yaya Centre 2nd Floor, Argwings Kodhek Rd"
                      className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Phone Contact *</label>
                      <input
                        type="text"
                        required
                        value={branchForm.phone}
                        onChange={(e) => setBranchForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 block mb-1 font-semibold">Branch Manager *</label>
                      <input
                        type="text"
                        required
                        value={branchForm.manager}
                        onChange={(e) => setBranchForm(prev => ({ ...prev, manager: e.target.value }))}
                        className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Opening Hours</label>
                    <input
                      type="text"
                      value={branchForm.openingHours}
                      onChange={(e) => setBranchForm(prev => ({ ...prev, openingHours: e.target.value }))}
                      placeholder="e.g., Mon - Sat: 8:00 AM - 8:00 PM"
                      className="w-full bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1 font-semibold">Branch Image URL or Choose File</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={branchForm.imageUrl}
                        onChange={(e) => setBranchForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="flex-1 bg-[#1A1A1A] border border-[#333333] text-white rounded-xl p-2.5 outline-none"
                      />
                      <label className="px-3 py-2.5 bg-[#222] hover:bg-[#333] rounded-xl cursor-pointer flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        <input type="file" accept="image/*" onChange={handleBranchImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="mainBranchCheck"
                      checked={branchForm.isMainBranch}
                      onChange={(e) => setBranchForm(prev => ({ ...prev, isMainBranch: e.target.checked }))}
                      className="rounded accent-[#D4AF37]"
                    />
                    <label htmlFor="mainBranchCheck" className="text-xs text-[#D4AF37] font-bold cursor-pointer">
                      ⭐ Set as Main Branch Headquarters
                    </label>
                  </div>

                  <div className="pt-4 border-t border-[#2A2A2A] flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsAddBranchOpen(false)}
                      className="px-4 py-2 bg-[#222] text-gray-300 rounded-xl hover:bg-[#333]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#D4AF37] text-black font-extrabold rounded-xl uppercase tracking-wider"
                    >
                      Save Branch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------ TAB 2: FULL DATA CONTROL (SUPER ADMIN) ------------------ */}
      {activeTab === 'data_management' && (
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="font-extrabold text-white text-base font-heading">📂 Data Records & Full Operations</h3>
              <p className="text-xs text-gray-400">View, Edit, Duplicate, Archive, or Delete individual records with Super Admin permissions.</p>
            </div>

            {/* Bulk Action Controls */}
            <div className="flex gap-2">
              <button
                disabled={selectedIds.length === 0}
                onClick={handleBulkArchive}
                className="px-3 py-1.5 bg-[#222] hover:bg-[#333] text-[#D4AF37] disabled:opacity-40 rounded-xl text-xs font-bold flex items-center gap-1 border border-[#333]"
              >
                <Archive className="w-3.5 h-3.5" /> Archive ({selectedIds.length})
              </button>
              <button
                disabled={selectedIds.length === 0}
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 disabled:opacity-40 rounded-xl text-xs font-bold flex items-center gap-1 border border-red-500/30"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.length})
              </button>
            </div>
          </div>

          <div className="flex gap-2 border-b border-[#2A2A2A] pb-2 text-xs font-bold">
            <button
              onClick={() => { setDataCategory('products'); setSelectedIds([]); }}
              className={`px-4 py-1.5 rounded-lg ${dataCategory === 'products' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Products ({activeProducts.length})
            </button>
            <button
              onClick={() => { setDataCategory('customers'); setSelectedIds([]); }}
              className={`px-4 py-1.5 rounded-lg ${dataCategory === 'customers' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Customers ({customers.length})
            </button>
            <button
              onClick={() => { setDataCategory('orders'); setSelectedIds([]); }}
              className={`px-4 py-1.5 rounded-lg ${dataCategory === 'orders' ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Orders ({orders.length})
            </button>
          </div>

          {/* Products Table */}
          {dataCategory === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1C1C1C] text-gray-400 uppercase text-[10px] font-bold border-b border-[#2A2A2A]">
                  <tr>
                    <th className="py-3 px-3">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length === activeProducts.length && activeProducts.length > 0} 
                        onChange={() => toggleSelectAll(activeProducts.map(p => p.id))}
                        className="rounded accent-[#D4AF37]" 
                      />
                    </th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">Buying Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {activeProducts.map(p => (
                    <tr key={p.id} className="hover:bg-[#1A1A1A]">
                      <td className="py-3 px-3">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(p.id)} 
                          onChange={() => toggleSelect(p.id)}
                          className="rounded accent-[#D4AF37]" 
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#333]" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">KSh {p.price.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-gray-400">KSh {(p.costPrice || Math.round(p.price * 0.55)).toLocaleString()}</td>
                      <td className="py-3 px-4 font-semibold text-gray-200">{p.stock} units</td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => handleArchiveItem(p)}
                          className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-[#D4AF37] rounded-lg text-[11px] font-bold flex items-center gap-1"
                        >
                          <Archive className="w-3 h-3" /> Archive
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmItem({ id: p.id, name: p.name, type: 'product' })}
                          className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customers Table */}
          {dataCategory === 'customers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1C1C1C] text-gray-400 uppercase text-[10px] font-bold border-b border-[#2A2A2A]">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-[#1A1A1A]">
                      <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                      <td className="py-3 px-4 text-gray-300">{c.phone}</td>
                      <td className="py-3 px-4 font-semibold text-blue-400">{c.totalOrders} Orders</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">KSh {c.totalSpent.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-400">{c.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders Table */}
          {dataCategory === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1C1C1C] text-gray-400 uppercase text-[10px] font-bold border-b border-[#2A2A2A]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-[#1A1A1A]">
                      <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">{o.id}</td>
                      <td className="py-3 px-4 text-white font-semibold">{o.customerName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">KSh {o.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 uppercase font-bold text-gray-300">{o.paymentMethod}</td>
                      <td className="py-3 px-4 uppercase font-bold text-xs text-blue-400">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------ TAB 3: ARCHIVED RECORDS ------------------ */}
      {activeTab === 'archived' && (
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="font-extrabold text-white text-base font-heading">🗃 Archived Business Records</h3>
            <p className="text-xs text-gray-400">Archived items are hidden from active inventory but preserved for historical revenue reports and can be restored anytime.</p>
          </div>

          {archivedProducts.length === 0 ? (
            <div className="p-8 text-center bg-[#1A1A1A] rounded-xl text-gray-400 text-xs">
              No records in archive. You can archive products from the Data Control tab.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1C1C1C] text-gray-400 uppercase text-[10px] font-bold border-b border-[#2A2A2A]">
                  <tr>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {archivedProducts.map(p => (
                    <tr key={p.id} className="hover:bg-[#1A1A1A]">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#333]" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-4 uppercase text-gray-400">{p.category}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">KSh {p.price.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRestoreItem(p)}
                          className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold rounded-lg text-xs"
                        >
                          Restore Item
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------ TAB 4: ACTIVITY LOG & AUDIT TRAIL ------------------ */}
      {activeTab === 'audit_log' && (
        <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base font-heading">📋 Security & Activity Log (Audit Trail)</h3>
              <p className="text-xs text-gray-400">Every major administrative action is timestamped and locked for security compliance.</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              Audit Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#1C1C1C] text-gray-400 uppercase text-[10px] font-bold border-b border-[#2A2A2A]">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#1A1A1A]">
                    <td className="py-3 px-4 font-mono text-[#D4AF37] font-bold">{log.id}</td>
                    <td className="py-3 px-4 text-gray-400">{log.date} {log.time}</td>
                    <td className="py-3 px-4 font-bold text-white">{log.administratorName}</td>
                    <td className="py-3 px-4 font-semibold text-gray-200">{log.action}</td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{log.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Required by User Prompt) */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-red-500 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center gap-3 text-red-500 border-b border-[#2A2A2A] pb-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-extrabold text-white text-lg font-heading">
                Delete {deleteConfirmItem.type.toUpperCase()}?
              </h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              You are about to permanently delete <strong className="text-white">"{deleteConfirmItem.name}"</strong>.
              <br /><br />
              <span className="text-red-400 font-bold">This action cannot be undone.</span>
            </p>

            <div className="pt-4 flex justify-end gap-3 border-t border-[#2A2A2A]">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-5 py-2.5 bg-[#2B2B2B] hover:bg-[#383838] text-white rounded-xl text-xs font-bold"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold shadow-lg uppercase tracking-wider"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
