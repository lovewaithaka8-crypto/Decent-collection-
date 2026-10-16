import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Users, Search, CheckCircle, Clock, ShieldCheck, Mail, Phone, 
  Eye, Trash2, Crown, Sparkles, Filter, RefreshCw, KeyRound, AlertCircle, X
} from 'lucide-react';
import { Customer } from '../types';

export const CustomerAdminView: React.FC = () => {
  const { 
    customers, resendCustomerOTP, manuallyVerifyCustomer, deleteCustomer, 
    grantVipStatus, removeVipStatus, orders 
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'pending'>('all');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase().trim();
    const matchesSearch = (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.id.toLowerCase().includes(q)
    );

    if (filterVerified === 'verified') return matchesSearch && c.emailVerified;
    if (filterVerified === 'pending') return matchesSearch && !c.emailVerified;
    return matchesSearch;
  });

  const handleResend = (cust: Customer) => {
    const res = resendCustomerOTP(cust.email);
    if (res.success) {
      setActionMsg({ type: 'success', text: `Sent new verification OTP code (${res.otpCode}) to ${cust.email}` });
    } else {
      setActionMsg({ type: 'error', text: res.message });
    }
  };

  const handleManualVerify = (cust: Customer) => {
    manuallyVerifyCustomer(cust.id);
    setActionMsg({ type: 'success', text: `Super Admin Esther manually verified ${cust.name}'s email address.` });
  };

  const handleDelete = (cust: Customer) => {
    if (window.confirm(`Are you sure you want to delete customer ${cust.name}? This action cannot be undone.`)) {
      deleteCustomer(cust.id);
      setActionMsg({ type: 'success', text: `Deleted customer record for ${cust.name}.` });
      if (selectedCust?.id === cust.id) setSelectedCust(null);
    }
  };

  const customerOrders = selectedCust ? orders.filter(o => o.email.toLowerCase() === selectedCust.email.toLowerCase() || o.customerPhone === selectedCust.phone) : [];

  return (
    <div className="space-y-6 text-white">
      
      {/* Top Banner */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Customer Management Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-white">Registered Customers</h1>
          <p className="text-xs text-gray-400">View email verification status, grant VIP status, and resend security codes.</p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-[#09090B] border border-[#27272A] px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-gray-400 block font-semibold">Total Accounts</span>
            <span className="text-sm font-extrabold text-white font-mono">{customers.length}</span>
          </div>
          <div className="bg-[#09090B] border border-emerald-500/20 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-emerald-400 block font-semibold">Verified</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              {customers.filter(c => c.emailVerified).length}
            </span>
          </div>
          <div className="bg-[#09090B] border border-amber-500/20 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-amber-400 block font-semibold">Pending OTP</span>
            <span className="text-sm font-extrabold text-amber-400 font-mono">
              {customers.filter(c => !c.emailVerified).length}
            </span>
          </div>
        </div>
      </div>

      {/* Action Notice */}
      {actionMsg && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          actionMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
          <button onClick={() => setActionMsg(null)} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#18181B] border border-[#27272A] p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, ID..."
            className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white text-xs rounded-xl pl-9 pr-3 py-2 outline-none"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilterVerified('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterVerified === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#09090B] text-gray-400 hover:text-white'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setFilterVerified('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterVerified === 'verified' ? 'bg-emerald-500 text-black' : 'bg-[#09090B] text-gray-400 hover:text-white'
            }`}
          >
            Verified ({customers.filter(c => c.emailVerified).length})
          </button>
          <button
            onClick={() => setFilterVerified('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterVerified === 'pending' ? 'bg-amber-500 text-black' : 'bg-[#09090B] text-gray-400 hover:text-white'
            }`}
          >
            Pending OTP ({customers.filter(c => !c.emailVerified).length})
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#09090B] text-[10px] uppercase font-bold text-gray-400 border-b border-[#27272A] tracking-wider">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Email Verification</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">VIP Status</th>
                <th className="p-4">Orders / Spent</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#27272A] border border-white/10 text-[#D4AF37] font-bold flex items-center justify-center text-xs shrink-0">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs flex items-center gap-1.5">
                          {cust.name}
                          {cust.isVip && (
                            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" title="VIP Member" />
                          )}
                        </p>
                        <p className="text-[10px] text-gray-400">{cust.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {cust.emailVerified ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] px-2.5 py-1 rounded-full font-bold">
                          <Clock className="w-3 h-3" />
                          Pending Verification
                        </span>
                        {cust.verificationCode && (
                          <p className="text-[9px] text-gray-500 font-mono">Code: {cust.verificationCode}</p>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-mono text-xs">{cust.phone}</td>

                  <td className="p-4">
                    {cust.isVip ? (
                      <span className="bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        VIP ({cust.vipCode || 'Active'})
                      </span>
                    ) : (
                      <span className="text-gray-500 text-[10px]">Standard</span>
                    )}
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-white">{cust.totalOrders} order(s)</p>
                    <p className="text-[10px] text-[#D4AF37] font-semibold">KSh {cust.totalSpent.toLocaleString()}</p>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCust(cust)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {!cust.emailVerified && (
                        <>
                          <button
                            onClick={() => handleResend(cust)}
                            className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400"
                            title="Resend OTP Verification Email"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleManualVerify(cust)}
                            className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400"
                            title="Super Admin Manual Email Verification Override"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {cust.isVip ? (
                        <button
                          onClick={() => removeVipStatus(cust.id)}
                          className="p-1.5 rounded-lg bg-gray-500/15 hover:bg-gray-500/25 text-gray-400"
                          title="Remove VIP Status"
                        >
                          <Crown className="w-4 h-4 text-gray-500" />
                        </button>
                      ) : (
                        <button
                          onClick={() => grantVipStatus(cust.id, 'Granted by Super Admin Esther')}
                          className="p-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37]"
                          title="Grant VIP Status"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(cust)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete Customer Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Customer Details Modal */}
      {selectedCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl w-full max-w-xl p-6 space-y-5 text-white shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold text-sm flex items-center justify-center">
                  {selectedCust.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">{selectedCust.name}</h3>
                  <p className="text-xs text-gray-400">Customer ID: {selectedCust.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCust(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
                <span className="text-[10px] text-gray-500 block">Email Address</span>
                <span className="font-bold text-white">{selectedCust.email}</span>
              </div>
              <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
                <span className="text-[10px] text-gray-500 block">Phone Number</span>
                <span className="font-bold text-white font-mono">{selectedCust.phone}</span>
              </div>
              <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
                <span className="text-[10px] text-gray-500 block">Verification Status</span>
                <span className={`font-bold ${selectedCust.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedCust.emailVerified ? 'Verified' : 'Pending OTP Verification'}
                </span>
              </div>
              <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A]">
                <span className="text-[10px] text-gray-500 block">VIP Membership</span>
                <span className="font-bold text-[#D4AF37]">
                  {selectedCust.isVip ? `VIP (${selectedCust.vipCode || 'Active'})` : 'Standard Customer'}
                </span>
              </div>
            </div>

            {/* Order History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Order History ({customerOrders.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {customerOrders.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-2">No orders recorded for this customer yet.</p>
                ) : (
                  customerOrders.map(o => (
                    <div key={o.id} className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-white">{o.id}</span>
                        <span className="text-[10px] text-gray-400 block">{o.date}</span>
                      </div>
                      <span className="font-bold text-[#D4AF37]">KSh {o.total.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#27272A] flex justify-end">
              <button
                onClick={() => setSelectedCust(null)}
                className="px-4 py-2 bg-[#27272A] hover:bg-white/10 text-white font-bold text-xs rounded-xl"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
