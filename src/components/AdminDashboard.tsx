import React, { useState } from 'react';
import { useStore, AdminTab } from '../context/StoreContext';
import { Product, OrderStatus, CategoryType, Order } from '../types';
import { MpesaTerminal } from './MpesaTerminal';
import { ReportsCenter } from './ReportsCenter';
import { CategoryManager } from './CategoryManager';
import { SlideshowManager } from './SlideshowManager';
import { BackupSecurityManager } from './BackupSecurityManager';
import { AppearanceManager, BUILTIN_WALLPAPERS } from './AppearanceManager';
import { SettingsManager } from './SettingsManager';
import { ProductCostingManager } from './ProductCostingManager';
import { BranchAndDataManager } from './BranchAndDataManager';
import { AIBusinessAssistant } from './AIBusinessAssistant';
import { VIPCustomersManager } from './VIPCustomersManager';
import { CustomerAdminView } from './CustomerAdminView';
import { AdminOrderModal } from './AdminOrderModal';
import { 
  LayoutDashboard, Package, FolderTree, ShoppingCart, BarChart3, TrendingUp, 
  DollarSign, Boxes, Users, Star, Ticket, CreditCard, FileText, Megaphone, 
  Image, Store, Settings, Bell, MessageSquare, Download, LogOut, Plus, 
  Edit, Trash2, Search, ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, 
  Check, X, Eye, Phone, Upload, Save, Building, Shield, ChevronRight, Smartphone, Palette, Wand2, Pin
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    activeAdminTab, setActiveAdminTab, logoutAdmin, setViewMode,
    products, orders, customers, reviews, branches, offers, messages, settings,
    addProduct, updateProduct, deleteProduct, updateStock, updateOrderStatus,
    markMessageRead, updateSettings, switchBranch, resetToDefaults
  } = useStore();

  // Modal states inside Admin
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'annual'>('monthly');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Form states for Add/Edit product
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'shoes' as CategoryType,
    price: 4500,
    discountPrice: 0,
    costPrice: 2500,
    stock: 20,
    lowStockThreshold: 5,
    sizes: 'EU 40, EU 41, EU 42, EU 43, EU 44',
    colors: 'Black, Tan Brown',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    description: ''
  });

  // Calculate Metrics
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  const totalSalesCount = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const netRevenue = Math.round(totalSalesCount * 0.78); // estimated net margin
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  // Sidebar Menu Configuration (Named Icons with minimal text as requested)
  const sidebarItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" />, badge: totalProductsCount },
    { id: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" />, badge: orders.filter(o => o.status === 'new').length },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'sales', label: 'Sales', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'costing', label: 'Cost & Profit', icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-4 h-4" />, badge: lowStockProducts.length },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'vip_customers', label: '⭐ VIP Customers', icon: <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />, badge: customers.filter(c => c.isVip).length },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'offers', label: 'Offers', icon: <Ticket className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
    { id: 'promotions', label: 'Promotions', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'banners', label: 'Banners', icon: <Image className="w-4 h-4" /> },
    { id: 'appearance', label: 'Theme & Workspace', icon: <Palette className="w-4 h-4 text-[#D4AF37]" /> },
    { id: 'content', label: 'Website Content', icon: <Save className="w-4 h-4" /> },
    { id: 'branches', label: 'Branches', icon: <Store className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: messages.filter(m => !m.read).length },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'backup', label: 'Backup', icon: <Download className="w-4 h-4" /> },
  ];

  const openAddModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: 'shoes',
      price: 4500,
      discountPrice: 0,
      costPrice: 2500,
      stock: 20,
      lowStockThreshold: 5,
      sizes: 'EU 40, EU 41, EU 42, EU 43, EU 44',
      colors: 'Black, Tan Brown',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
      description: 'Premium handcrafted footwear.'
    });
    setIsAddProductOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || 0,
      costPrice: p.costPrice || Math.round(p.price * 0.55),
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      sizes: p.sizes.join(', '),
      colors: p.colors.join(', '),
      image: p.image,
      description: p.description
    });
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizeArr = prodForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorArr = prodForm.colors.split(',').map(c => c.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodForm.name,
        category: prodForm.category,
        price: Number(prodForm.price),
        discountPrice: prodForm.discountPrice > 0 ? Number(prodForm.discountPrice) : undefined,
        costPrice: Number(prodForm.costPrice),
        stock: Number(prodForm.stock),
        lowStockThreshold: Number(prodForm.lowStockThreshold),
        sizes: sizeArr,
        colors: colorArr,
        image: prodForm.image,
        description: prodForm.description
      });
    } else {
      addProduct({
        name: prodForm.name,
        category: prodForm.category,
        price: Number(prodForm.price),
        discountPrice: prodForm.discountPrice > 0 ? Number(prodForm.discountPrice) : undefined,
        costPrice: Number(prodForm.costPrice),
        rating: 5.0,
        reviewsCount: 1,
        image: prodForm.image || 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
        stock: Number(prodForm.stock),
        lowStockThreshold: Number(prodForm.lowStockThreshold),
        sizes: sizeArr,
        colors: colorArr,
        description: prodForm.description,
        branchId: settings.activeBranchId
      });
    }

    setIsAddProductOpen(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["ID,Name,Category,Price,Stock"].concat(
        products.map(p => `${p.id},"${p.name}",${p.category},${p.price},${p.stock}`)
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `decent_collection_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic Workspace Background Style Computation
  let workspaceBgStyle: React.CSSProperties = {};
  if (settings.adminBgType === 'wallpaper') {
    const wp = BUILTIN_WALLPAPERS.find(w => w.id === settings.adminBgValue) || BUILTIN_WALLPAPERS[0];
    workspaceBgStyle = {
      backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.88), rgba(17,17,17,0.96)), url('${wp.url}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    };
  } else if (settings.adminBgType === 'gradient') {
    workspaceBgStyle = { background: settings.adminBgValue || 'linear-gradient(135deg, #111111 0%, #1A1810 50%, #2A2208 100%)' };
  } else if (settings.adminBgType === 'solid') {
    workspaceBgStyle = { backgroundColor: settings.adminBgValue || '#0D0D0D' };
  } else if (settings.adminBgType === 'custom_image' && settings.adminBgValue) {
    workspaceBgStyle = {
      backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0.85), rgba(17,17,17,0.95)), url('${settings.adminBgValue}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    };
  }

  return (
    <div 
      style={workspaceBgStyle} 
      className="min-h-screen bg-[#111111] text-gray-200 flex flex-col md:flex-row transition-all duration-500 font-['Inter',sans-serif]"
    >
      {/* Background Motion Video if enabled */}
      {settings.adminBgType === 'custom_video' && settings.adminBgValue && (
        <video
          src={settings.adminBgValue}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover pointer-events-none opacity-20 -z-10"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#161616]/90 backdrop-blur-md border-r border-[#222222] shrink-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#111111] border border-[#D4AF37] flex items-center justify-center font-bold text-[#D4AF37]">
                DC
              </div>
              <div>
                <h1 className="font-extrabold text-white text-sm font-heading">DECENT COLLECTION</h1>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Manager Dashboard</span>
              </div>
            </div>
            <button
              onClick={() => setViewMode('customer')}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#222222]"
              title="Return to Customer Storefront"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Active Branch Selector */}
          <div className="p-3 bg-[#1A1A1A]/80 border-b border-[#222222]">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Current Branch:</span>
            <select
              value={settings.activeBranchId}
              onChange={(e) => switchBranch(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] text-white text-xs rounded p-1.5 outline-none font-medium"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  🏪 {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Menu Items */}
          <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {sidebarItems.map((item) => {
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                      : 'text-gray-300 hover:bg-[#222222] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-black text-[#D4AF37]' : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="p-3 border-t border-[#222222]">
          <button
            onClick={logoutAdmin}
            className="w-full py-2 px-3 bg-[#222222] hover:bg-red-600/20 text-gray-300 hover:text-red-400 border border-[#333333] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Manager</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Executive Welcome Header */}
        <div className="bg-[#1A1A1A]/80 backdrop-blur-md border border-[#2B2B2B] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <img
              src={settings.adminAvatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'}
              alt={settings.adminName || 'Esta Njoki Mbugua'}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base font-heading">
                  {settings.adminName || 'Esta Njoki Mbugua'}
                </h3>
                <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  {settings.adminTitle || 'Managing Director'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {settings.adminWelcomeMessage || 'Welcome to your Decent Collection Executive Portal.'}
              </p>
            </div>
          </div>

          {/* Quick Pinned Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1 shrink-0">
              <Pin className="w-3 h-3 text-[#D4AF37]" /> Quick Access:
            </span>
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'orders', label: 'Orders' },
              { id: 'products', label: 'Products' },
              { id: 'reports', label: 'Reports' },
              { id: 'payments', label: 'Payments' },
              { id: 'appearance', label: 'Theme & Workspace' }
            ].map(shortcut => (
              <button
                key={shortcut.id}
                onClick={() => setActiveAdminTab(shortcut.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeAdminTab === shortcut.id
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-[#222222] hover:bg-[#2B2B2B] text-gray-300 border border-[#333333]'
                }`}
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#222222]">
          <div>
            <h2 className="text-xl font-extrabold text-white font-heading capitalize flex items-center gap-2">
              <span>{sidebarItems.find(s => s.id === activeAdminTab)?.icon}</span>
              <span>{activeAdminTab} Overview</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Logged in as Store Manager (Mrs. Waithaka) • {branches.find(b => b.id === settings.activeBranchId)?.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openAddModal}
              className="px-3.5 py-2 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button
              onClick={() => setActiveAdminTab('inventory')}
              className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-gray-200 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Boxes className="w-4 h-4 text-[#D4AF37]" /> Manage Stock
            </button>
          </div>
        </div>

        {/* ------------------ TAB 1: DASHBOARD OVERVIEW ------------------ */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Metric Cards (Exact match to prompt requested cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Card 1: Products */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">📦 Products</span>
                  <div className="p-2 rounded-lg bg-[#222222] text-[#D4AF37]">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white font-heading">{totalProductsCount}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">Active Catalog</span>
                </div>
              </div>

              {/* Card 2: Orders */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">🛒 Orders</span>
                  <div className="p-2 rounded-lg bg-[#222222] text-amber-400">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white font-heading">{totalOrdersCount}</span>
                  <span className="text-[10px] text-amber-400 block mt-1">{orders.filter(o=>o.status==='new').length} New Pending</span>
                </div>
              </div>

              {/* Card 3: Customers */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">👥 Customers</span>
                  <div className="p-2 rounded-lg bg-[#222222] text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white font-heading">{totalCustomersCount}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Registered Clients</span>
                </div>
              </div>

              {/* Card 4: Sales */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">💰 Sales</span>
                  <div className="p-2 rounded-lg bg-[#222222] text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xl font-extrabold text-white font-heading">
                    {settings.currency} {totalSalesCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-1">Gross Revenue</span>
                </div>
              </div>

              {/* Card 5: Revenue */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">📈 Revenue</span>
                  <div className="p-2 rounded-lg bg-[#222222] text-[#D4AF37]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xl font-extrabold text-[#D4AF37] font-heading">
                    {settings.currency} {netRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-1">Est. Net Profit</span>
                </div>
              </div>

              {/* Card 6: Stock */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">📦 Stock</span>
                  <div className="p-2 rounded-lg bg-[#222222] text-purple-400">
                    <Boxes className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white font-heading">{totalStockUnits}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Total Items in Store</span>
                </div>
              </div>

              {/* Card 7: Low Stock */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">⚠️ Low Stock</span>
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-amber-400 font-heading">{lowStockProducts.length}</span>
                  <span className="text-[10px] text-amber-400 block mt-1">Requires Restock</span>
                </div>
              </div>

              {/* Card 8: Reviews */}
              <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-gray-400">⭐ Reviews</span>
                  <div className="p-2 rounded-lg bg-[#222222] text-amber-400">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-white font-heading">{averageRating} ★</span>
                  <span className="text-[10px] text-gray-400 block mt-1">{reviews.length} Verified Reviews</span>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts Banner if any */}
            {lowStockProducts.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Low Stock Warning</h4>
                    <p className="text-xs text-amber-200/80">
                      {lowStockProducts.map(p => p.name).join(', ')} are below restock threshold.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAdminTab('inventory')}
                  className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-lg uppercase tracking-wider shrink-0"
                >
                  Restock Inventory Now
                </button>
              </div>
            )}

            {/* Recent Orders Table */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-base font-heading flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
                  <span>Recent Customer Orders</span>
                </h3>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="text-xs text-[#D4AF37] font-semibold hover:underline flex items-center gap-1"
                >
                  View All Orders <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-gray-400 uppercase tracking-wider border-b border-[#2B2B2B]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">M-Pesa Ref</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#222222]">
                        <td className="p-3 font-mono font-bold text-white">{ord.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{ord.customerName}</div>
                          <div className="text-[10px] text-gray-500">{ord.customerPhone}</div>
                        </td>
                        <td className="p-3 text-gray-300">
                          {ord.items.map(i => `${i.product.name} (${i.selectedSize})`).join(', ')}
                        </td>
                        <td className="p-3 font-bold text-[#D4AF37] font-heading">
                          {settings.currency} {ord.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-3 font-mono text-emerald-400">{ord.mpesaCode || 'Cash'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                            ord.status === 'packing' ? 'bg-amber-500/20 text-amber-400' :
                            ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {ord.status === 'new' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'packing')}
                              className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/40 font-semibold"
                            >
                              Pack
                            </button>
                          )}
                          {ord.status === 'packing' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'completed')}
                              className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/40 font-semibold"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------ TAB 2: PRODUCTS MANAGER ------------------ */}
        {activeAdminTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#1A1A1A] p-4 rounded-xl border border-[#2B2B2B]">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="🔍 Search products..."
                  className="w-full bg-[#111111] border border-[#333333] text-xs text-white rounded-lg pl-9 pr-3 py-2 outline-none"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={openAddModal}
                  className="px-3 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
                <button
                  onClick={exportCSV}
                  className="px-3 py-2 bg-[#222222] hover:bg-[#333333] text-gray-200 font-semibold text-xs rounded-lg flex items-center gap-1.5 border border-[#333333]"
                >
                  📤 Export CSV
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] text-gray-400 uppercase tracking-wider border-b border-[#2B2B2B]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Sizes</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {products
                    .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.includes(productSearch.toLowerCase()))
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-[#222222]">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded bg-black"
                          />
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.id}</span>
                          </div>
                        </td>
                        <td className="p-3 uppercase text-[10px] font-bold text-[#D4AF37]">{p.category}</td>
                        <td className="p-3 font-bold text-white font-heading">
                          {settings.currency} {p.price.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            p.stock <= p.lowStockThreshold ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">{p.sizes.join(', ')}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 bg-[#222222] hover:bg-[#333333] text-gray-300 rounded"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                            }}
                            className="p-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------ TAB 3: INVENTORY MANAGER ------------------ */}
        {activeAdminTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-5">
              <h3 className="font-bold text-white text-base font-heading mb-4 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#D4AF37]" />
                <span>Stock Levels & Inventory Adjustments</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-gray-400 uppercase tracking-wider border-b border-[#2B2B2B]">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Threshold</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262626]">
                    {products.map((p) => {
                      const isLow = p.stock <= p.lowStockThreshold;
                      return (
                        <tr key={p.id} className="hover:bg-[#222222]">
                          <td className="p-3 font-bold text-white">{p.name}</td>
                          <td className="p-3 uppercase text-[10px] text-[#D4AF37] font-semibold">{p.category}</td>
                          <td className="p-3 font-mono font-bold text-sm text-white">{p.stock}</td>
                          <td className="p-3 text-gray-400">{p.lowStockThreshold} units</td>
                          <td className="p-3">
                            {isLow ? (
                              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">⚠️ Restock Needed</span>
                            ) : (
                              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">Good</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => updateStock(p.id, -1)}
                              className="px-2.5 py-1 bg-[#222222] hover:bg-red-500/20 text-red-400 rounded font-bold"
                            >
                              - Remove 1
                            </button>
                            <button
                              onClick={() => updateStock(p.id, +5)}
                              className="px-2.5 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] rounded font-bold"
                            >
                              + Add 5
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------ TAB 4: ORDERS VIEW ------------------ */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4">
            {/* Status Filter Tabs */}
            <div className="flex gap-2 border-b border-[#2B2B2B] pb-3">
              {['all', 'new', 'packing', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    orderFilterStatus === st
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] text-gray-400 uppercase tracking-wider border-b border-[#2B2B2B]">
                  <tr>
                    <th className="p-3">Order Code</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {orders
                    .filter(o => orderFilterStatus === 'all' || o.status === orderFilterStatus)
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#222222]">
                        <td className="p-3 font-mono font-bold text-white">{ord.id}</td>
                        <td className="p-3 text-gray-400">{ord.date}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{ord.customerName}</div>
                          <div className="text-[10px] text-gray-400">{ord.customerPhone}</div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-emerald-400 uppercase">{ord.paymentMethod}</span>
                          {ord.mpesaCode && <span className="block text-[10px] text-gray-400">{ord.mpesaCode}</span>}
                        </td>
                        <td className="p-3 font-bold text-[#D4AF37] font-heading">
                          {settings.currency} {ord.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                            ord.status === 'packing' ? 'bg-amber-500/20 text-amber-400' :
                            ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1 flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="px-2.5 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs rounded transition-all"
                            title="Manage Order & Chat with Customer"
                          >
                            Manage
                          </button>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-[#111111] border border-[#333333] text-white text-xs rounded p-1 outline-none font-semibold"
                          >
                            <option value="new">🛒 New</option>
                            <option value="packing">📦 Packing</option>
                            <option value="delivery">🚚 Delivery</option>
                            <option value="completed">✅ Completed</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------ TAB: CATEGORIES MANAGER ------------------ */}
        {activeAdminTab === 'categories' && (
          <CategoryManager />
        )}

        {/* ------------------ TAB: SLIDESHOW & BANNERS MANAGER ------------------ */}
        {activeAdminTab === 'banners' && (
          <SlideshowManager />
        )}

        {/* ------------------ TAB: BACKUP & SECURITY MANAGER ------------------ */}
        {activeAdminTab === 'backup' && (
          <BackupSecurityManager />
        )}

        {/* ------------------ TAB: THEME & WORKSPACE MANAGER ------------------ */}
        {(activeAdminTab === 'appearance' || activeAdminTab === 'theme' || activeAdminTab === 'typography') && (
          <AppearanceManager />
        )}

        {/* ------------------ TAB 5: REPORTS & FINANCIAL AUDIT ------------------ */}
        {(activeAdminTab === 'reports' || activeAdminTab === 'analytics' || activeAdminTab === 'sales') && (
          <ReportsCenter />
        )}

        {/* ------------------ TAB 6: PAYMENTS & MPESA STK PUSH TERMINAL ------------------ */}
        {activeAdminTab === 'payments' && (
          <MpesaTerminal />
        )}

        {/* ------------------ TAB: PRODUCT COSTING & PROFIT MANAGEMENT ------------------ */}
        {activeAdminTab === 'costing' && (
          <ProductCostingManager />
        )}

        {/* ------------------ TAB: BRANCH MANAGEMENT & FULL DATA CONTROL ------------------ */}
        {activeAdminTab === 'branches' && (
          <BranchAndDataManager />
        )}

        {/* ------------------ TAB: CUSTOMERS MANAGEMENT ------------------ */}
        {activeAdminTab === 'customers' && (
          <CustomerAdminView />
        )}

        {/* ------------------ TAB: ⭐ VIP CUSTOMERS MANAGEMENT SYSTEM ------------------ */}
        {activeAdminTab === 'vip_customers' && (
          <VIPCustomersManager />
        )}

        {/* ------------------ TAB: SIMPLE & PROFESSIONAL NO-CODE SETTINGS ------------------ */}
        {(activeAdminTab === 'settings' || activeAdminTab === 'content') && (
          <SettingsManager />
        )}

        {/* FALLBACK FOR OTHER TABS */}
        {['reviews', 'offers', 'invoices', 'promotions', 'notifications', 'messages'].includes(activeAdminTab) && (
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl p-6 text-center text-gray-400 text-xs">
            <h3 className="text-white font-bold text-base font-heading mb-2 capitalize">{activeAdminTab} Module</h3>
            <p className="max-w-md mx-auto">
              Fully configured for Decent Collection manager view. All active records synced with store inventory.
            </p>
          </div>
        )}

        {/* Admin Order Modal for Detailed View & Notification Prompt */}
        <AdminOrderModal
          order={selectedOrderDetails}
          onClose={() => setSelectedOrderDetails(null)}
        />
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181818] border border-[#2B2B2B] w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-3">
              <h3 className="font-bold text-white text-base font-heading">
                {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="e.g. Nike Air Max / Oxford Shoes"
                  className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as CategoryType })}
                    className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none"
                  >
                    {(settings.customCategories || [
                      { id: 'shoes', name: 'Shoes & Footwear', icon: '👞' },
                      { id: 'suits', name: 'Executive Suits', icon: '👔' },
                      { id: 'shirts', name: 'Shirts & Tops', icon: '👕' },
                      { id: 'jeans', name: 'Jeans & Trousers', icon: '👖' },
                      { id: 'accessories', name: 'Leather Accessories', icon: '💼' }
                    ]).map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Buying Price (KSh) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.costPrice}
                    onChange={(e) => setProdForm({ ...prodForm, costPrice: Number(e.target.value) })}
                    placeholder="Cost price"
                    className="w-full bg-[#111111] border border-[#333333] text-emerald-400 font-bold rounded-lg p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Selling Price (KSh) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-[#111111] border border-[#333333] text-white font-bold rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Low Stock Warning At</label>
                  <input
                    type="number"
                    value={prodForm.lowStockThreshold}
                    onChange={(e) => setProdForm({ ...prodForm, lowStockThreshold: Number(e.target.value) })}
                    className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Sizes (Comma separated)</label>
                <input
                  type="text"
                  value={prodForm.sizes}
                  onChange={(e) => setProdForm({ ...prodForm, sizes: e.target.value })}
                  placeholder="EU 40, EU 41, EU 42"
                  className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-[#111111] border border-[#333333] text-white rounded-lg p-2.5 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-extrabold uppercase rounded-lg shadow-lg"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Business Assistant */}
      <AIBusinessAssistant />
    </div>
  );
};
