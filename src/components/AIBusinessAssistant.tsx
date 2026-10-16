import React, { useState, useRef, useEffect } from 'react';
import { useStore, AdminTab } from '../context/StoreContext';
import { 
  filterDataByDateRange, 
  generateExcelSalesReport, 
  generateWordBusinessReport 
} from '../services/reportGenerator';
import { 
  Bot, Sparkles, Send, X, Minimize2, Maximize2, Trash2, 
  FileSpreadsheet, FileText, ShoppingCart, DollarSign, Package, 
  AlertTriangle, Users, Store, ArrowRight, RefreshCw, ChevronDown, Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: {
    type: 'open_tab' | 'generate_excel' | 'generate_word';
    label: string;
    targetTab?: AdminTab;
  }[];
}

export const AIBusinessAssistant: React.FC = () => {
  const { 
    products, orders, customers, branches, settings, 
    activeAdminTab, setActiveAdminTab 
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const adminName = settings.adminName || 'Esther Njoki Mbugua';

  // Default welcome message
  const initialMessages: ChatMessage[] = [
    {
      id: 'welcome_1',
      role: 'assistant',
      text: `Hello Esther! Welcome back to your Executive Control Center. I am your AI Business Assistant.

I have real-time live access to all Decent Collection data:
• 💰 **Sales & Profits**: Gross revenue, buying costs (COGS), net profit margins
• 📦 **Stock & Inventory**: Real-time stock counts and low-inventory warnings
• 🏪 **Branch Operations**: Nairobi Flagship, Westlands, and Mombasa performance
• 👥 **Customer Insights**: Top buyers and customer spending trends

How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { type: 'open_tab', label: '📊 View Cost & Profit', targetTab: 'costing' },
        { type: 'generate_excel', label: '📥 Export Excel Report' },
        { type: 'generate_word', label: '📄 Export Word Summary' }
      ]
    }
  ];

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isMinimized]);

  // Compute Live Business Summary Context
  const getLiveContext = () => {
    const reportData = filterDataByDateRange(orders, products, 'this_month');
    
    // Low stock items
    const lowStock = products
      .filter(p => p.stock <= p.lowStockThreshold)
      .map(p => ({ name: p.name, stock: p.stock, category: p.category }));

    // Top Selling Products
    const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!productSalesMap[i.product.id]) {
          productSalesMap[i.product.id] = { name: i.product.name, qty: 0, revenue: 0 };
        }
        productSalesMap[i.product.id].qty += i.quantity;
        productSalesMap[i.product.id].revenue += i.quantity * i.product.price;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top Customers
    const topCustomers = [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
      .map(c => ({ name: c.name, phone: c.phone, totalSpent: c.totalSpent, totalOrders: c.totalOrders }));

    // Branch Summary
    const branchSummary = branches.map(b => {
      const branchProducts = products.filter(p => p.branchId === b.id || (!p.branchId && b.id === 'br_nairobi'));
      return {
        name: b.name,
        code: b.code,
        productsCount: branchProducts.length,
        stockUnits: branchProducts.reduce((sum, p) => sum + p.stock, 0)
      };
    });

    return {
      adminName,
      shopName: settings.shopName,
      currency: settings.currency || 'KSh',
      datePeriod: reportData.dateLabel,
      financials: {
        totalSales: reportData.totalSales,
        totalCost: reportData.totalCost,
        totalProfit: reportData.totalProfit,
        profitMarginPct: reportData.totalSales > 0 ? ((reportData.totalProfit / reportData.totalSales) * 100).toFixed(1) + '%' : '0%'
      },
      counts: {
        productsTotal: products.length,
        ordersTotal: orders.length,
        newOrders: orders.filter(o => o.status === 'new').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        customersTotal: customers.length
      },
      lowStockItems: lowStock,
      topProducts,
      topCustomers,
      branches: branchSummary,
      activeAdminTab
    };
  };

  // Execute client action (Tab Switch, Excel Export, Word Export)
  const handleExecuteAction = (action: { type: string; targetTab?: AdminTab }) => {
    const liveContext = filterDataByDateRange(orders, products, 'this_month');

    if (action.type === 'open_tab' && action.targetTab) {
      setActiveAdminTab(action.targetTab);
    } else if (action.type === 'generate_excel') {
      generateExcelSalesReport(settings, liveContext, 'Decent Collection Financial & Profit Analysis');
    } else if (action.type === 'generate_word') {
      generateWordBusinessReport(settings, liveContext, 'Decent Collection Executive Audit');
    }
  };

  // Local fallback response engine if API is offline or key missing
  const generateLocalIntelligentReply = (query: string): { text: string; actions?: any[] } => {
    const q = query.toLowerCase();
    const liveContext = getLiveContext();
    const curr = liveContext.currency;

    if (q.includes('profit') || q.includes('margin') || q.includes('cost') || q.includes('making')) {
      return {
        text: `📊 **Financial & Profit Performance Summary** (${liveContext.datePeriod}):

• **Gross Revenue**: ${curr} ${liveContext.financials.totalSales.toLocaleString()}
• **Buying Cost (COGS)**: ${curr} ${liveContext.financials.totalCost.toLocaleString()}
• **Net Profit**: **${curr} ${liveContext.financials.totalProfit.toLocaleString()}**
• **Profit Margin**: **${liveContext.financials.profitMarginPct}**

💡 **AI Recommendation**: Your current margin is healthy! Keep stocking high-profit Italian Leather footwear and executive suits.`,
        actions: [
          { type: 'open_tab', label: '💵 Go to Product Costing', targetTab: 'costing' },
          { type: 'generate_excel', label: '📊 Download Excel Profit Sheet' }
        ]
      };
    }

    if (q.includes('stock') || q.includes('low') || q.includes('inventory') || q.includes('restock')) {
      if (liveContext.lowStockItems.length === 0) {
        return {
          text: `✅ **Stock Status**: All ${liveContext.counts.productsTotal} products in inventory currently have healthy stock levels above their restock thresholds!`,
          actions: [{ type: 'open_tab', label: '📦 View Inventory', targetTab: 'inventory' }]
        };
      }
      const itemList = liveContext.lowStockItems
        .map(i => `• **${i.name}**: ${i.stock} remaining (Category: ${i.category.toUpperCase()})`)
        .join('\n');

      return {
        text: `⚠️ **Low Stock Alert (${liveContext.lowStockItems.length} items need reordering)**:

${itemList}

💡 **AI Recommendation**: Place purchase orders with your suppliers for these fast-moving items immediately to prevent out-of-stock losses.`,
        actions: [
          { type: 'open_tab', label: '📦 Open Stock Inventory', targetTab: 'inventory' },
          { type: 'open_tab', label: '💵 Add Purchasing Record', targetTab: 'costing' }
        ]
      };
    }

    if (q.includes('customer') || q.includes('buyer') || q.includes('who')) {
      const customerList = liveContext.topCustomers
        .map((c, idx) => `${idx + 1}. **${c.name}** (${c.phone}) — Spent ${curr} ${c.totalSpent.toLocaleString()} across ${c.totalOrders} orders`)
        .join('\n');

      return {
        text: `👥 **Top Customer Ranking**:

${customerList}

💡 **AI Recommendation**: Offer a special discount code (e.g. DECENTVIP) to top buyers to reward loyalty!`,
        actions: [{ type: 'open_tab', label: '👥 View Customers Tab', targetTab: 'customers' }]
      };
    }

    if (q.includes('branch') || q.includes('nairobi') || q.includes('westlands') || q.includes('mombasa')) {
      const branchList = liveContext.branches
        .map(b => `• **${b.name} (${b.code})**: ${b.productsCount} products, ${b.stockUnits} stock items in store`)
        .join('\n');

      return {
        text: `🏢 **Branch Network Breakdown**:

${branchList}

💡 You can switch active branches or adjust store profiles anytime from Branch Manager.`,
        actions: [{ type: 'open_tab', label: '🏢 Manage Store Branches', targetTab: 'branches' }]
      };
    }

    if (q.includes('excel') || q.includes('report') || q.includes('export') || q.includes('word') || q.includes('download')) {
      return {
        text: `📄 I can immediately generate formal financial reports for you in **Microsoft Excel (.xlsx)** or **Microsoft Word (.docx)** format with full business branding!`,
        actions: [
          { type: 'generate_excel', label: '📊 Download Excel Report' },
          { type: 'generate_word', label: '📄 Download Word Executive Summary' }
        ]
      };
    }

    if (q.includes('order') || q.includes('sale') || q.includes('new')) {
      return {
        text: `🛒 **Order Status Overview**:

• **Total Orders**: ${liveContext.counts.ordersTotal}
• **New Pending Orders**: ${liveContext.counts.newOrders}
• **Completed Orders**: ${liveContext.counts.completedOrders}`,
        actions: [{ type: 'open_tab', label: '🛒 View Orders Dashboard', targetTab: 'orders' }]
      };
    }

    // Default general response
    return {
      text: `Thank you Esther. I've scanned the live store data:
• Total Revenue: ${curr} ${liveContext.financials.totalSales.toLocaleString()}
• Net Operating Profit: ${curr} ${liveContext.financials.totalProfit.toLocaleString()}
• Catalog: ${liveContext.counts.productsTotal} products across ${liveContext.branches.length} branches.

Would you like me to generate a detailed financial report or navigate to a specific management tool?`,
      actions: [
        { type: 'open_tab', label: '📊 Go to Cost & Profit', targetTab: 'costing' },
        { type: 'generate_excel', label: '📥 Download Excel Audit' },
        { type: 'generate_word', label: '📄 Export Word Audit' }
      ]
    };
  };

  // Handle user submit
  const handleSendMessage = async (queryText?: string) => {
    const prompt = queryText || inputQuery;
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const liveContext = getLiveContext();
      const historyPayload = chatHistory.slice(-6).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history: historyPayload,
          contextData: liveContext
        })
      });

      if (res.ok) {
        const data = await res.json();
        let replyText = data.reply || '';

        // Extract action tags
        const actions: ChatMessage['actions'] = [];
        if (replyText.includes('[ACTION:OPEN_TAB:costing]')) {
          actions.push({ type: 'open_tab', label: '💵 Open Product Costing', targetTab: 'costing' });
        }
        if (replyText.includes('[ACTION:OPEN_TAB:products]')) {
          actions.push({ type: 'open_tab', label: '📦 Open Products List', targetTab: 'products' });
        }
        if (replyText.includes('[ACTION:OPEN_TAB:orders]')) {
          actions.push({ type: 'open_tab', label: '🛒 Open Orders View', targetTab: 'orders' });
        }
        if (replyText.includes('[ACTION:OPEN_TAB:inventory]')) {
          actions.push({ type: 'open_tab', label: '📦 Open Inventory', targetTab: 'inventory' });
        }
        if (replyText.includes('[ACTION:OPEN_TAB:reports]')) {
          actions.push({ type: 'open_tab', label: '📊 Open Reports Center', targetTab: 'reports' });
        }
        if (replyText.includes('[ACTION:OPEN_TAB:branches]')) {
          actions.push({ type: 'open_tab', label: '🏢 Open Branch Manager', targetTab: 'branches' });
        }
        if (replyText.includes('[ACTION:GENERATE_EXCEL]')) {
          actions.push({ type: 'generate_excel', label: '📊 Download Excel Report' });
        }
        if (replyText.includes('[ACTION:GENERATE_WORD]')) {
          actions.push({ type: 'generate_word', label: '📄 Download Word Summary' });
        }

        // Clean action tags out of displayed text
        replyText = replyText.replace(/\[ACTION:[^\]]+\]/g, '').trim();

        const assistantMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: actions.length > 0 ? actions : undefined
        };

        setChatHistory(prev => [...prev, assistantMsg]);
      } else {
        // Fallback to local intelligent analysis
        const localReply = generateLocalIntelligentReply(prompt);
        const assistantMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: localReply.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: localReply.actions
        };
        setChatHistory(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      // Local fallback on network error
      const localReply = generateLocalIntelligentReply(prompt);
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: localReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: localReply.actions
      };
      setChatHistory(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory(initialMessages);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Always visible on Admin Dashboard bottom-right) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setHasNewBadge(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-gradient-to-r from-[#D4AF37] via-[#f1d06b] to-[#D4AF37] text-black font-extrabold px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-amber-300"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-black" />
            {hasNewBadge && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 border-2 border-black rounded-full animate-ping" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-black uppercase tracking-wider block leading-none">Esther's AI Assistant</span>
            <span className="text-[10px] opacity-80 font-semibold block mt-0.5">Live Data Manager</span>
          </div>
          <Sparkles className="w-4 h-4 text-black animate-pulse" />
        </button>
      )}

      {/* FLOATING CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized 
              ? 'bottom-6 right-6 w-72 h-14 bg-[#181818] border border-[#D4AF37] rounded-2xl shadow-2xl overflow-hidden' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[85vh] bg-[#141414] border border-[#2D2D2D] rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl'
          }`}
        >
          {/* WINDOW HEADER */}
          <div className="bg-gradient-to-r from-[#1A1A1A] via-[#222222] to-[#1A1A1A] p-3.5 border-b border-[#2B2B2B] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-200 flex items-center justify-center text-black font-extrabold shadow-md">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-white text-xs font-heading">AI Business Manager</h3>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">Assisting Esther Njoki Mbugua</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CHAT CONTENT (Only visible when expanded) */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans scrollbar-thin scrollbar-thumb-gray-800">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 shadow-md leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#D4AF37] text-black font-semibold rounded-br-none'
                          : 'bg-[#1E1E1E] text-gray-200 border border-[#2A2A2A] rounded-bl-none'
                      }`}
                    >
                      {/* Formatted Text */}
                      <div className="whitespace-pre-line font-normal">
                        {msg.text}
                      </div>

                      {/* Action Buttons if present */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[#333333] flex flex-wrap gap-1.5">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleExecuteAction(act)}
                              className="px-2.5 py-1.5 bg-[#2A2A2A] hover:bg-[#383838] text-[#D4AF37] font-bold text-[11px] rounded-lg border border-[#D4AF37]/30 flex items-center gap-1.5 transition-all shadow-sm hover:scale-102"
                            >
                              {act.type === 'generate_excel' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
                              {act.type === 'generate_word' && <FileText className="w-3.5 h-3.5 text-blue-400" />}
                              {act.type === 'open_tab' && <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-400 text-xs bg-[#1A1A1A] p-3 rounded-2xl border border-[#2A2A2A] w-max">
                    <RefreshCw className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    <span>Analyzing live store records...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK PROMPT CHIPS */}
              <div className="px-3 py-2 bg-[#171717] border-t border-[#222222] overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
                {[
                  { label: "💰 Profit this month", query: "What is our total profit this month?" },
                  { label: "⚠️ Low stock alert", query: "Which products are low in stock?" },
                  { label: "👥 Top customers", query: "Who are our top customers?" },
                  { label: "🏢 Branch comparison", query: "Compare store branches performance" },
                  { label: "📊 Export Excel report", query: "Export Excel sales report" },
                  { label: "📄 Export Word summary", query: "Export Word executive summary" },
                  { label: "🛒 View new orders", query: "Show me new pending orders" }
                ].map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(chip.query)}
                    className="px-2.5 py-1 bg-[#222222] hover:bg-[#2B2B2B] text-gray-300 hover:text-[#D4AF37] text-[10px] font-semibold rounded-full border border-[#333333] whitespace-nowrap transition-colors shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* INPUT FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-[#181818] border-t border-[#222222] flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Esther's AI Assistant (e.g. 'What is our profit?')..."
                  className="flex-1 bg-[#111111] border border-[#333333] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-[#D4AF37] transition-colors placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="p-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] disabled:opacity-40 text-black font-bold rounded-xl transition-all shadow-md shrink-0"
                  title="Send Query"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
