import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Download, Upload, Shield, Lock, Unlock, Key, RefreshCw, CheckCircle, Database } from 'lucide-react';

export const BackupSecurityManager: React.FC = () => {
  const { products, orders, customers, reviews, branches, offers, messages, settings, updateSettings, resetToDefaults } = useStore();

  const [adminEmail, setAdminEmail] = useState(settings.adminEmail || 'manager@decentcollection.co.ke');
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword || 'admin');
  const [maintenanceMsg, setMaintenanceMsg] = useState(settings.maintenanceMessage || 'Decent Collection is under scheduled inventory maintenance.');

  const handleDownloadBackup = () => {
    const fullBackup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      shopName: settings.shopName,
      settings,
      products,
      orders,
      customers,
      reviews,
      branches,
      offers,
      messages
    };

    const jsonStr = JSON.stringify(fullBackup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Decent_Collection_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings && parsed.products) {
          localStorage.setItem('decent_collection_store_v1', JSON.stringify(parsed));
          alert('Database restored successfully! Refreshing page to apply restored database...');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleToggleMaintenance = () => {
    const isMaintenance = !settings.isMaintenanceMode;
    updateSettings({ 
      isMaintenanceMode: isMaintenance,
      maintenanceMessage: maintenanceMsg 
    });
    alert(isMaintenance ? '⚠️ Website put into Maintenance Mode.' : '✅ Website is live and accessible to customers.');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      adminEmail,
      adminPassword
    });
    alert('Super Admin credentials updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#D4AF37]" />
          <span>Super Admin Security, Backups & System Locks</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Full executive authority over database backups, system access locks, maintenance mode, and admin security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Database Backups & Restore */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#2B2B2B] pb-3">
            <Database className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-bold text-white text-base font-heading">1. Database Backup & Restore</h3>
          </div>

          <p className="text-xs text-gray-400">
            Download a complete offline JSON snapshot of products, orders, customer details, and store settings, or restore from a previously saved file.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs uppercase rounded-lg shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Database Backup (.json)</span>
            </button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackup}
                className="hidden"
                id="backup-file-upload"
              />
              <label
                htmlFor="backup-file-upload"
                className="w-full py-3 bg-[#262626] hover:bg-[#333333] text-gray-200 font-bold text-xs uppercase rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-[#333333]"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload & Restore Database File</span>
              </label>
            </div>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all store data to factory initial defaults?')) {
                  resetToDefaults();
                  alert('Store reset to factory default state.');
                }
              }}
              className="w-full py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 text-xs font-semibold rounded-lg text-center"
            >
              Reset to Factory Demo Data
            </button>
          </div>
        </div>

        {/* 2. Storefront Maintenance Lock */}
        <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#2B2B2B] pb-3">
            {settings.isMaintenanceMode ? (
              <Lock className="w-5 h-5 text-red-400" />
            ) : (
              <Unlock className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="font-bold text-white text-base font-heading">2. Storefront Maintenance Lock</h3>
          </div>

          <p className="text-xs text-gray-400">
            Lock the public customer website during inventory counts or stock updates while preserving full admin access.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-300 font-bold block mb-1">Maintenance Notice Message</label>
              <textarea
                rows={2}
                value={maintenanceMsg}
                onChange={(e) => setMaintenanceMsg(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] text-white text-xs rounded-lg p-2.5 outline-none"
              />
            </div>

            <button
              onClick={handleToggleMaintenance}
              className={`w-full py-3 font-extrabold text-xs uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 ${
                settings.isMaintenanceMode
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {settings.isMaintenanceMode ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Disable Maintenance Mode (Unlock Site)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Enable Maintenance Mode (Lock Site)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Admin Security & Login Credentials */}
      <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#2B2B2B] pb-3">
          <Key className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-bold text-white text-base font-heading">3. Super Admin Password & Credentials</h3>
        </div>

        <form onSubmit={handleSaveSecurity} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-gray-300 font-semibold block mb-1">Manager / Admin Email</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-gray-300 font-semibold block mb-1">Super Admin Access Password</label>
            <input
              type="text"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none focus:border-[#D4AF37] font-mono"
            />
          </div>

          <div className="md:col-span-2 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs uppercase rounded-lg shadow-lg"
            >
              Update Admin Security Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
