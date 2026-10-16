import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Crown, Mail, MessageSquare, Send, Sparkles, CheckCircle2, Clock, 
  FileText, Paperclip, Users, Settings, History, AlertCircle, Eye, 
  Plus, Trash2, Check, X, Shield, Phone, ArrowRight, Zap, RefreshCw
} from 'lucide-react';
import { VIPRuleSettings } from '../types';

export const VIPCustomersManager: React.FC = () => {
  const { 
    customers, settings, emailTemplates, notificationHistory, 
    subscribeVIPClub, approveVIPRecommendation, declineVIPRecommendation, 
    sendVIPNotificationMultiChannel, saveVIPRules, grantVipStatus, removeVipStatus 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'members' | 'compose' | 'recommendations' | 'templates' | 'history' | 'rules'>('members');

  // VIP Members Search
  const [memberSearch, setMemberSearch] = useState('');
  const vipMembers = customers.filter(c => c.isVip);
  const filteredMembers = vipMembers.filter(m => {
    const q = memberSearch.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      (m.vipCode && m.vipCode.toLowerCase().includes(q))
    );
  });

  // Compose State
  const [recipientType, setRecipientType] = useState<'all' | 'selected' | 'single'>('all');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [channel, setChannel] = useState<'email' | 'whatsapp' | 'both'>('both');
  const [subject, setSubject] = useState('⭐ Exclusive VIP Announcement - Decent Collection');
  const [messageBody, setMessageBody] = useState(
    'Hello {{Customer Name}},\n\nAs a valued VIP Member of Decent Collection, we are thrilled to invite you for early access to our newly arrived Italian Handmade Oxfords and Executive Bespoke Suits.\n\nEnjoy an exclusive 15% VIP discount on your next order.\n\nKind regards,\nEsther Njoki Mbugua\nSuper Administrator\nDecent Collection'
  );
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [composeStatusMsg, setComposeStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // VIP Rules Form State
  const [ruleMonths, setRuleMonths] = useState<number>(settings.vipRules?.minMonthsAsCustomer || 1);
  const [ruleOrders, setRuleOrders] = useState<number>(settings.vipRules?.minOrdersCount || 2);
  const [ruleSpent, setRuleSpent] = useState<number>(settings.vipRules?.minTotalSpent || 15000);
  const [ruleAutoApprove, setRuleAutoApprove] = useState<boolean>(settings.vipRules?.autoApprove || false);
  const [ruleAutoEmail, setRuleAutoEmail] = useState<boolean>(settings.vipRules?.autoSendWelcomeEmail !== false);
  const [ruleAutoWA, setRuleAutoWA] = useState<boolean>(settings.vipRules?.autoSendWelcomeWhatsApp !== false);
  const [ruleSaveMsg, setRuleSaveMsg] = useState('');

  // Recommendation Candidates
  const minSpentThreshold = ruleSpent;
  const minOrdersThreshold = ruleOrders;

  const candidateCustomers = customers.filter(c => {
    if (c.isVip) return false;
    if (c.vipRecommendationStatus === 'declined') return false;
    return c.totalSpent >= minSpentThreshold || c.totalOrders >= minOrdersThreshold;
  });

  // Handlers
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = emailTemplates.find(t => t.id === templateId);
    if (tmpl) {
      setSubject(tmpl.subject);
      setMessageBody(tmpl.body);
    }
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    setComposeStatusMsg(null);

    if (!messageBody.trim()) {
      setComposeStatusMsg({ type: 'error', text: 'Please write a message payload.' });
      return;
    }

    sendVIPNotificationMultiChannel({
      recipients: recipientType,
      selectedEmails,
      channel,
      subject,
      message: messageBody,
      attachments,
      templateName: selectedTemplate ? emailTemplates.find(t => t.id === selectedTemplate)?.name : undefined
    });

    setComposeStatusMsg({ 
      type: 'success', 
      text: `🎉 VIP Message successfully dispatched via ${channel.toUpperCase()} to ${recipientType === 'all' ? vipMembers.length : selectedEmails.length} member(s)!` 
    });

    setShowPreviewModal(false);
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    saveVIPRules({
      minMonthsAsCustomer: Number(ruleMonths),
      minOrdersCount: Number(ruleOrders),
      minTotalSpent: Number(ruleSpent),
      autoApprove: ruleAutoApprove,
      autoSendWelcomeEmail: ruleAutoEmail,
      autoSendWelcomeWhatsApp: ruleAutoWA
    });
    setRuleSaveMsg('✅ VIP Loyalty Rules updated successfully!');
    setTimeout(() => setRuleSaveMsg(''), 3000);
  };

  return (
    <div className="space-y-6 text-white">
      
      {/* Header Banner */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" />
              Executive VIP Notification & Loyalty Suite
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
            VIP Club & Notification Center
          </h1>
          <p className="text-xs text-gray-400">
            Super Administrator: <strong>Esther Njoki Mbugua</strong> • Connected Business Gmail & WhatsApp
          </p>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-1 bg-[#09090B] p-1.5 rounded-xl border border-[#27272A]">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'members' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            VIP Members ({vipMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'compose' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Compose
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'recommendations' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Recommendations
            {candidateCustomers.length > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {candidateCustomers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'templates' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Templates
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Logs
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rules' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Rules
          </button>
        </div>
      </div>

      {/* TAB 1: VIP MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#18181B] border border-[#27272A] p-4 rounded-2xl">
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search VIP members by name, email, code, phone..."
              className="bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white text-xs rounded-xl px-3 py-2 w-72 outline-none"
            />
            <span className="text-xs text-gray-400">Total VIP Patrons: <strong className="text-[#D4AF37]">{vipMembers.length}</strong></span>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#09090B] text-[10px] uppercase font-bold text-gray-400 border-b border-[#27272A] tracking-wider">
                  <tr>
                    <th className="p-4">VIP Member</th>
                    <th className="p-4">VIP Code</th>
                    <th className="p-4">Phone Number</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                        No VIP members found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map(m => (
                      <tr key={m.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold flex items-center justify-center text-xs shrink-0">
                              <Crown className="w-4 h-4 text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{m.name}</p>
                              <p className="text-[10px] text-gray-400">{m.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                            {m.vipCode || 'VIP-000001'}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-xs">{m.phone}</td>
                        <td className="p-4 text-xs">{m.vipJoinedDate || m.joinedDate}</td>
                        <td className="p-4 font-bold text-[#D4AF37]">KSh {m.totalSpent.toLocaleString()}</td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedEmails([m.email]);
                                setRecipientType('selected');
                                setActiveTab('compose');
                              }}
                              className="px-2.5 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-[10px] rounded-lg transition-all"
                            >
                              Message VIP
                            </button>
                            <button
                              onClick={() => removeVipStatus(m.id)}
                              className="p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px]"
                              title="Revoke VIP"
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPOSE VIP NOTIFICATION */}
      {activeTab === 'compose' && (
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-heading">📧 Compose VIP Broadcast / Direct Message</h3>
              <p className="text-xs text-gray-400">Send professional emails & WhatsApp alerts to your VIP members.</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                <Mail className="w-3.5 h-3.5" />
                Gmail Connected
              </span>
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                <Phone className="w-3.5 h-3.5" />
                WhatsApp Connected (+254729445172)
              </span>
            </div>
          </div>

          {composeStatusMsg && (
            <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
              composeStatusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{composeStatusMsg.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); setShowPreviewModal(true); }} className="space-y-4">
            
            {/* Delivery Channel Picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Delivery Channel *</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    channel === 'email' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#09090B] text-gray-400 border-[#27272A]'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Only (Gmail)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    channel === 'whatsapp' ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-[#09090B] text-gray-400 border-[#27272A]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Only</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('both')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    channel === 'both' ? 'bg-gradient-to-r from-[#D4AF37] to-emerald-500 text-black border-none font-extrabold' : 'bg-[#09090B] text-gray-400 border-[#27272A]'
                  }`}
                >
                  <Zap className="w-4 h-4 text-black" />
                  <span>Both (Email + WhatsApp)</span>
                </button>
              </div>
            </div>

            {/* Recipient Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Target VIP Audience *</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value as any)}
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white rounded-xl px-3 py-2.5 text-xs outline-none"
                >
                  <option value="all">All VIP Members ({vipMembers.length})</option>
                  <option value="selected">Selected Members Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Prebuilt Message Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white rounded-xl px-3 py-2.5 text-xs outline-none"
                >
                  <option value="">-- Choose Template (Optional) --</option>
                  {emailTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Line (if Email) */}
            {(channel === 'email' || channel === 'both') && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Subject Line *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line..."
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white rounded-xl px-3 py-2.5 text-xs outline-none"
                />
              </div>
            )}

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-300">Message Payload *</label>
                <span className="text-[10px] text-gray-500">Insert tag: <code className="bg-black/50 px-1 text-[#D4AF37]">{`{{Customer Name}}`}</code></span>
              </div>
              <textarea
                rows={6}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] text-white rounded-xl p-3 text-xs outline-none font-sans leading-relaxed"
              />
            </div>

            {/* Submit & Preview Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2.5 bg-[#27272A] hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-[#D4AF37]" />
                Preview Broadcast
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B38F29] text-black font-extrabold text-xs rounded-xl hover:opacity-95 transition-all shadow-lg flex items-center gap-2 uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                Dispatch VIP Message
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl space-y-2">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              Automatic VIP Recommendation & Loyalty Engine
            </h3>
            <p className="text-xs text-gray-400">
              The algorithm evaluates customer purchase frequency, total spent, and duration.
              Active threshold: <strong>Spent &ge; KSh {minSpentThreshold.toLocaleString()}</strong> OR <strong>Orders &ge; {minOrdersThreshold}</strong>.
            </p>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#27272A] bg-[#09090B] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Eligible Candidate Customers ({candidateCustomers.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#09090B] text-[10px] uppercase font-bold text-gray-400 border-b border-[#27272A] tracking-wider">
                  <tr>
                    <th className="p-4">Customer Candidate</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4">Orders Count</th>
                    <th className="p-4">Eligibility Status</th>
                    <th className="p-4 text-right">Super Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {candidateCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                        No candidate customers currently meet the VIP upgrade threshold.
                      </td>
                    </tr>
                  ) : (
                    candidateCustomers.map(c => (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white text-xs">{c.name}</p>
                          <p className="text-[10px] text-gray-400">{c.email} • {c.phone}</p>
                        </td>

                        <td className="p-4 font-bold text-[#D4AF37]">
                          KSh {c.totalSpent.toLocaleString()}
                        </td>

                        <td className="p-4 font-bold text-white font-mono">
                          {c.totalOrders} order(s)
                        </td>

                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] px-2.5 py-1 rounded-full font-bold">
                            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                            Eligible for VIP
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => approveVIPRecommendation(c.id)}
                              className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-[11px] rounded-lg transition-all shadow-sm flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              ⭐ Approve VIP Upgrade
                            </button>

                            <button
                              onClick={() => declineVIPRecommendation(c.id)}
                              className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emailTemplates.map(t => (
            <div key={t.id} className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#27272A] pb-2">
                <h4 className="font-bold text-sm text-white font-heading">{t.name}</h4>
                <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded font-mono font-bold">
                  {t.category}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#D4AF37]">{t.subject}</p>
              <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                {t.body}
              </div>
              <button
                onClick={() => {
                  handleTemplateSelect(t.id);
                  setActiveTab('compose');
                }}
                className="w-full py-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs rounded-xl transition-all"
              >
                Use Template in Broadcaster
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: HISTORY LOGS */}
      {activeTab === 'history' && (
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#27272A] bg-[#09090B] flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Notification Delivery Audit Log ({notificationHistory.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#09090B] text-[10px] uppercase font-bold text-gray-400 border-b border-[#27272A] tracking-wider">
                <tr>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Subject / Context</th>
                  <th className="p-4">Sent Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Sender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {notificationHistory.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-xs">{log.recipientName}</p>
                      <p className="text-[10px] text-gray-400">{log.recipientEmail}</p>
                    </td>

                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        log.channel === 'whatsapp' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        log.channel === 'both' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' :
                        'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                      }`}>
                        {log.channel}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs truncate">
                      <p className="font-semibold text-white">{log.subject || 'Notification'}</p>
                      <p className="text-[10px] text-gray-500 truncate">{log.message}</p>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-gray-400">{log.sentDate}</td>

                    <td className="p-4">
                      <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Delivered
                      </span>
                    </td>

                    <td className="p-4 text-[10px] text-gray-400">{log.sentBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: RULES & SETTINGS */}
      {activeTab === 'rules' && (
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-xl max-w-2xl space-y-6">
          <div className="border-b border-[#27272A] pb-3">
            <h3 className="text-base font-bold text-white font-heading">⚙ VIP Loyalty Eligibility Rules Settings</h3>
            <p className="text-xs text-gray-400">Configure parameters for automatic VIP recommendation triggers.</p>
          </div>

          {ruleSaveMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{ruleSaveMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-semibold text-gray-300 mb-1">Minimum Customer Duration (Months)</label>
              <input
                type="number"
                value={ruleMonths}
                onChange={(e) => setRuleMonths(Number(e.target.value))}
                className="w-full bg-[#09090B] border border-[#27272A] text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Minimum Number of Completed Orders</label>
              <input
                type="number"
                value={ruleOrders}
                onChange={(e) => setRuleOrders(Number(e.target.value))}
                className="w-full bg-[#09090B] border border-[#27272A] text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-300 mb-1">Minimum Total Spent (KSh)</label>
              <input
                type="number"
                value={ruleSpent}
                onChange={(e) => setRuleSpent(Number(e.target.value))}
                className="w-full bg-[#09090B] border border-[#27272A] text-white rounded-xl p-2.5 outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-[#27272A]">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rule-auto-appr"
                  checked={ruleAutoApprove}
                  onChange={(e) => setRuleAutoApprove(e.target.checked)}
                  className="rounded bg-[#09090B] border-[#27272A] text-[#D4AF37]"
                />
                <label htmlFor="rule-auto-appr" className="text-gray-300 cursor-pointer">
                  Auto-approve candidates when eligibility threshold is reached
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rule-auto-email"
                  checked={ruleAutoEmail}
                  onChange={(e) => setRuleAutoEmail(e.target.checked)}
                  className="rounded bg-[#09090B] border-[#27272A] text-[#D4AF37]"
                />
                <label htmlFor="rule-auto-email" className="text-gray-300 cursor-pointer">
                  Automatically dispatch VIP Welcome Email upon approval
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rule-auto-wa"
                  checked={ruleAutoWA}
                  onChange={(e) => setRuleAutoWA(e.target.checked)}
                  className="rounded bg-[#09090B] border-[#27272A] text-[#D4AF37]"
                />
                <label htmlFor="rule-auto-wa" className="text-gray-300 cursor-pointer">
                  Automatically dispatch VIP Welcome WhatsApp message upon approval
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-xl shadow-lg"
            >
              Save VIP Rule Settings
            </button>
          </form>
        </div>
      )}

      {/* PREVIEW BROADCAST MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18181B] border border-[#27272A] rounded-2xl w-full max-w-lg p-6 space-y-4 text-white shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <h3 className="font-bold text-sm font-heading">Broadcast Message Preview</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#09090B] p-2.5 rounded-xl border border-[#27272A]">
                <span className="text-gray-500 block text-[10px]">Recipient Audience</span>
                <span className="font-bold text-white capitalize">{recipientType} VIP Members</span>
              </div>

              <div className="bg-[#09090B] p-2.5 rounded-xl border border-[#27272A]">
                <span className="text-gray-500 block text-[10px]">Subject</span>
                <span className="font-bold text-[#D4AF37]">{subject}</span>
              </div>

              <div className="bg-[#09090B] p-3 rounded-xl border border-[#27272A] leading-relaxed whitespace-pre-wrap max-h-52 overflow-y-auto">
                {messageBody.replace(/{{Customer Name}}/g, 'Sample VIP Customer')}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#27272A]">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-[#27272A] hover:bg-white/10 text-white font-bold text-xs rounded-xl"
              >
                Edit Message
              </button>
              <button
                onClick={handleSendNotification}
                className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold text-xs rounded-xl shadow-md"
              >
                Confirm & Dispatch Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
