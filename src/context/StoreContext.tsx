import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, Order, Customer, Review, Branch, Offer, StoreMessage, ShopSettings, 
  CategoryType, OrderStatus, MpesaTransaction, MpesaStkPushStatus, VIPCommunication,
  EmailTemplate, NotificationRecord, VIPRuleSettings, OrderMessage
} from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_REVIEWS, 
  INITIAL_BRANCHES, INITIAL_OFFERS, INITIAL_MESSAGES, INITIAL_SETTINGS,
  INITIAL_EMAIL_TEMPLATES, INITIAL_NOTIFICATION_HISTORY, INITIAL_VIP_RULES
} from '../data/initialData';
import { generateMpesaReceiptCode, generateCheckoutRequestId } from '../services/mpesaService';

export type ViewMode = 'customer' | 'admin_login' | 'admin_dashboard';
export type AdminTab = 
  | 'dashboard' | 'products' | 'categories' | 'orders' | 'reports' 
  | 'analytics' | 'sales' | 'costing' | 'inventory' | 'customers' | 'vip_customers' | 'reviews' 
  | 'offers' | 'payments' | 'invoices' | 'promotions' | 'banners' 
  | 'branches' | 'settings' | 'notifications' | 'messages' | 'backup' | 'content'
  | 'appearance' | 'theme' | 'typography';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface StoreContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;
  isLoggedIn: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  
  // Data
  products: Product[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  branches: Branch[];
  offers: Offer[];
  messages: StoreMessage[];
  settings: ShopSettings;
  mpesaTransactions: MpesaTransaction[];
  activeStkPush: MpesaTransaction | null;
  showPhoneSimulator: boolean;
  setShowPhoneSimulator: (show: boolean) => void;

  // Customer Auth & Email Verification (OTP)
  currentCustomer: Customer | null;
  registerCustomer: (data: { name: string; email: string; phone: string; password: string }) => { success: boolean; message: string; customer?: Customer };
  verifyCustomerOTP: (email: string, code: string) => { success: boolean; message: string; expired?: boolean };
  resendCustomerOTP: (email: string) => { success: boolean; message: string; otpCode?: string };
  manuallyVerifyCustomer: (customerId: string) => void;
  deleteCustomer: (customerId: string) => void;
  loginCustomer: (email: string, pass: string) => { success: boolean; message: string; customer?: Customer; requiresVerification?: boolean };
  logoutCustomer: () => void;
  requestPasswordReset: (email: string) => { success: boolean; message: string };
  resetPassword: (email: string, code: string, newPass: string) => { success: boolean; message: string };

  // Cart & Wishlist
  cart: CartItem[];
  wishlistIds: string[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  
  // Filters & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  
  // VIP State & Actions
  vipCommunications: VIPCommunication[];
  emailTemplates: EmailTemplate[];
  notificationHistory: NotificationRecord[];
  subscribeVIPClub: (name: string, email: string, phone?: string) => { success: boolean; message: string; vipCode?: string; isAlreadySubscribed?: boolean };
  toggleVipStatus: (customerId: string, status?: 'active' | 'inactive') => void;
  grantVipStatus: (customerId: string, notes?: string) => void;
  removeVipStatus: (customerId: string) => void;
  approveVIPRecommendation: (customerId: string) => void;
  declineVIPRecommendation: (customerId: string) => void;
  addVipMember: (customerData: Partial<Customer>) => Customer;
  updateCustomerDetails: (customerId: string, updates: Partial<Customer>) => void;
  sendVIPNotificationMultiChannel: (params: {
    recipients: 'all' | 'selected' | 'single';
    selectedEmails?: string[];
    channel: 'email' | 'whatsapp' | 'both';
    subject?: string;
    message: string;
    attachments?: string[];
    templateName?: string;
  }) => void;
  saveVIPRules: (rules: VIPRuleSettings) => void;

  // Actions
  addProduct: (newProd: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, delta: number) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderStatusWithNotification: (
    orderId: string, 
    status: OrderStatus, 
    notifyChannel?: 'email' | 'whatsapp' | 'both' | 'none',
    customMessage?: string,
    cancelReason?: string
  ) => void;
  addOrderMessage: (orderId: string, sender: 'customer' | 'admin', senderName: string, text: string) => void;
  addOffer: (offerData: Omit<Offer, 'id'>) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  markMessageRead: (messageId: string) => void;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  switchBranch: (branchId: string) => void;
  resetToDefaults: () => void;

  // M-Pesa STK Push Actions
  triggerStkPush: (params: { orderId: string; customerName: string; customerPhone: string; amount: number; itemsSummary?: string }) => MpesaTransaction;
  updateMpesaTransactionStatus: (id: string, status: MpesaStkPushStatus, mpesaReceiptNumber?: string, failureReason?: string) => void;
  clearActiveStkPush: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'decent_collection_store_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Persistent States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_branches`);
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_offers`);
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [messages, setMessages] = useState<StoreMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [mpesaTransactions, setMpesaTransactions] = useState<MpesaTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_mpesa_txs`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'MP-8812',
        orderId: 'ORD-8812',
        customerName: 'John Doe',
        customerPhone: '254712345678',
        amount: 4500,
        status: 'paid',
        mpesaReceiptNumber: 'QFH8812J1X',
        checkoutRequestId: 'ws_CO_1721839201_8812',
        merchantRequestId: 'MR_8812',
        timestamp: new Date(Date.now() - 3600000).toLocaleString(),
        itemsSummary: 'Italian Leather Loafers x1'
      },
      {
        id: 'MP-8811',
        orderId: 'ORD-8811',
        customerName: 'Jane Smith',
        customerPhone: '254798765432',
        amount: 22000,
        status: 'paid',
        mpesaReceiptNumber: 'QFH8811J2Y',
        checkoutRequestId: 'ws_CO_1721835600_8811',
        merchantRequestId: 'MR_8811',
        timestamp: new Date(Date.now() - 7200000).toLocaleString(),
        itemsSummary: 'Bespoke Executive Suit x1'
      }
    ];
  });

  const [activeStkPush, setActiveStkPush] = useState<MpesaTransaction | null>(null);
  const [showPhoneSimulator, setShowPhoneSimulator] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cart`);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_wishlist`);
    return saved ? JSON.parse(saved) : [];
  });

  const [vipCommunications, setVipCommunications] = useState<VIPCommunication[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_vip_comms`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'comm_1',
        subject: '👑 Exclusive VIP Invitation: European Italian Leather Gala Launch',
        body: 'Dear VIP Patron, you are cordially invited for early access to our newly arrived Italian Handmade Oxfords and Velvet Blazers.',
        recipientType: 'all',
        sentDate: '2026-07-20 10:00 AM',
        status: 'sent',
        sentBy: 'Super Administrator Esther'
      }
    ];
  });

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_customer`);
    return saved ? JSON.parse(saved) : null;
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_email_templates`);
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_TEMPLATES;
  });

  const [notificationHistory, setNotificationHistory] = useState<NotificationRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notif_history`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_HISTORY;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Sync currentCustomer, notificationHistory, templates to localStorage
  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_customer`, JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_customer`);
    }
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notif_history`, JSON.stringify(notificationHistory));
  }, [notificationHistory]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_email_templates`, JSON.stringify(emailTemplates));
  }, [emailTemplates]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_offers`, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_vip_comms`, JSON.stringify(vipCommunications));
  }, [vipCommunications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_branches`, JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));

    // Apply dynamic theme custom CSS variables to document root
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (settings.primaryColor) root.style.setProperty('--primary-color', settings.primaryColor);
      if (settings.secondaryColor) root.style.setProperty('--secondary-color', settings.secondaryColor);
      if (settings.accentColor) root.style.setProperty('--accent-color', settings.accentColor);
      if (settings.bodyFont) document.body.style.fontFamily = `"${settings.bodyFont}", sans-serif`;
      
      if (settings.adminThemeMode === 'light') {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      } else {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      }
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_mpesa_txs`, JSON.stringify(mpesaTransactions));
  }, [mpesaTransactions]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_wishlist`, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Auth logic
  const loginAdmin = (pass: string) => {
    // Allows default or any password for seamless demo access
    setIsLoggedIn(true);
    setViewMode('admin_dashboard');
    return true;
  };

  const logoutAdmin = () => {
    setIsLoggedIn(false);
    setViewMode('customer');
  };

  // Product Actions
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProdData,
      id: `p_${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    }));
  };

  // Order Actions
  const createOrder = (orderData: Omit<Order, 'id' | 'date'>): Order => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${randomCode}`,
      date: dateStr
    };

    setOrders(prev => [newOrder, ...prev]);

    // Reduce stock levels
    newOrder.items.forEach(item => {
      updateStock(item.product.id, -item.quantity);
    });

    // Update customer stats or add customer
    setCustomers(prev => {
      const existing = prev.find(c => c.phone === orderData.customerPhone || c.email === orderData.email);
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + orderData.totalAmount
        } : c);
      } else {
        return [{
          id: `c_${Date.now()}`,
          name: orderData.customerName,
          email: orderData.email || 'customer@decent.co.ke',
          phone: orderData.customerPhone,
          totalOrders: 1,
          totalSpent: orderData.totalAmount,
          joinedDate: new Date().toISOString().split('T')[0]
        }, ...prev];
      }
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Cart Actions
  const addToCart = (product: Product, size?: string, color?: string) => {
    const selectedSize = size || product.sizes[0] || 'Standard';
    const selectedColor = color || product.colors[0] || 'Standard';

    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.product.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { product, quantity: 1, selectedSize, selectedColor }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(i => {
      if (i.product.id === productId && i.selectedSize === size) {
        return { ...i, quantity };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const markMessageRead = (messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, read: true } : m));
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const switchBranch = (branchId: string) => {
    setBranches(prev => prev.map(b => ({ ...b, active: b.id === branchId })));
    setSettings(prev => ({ ...prev, activeBranchId: branchId }));
  };

  const triggerStkPush = ({
    orderId,
    customerName,
    customerPhone,
    amount,
    itemsSummary
  }: {
    orderId: string;
    customerName: string;
    customerPhone: string;
    amount: number;
    itemsSummary?: string;
  }): MpesaTransaction => {
    const checkoutReqId = generateCheckoutRequestId();
    const newTx: MpesaTransaction = {
      id: `MP-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId,
      customerName,
      customerPhone,
      amount,
      status: 'sent',
      checkoutRequestId: checkoutReqId,
      merchantRequestId: `MR_${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      itemsSummary: itemsSummary || 'Decent Collection Purchase'
    };

    setMpesaTransactions(prev => [newTx, ...prev]);
    setActiveStkPush(newTx);
    setShowPhoneSimulator(true);
    return newTx;
  };

  const updateMpesaTransactionStatus = (
    id: string,
    status: MpesaStkPushStatus,
    mpesaReceiptNumber?: string,
    failureReason?: string
  ) => {
    setMpesaTransactions(prev =>
      prev.map(tx => {
        if (tx.id === id || tx.checkoutRequestId === id) {
          const updated = {
            ...tx,
            status,
            ...(mpesaReceiptNumber ? { mpesaReceiptNumber } : {}),
            ...(failureReason ? { failureReason } : {})
          };
          return updated;
        }
        return tx;
      })
    );

    setActiveStkPush(prev => {
      if (prev && (prev.id === id || prev.checkoutRequestId === id)) {
        return {
          ...prev,
          status,
          ...(mpesaReceiptNumber ? { mpesaReceiptNumber } : {}),
          ...(failureReason ? { failureReason } : {})
        };
      }
      return prev;
    });

    // If paid, update matching order mpesaCode and status
    if (status === 'paid') {
      const receiptCode = mpesaReceiptNumber || generateMpesaReceiptCode();
      setOrders(prev =>
        prev.map(o => {
          const tx = mpesaTransactions.find(t => t.id === id || t.checkoutRequestId === id);
          if (tx && o.id === tx.orderId) {
            return {
              ...o,
              status: 'packing',
              mpesaCode: receiptCode
            };
          }
          return o;
        })
      );
    }
  };

  const clearActiveStkPush = () => {
    setActiveStkPush(null);
    setShowPhoneSimulator(false);
  };

  // Customer Registration & OTP Verification
  const registerCustomer = (data: { name: string; email: string; phone: string; password: string }) => {
    const existing = customers.find(c => c.email.toLowerCase() === data.email.toLowerCase());
    if (existing && existing.emailVerified) {
      return { success: false, message: 'An account with this email address already exists. Please login instead.' };
    }

    const phoneExisting = customers.find(c => c.phone.replace(/\s+/g, '') === data.phone.replace(/\s+/g, '') && c.emailVerified);
    if (phoneExisting) {
      return { success: false, message: 'An account with this phone number already exists.' };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const custId = existing ? existing.id : `CUS-${String(customers.length + 1).padStart(6, '0')}`;

    const newCustomer: Customer = {
      id: custId,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      totalOrders: existing ? existing.totalOrders : 0,
      totalSpent: existing ? existing.totalSpent : 0,
      joinedDate: existing ? existing.joinedDate : new Date().toISOString().split('T')[0],
      status: 'active',
      emailVerified: false,
      verificationCode: otpCode,
      otpExpiresAt: expiresAt,
      passwordHash: btoa(data.password),
      whatsappOptIn: true
    };

    setCustomers(prev => {
      const filtered = prev.filter(c => c.email.toLowerCase() !== data.email.toLowerCase());
      return [newCustomer, ...filtered];
    });

    // Dispatch verification email to history
    const notif: NotificationRecord = {
      id: `notif_${Date.now()}`,
      recipientName: data.name,
      recipientEmail: data.email,
      recipientPhone: data.phone,
      channel: 'email',
      subject: 'Verify Your Email Address - Decent Collection',
      message: `Hello ${data.name},\n\nWelcome to Decent Collection.\n\nTo activate your account, please verify your email address using the verification code below:\n\nVerification Code: ${otpCode}\n\nThis code will expire in 10 minutes. If you did not create this account, please ignore this email.\n\nThank you,\nDecent Collection`,
      sentDate: new Date().toLocaleString(),
      status: 'sent',
      sentBy: 'Business Gmail (decentcollection@gmail.com)'
    };
    setNotificationHistory(prev => [notif, ...prev]);

    return { 
      success: true, 
      message: 'Account created! Please enter the 6-digit verification code sent to your email.',
      customer: newCustomer
    };
  };

  const verifyCustomerOTP = (email: string, code: string) => {
    const cust = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!cust) {
      return { success: false, message: 'Account not found. Please register first.' };
    }

    if (cust.emailVerified) {
      setCurrentCustomer(cust);
      return { success: true, message: 'Email is already verified. You are now logged in!' };
    }

    if (!cust.verificationCode || cust.verificationCode !== code.trim()) {
      return { success: false, message: '❌ The verification code is incorrect. Please try again.' };
    }

    if (cust.otpExpiresAt && new Date() > new Date(cust.otpExpiresAt)) {
      return { success: false, message: '⚠ Your verification code has expired.', expired: true };
    }

    // Success verify
    const verifiedCust: Customer = {
      ...cust,
      emailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      verificationCode: undefined,
      otpExpiresAt: undefined
    };

    setCustomers(prev => prev.map(c => c.id === cust.id ? verifiedCust : c));
    setCurrentCustomer(verifiedCust);

    // Record welcome email
    const welcomeNotif: NotificationRecord = {
      id: `notif_welcome_${Date.now()}`,
      recipientName: cust.name,
      recipientEmail: cust.email,
      recipientPhone: cust.phone,
      channel: 'email',
      subject: '🎉 Account Activated - Welcome to Decent Collection',
      message: `Hello ${cust.name},\n\nYour email address has been verified successfully. Welcome to Decent Collection!\n\nYou can now browse our executive suit collection, place orders, and join our VIP Club.\n\nKind regards,\nEsther Njoki Mbugua\nSuper Administrator\nDecent Collection`,
      sentDate: new Date().toLocaleString(),
      status: 'delivered',
      sentBy: 'Esther Njoki Mbugua'
    };
    setNotificationHistory(prev => [welcomeNotif, ...prev]);

    return { success: true, message: '✅ Your email has been verified successfully. Welcome to Decent Collection!' };
  };

  const resendCustomerOTP = (email: string) => {
    const cust = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!cust) {
      return { success: false, message: 'Account not found.' };
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    setCustomers(prev => prev.map(c => {
      if (c.id === cust.id) {
        return {
          ...c,
          verificationCode: newCode,
          otpExpiresAt: newExpiresAt
        };
      }
      return c;
    }));

    const notif: NotificationRecord = {
      id: `notif_resend_${Date.now()}`,
      recipientName: cust.name,
      recipientEmail: cust.email,
      recipientPhone: cust.phone,
      channel: 'email',
      subject: 'Resent Verification Code - Decent Collection',
      message: `Hello ${cust.name},\n\nHere is your new 6-digit verification code:\n\nVerification Code: ${newCode}\n\nThis code expires in 10 minutes.`,
      sentDate: new Date().toLocaleString(),
      status: 'sent',
      sentBy: 'decentcollection@gmail.com'
    };
    setNotificationHistory(prev => [notif, ...prev]);

    return { 
      success: true, 
      message: '✅ A new verification code has been sent to your email address.',
      otpCode: newCode
    };
  };

  const manuallyVerifyCustomer = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
          verificationCode: undefined,
          otpExpiresAt: undefined
        };
      }
      return c;
    }));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    if (currentCustomer && currentCustomer.id === customerId) {
      setCurrentCustomer(null);
    }
  };

  const loginCustomer = (email: string, pass: string) => {
    const cust = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!cust) {
      return { success: false, message: 'No customer account found with this email address.' };
    }

    if (cust.passwordHash && cust.passwordHash !== btoa(pass)) {
      return { success: false, message: 'Incorrect password. Please check your credentials.' };
    }

    if (!cust.emailVerified) {
      return { 
        success: false, 
        requiresVerification: true, 
        message: 'Your account is pending email verification. Please verify your email with the OTP code.',
        customer: cust
      };
    }

    setCurrentCustomer(cust);
    return { success: true, message: 'Logged in successfully. Welcome back!', customer: cust };
  };

  const logoutCustomer = () => {
    setCurrentCustomer(null);
  };

  const requestPasswordReset = (email: string) => {
    const cust = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!cust) {
      return { success: false, message: 'If an account with this email exists, a reset link has been sent.' };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, verificationCode: resetCode, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() } : c));

    const resetNotif: NotificationRecord = {
      id: `notif_reset_${Date.now()}`,
      recipientName: cust.name,
      recipientEmail: cust.email,
      recipientPhone: cust.phone,
      channel: 'email',
      subject: '🔑 Password Reset Request - Decent Collection',
      message: `Hello ${cust.name},\n\nWe received a request to reset your Decent Collection password.\n\nUse this security reset code: ${resetCode}\n\nIf you did not request this, please ignore this message.`,
      sentDate: new Date().toLocaleString(),
      status: 'sent',
      sentBy: 'decentcollection@gmail.com'
    };
    setNotificationHistory(prev => [resetNotif, ...prev]);

    return { success: true, message: 'Password reset instructions and security code have been sent to your email.' };
  };

  const resetPassword = (email: string, code: string, newPass: string) => {
    const cust = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!cust) return { success: false, message: 'Account not found.' };

    if (!cust.verificationCode || cust.verificationCode !== code.trim()) {
      return { success: false, message: 'Invalid security reset code.' };
    }

    setCustomers(prev => prev.map(c => c.id === cust.id ? {
      ...c,
      passwordHash: btoa(newPass),
      verificationCode: undefined,
      otpExpiresAt: undefined
    } : c));

    return { success: true, message: 'Your password has been reset successfully. You can now log in.' };
  };

  // VIP Subscription & Recommendations
  const subscribeVIPClub = (name: string, email: string, phone?: string) => {
    const existing = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (existing && existing.isVip) {
      return { success: false, isAlreadySubscribed: true, message: 'This email is already a VIP Member.' };
    }

    const vipCount = customers.filter(c => c.isVip).length + 1;
    const vipCode = `VIP-${String(vipCount).padStart(6, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    let updatedOrNewCust: Customer;

    if (existing) {
      updatedOrNewCust = {
        ...existing,
        name: name || existing.name,
        phone: phone || existing.phone,
        isVip: true,
        vipCode,
        vipJoinedDate: today,
        vipStatus: 'active',
        vipNotes: 'Subscribed directly to Decent VIP Club'
      };
      setCustomers(prev => prev.map(c => c.id === existing.id ? updatedOrNewCust : c));
    } else {
      updatedOrNewCust = {
        id: `c_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        phone: phone || '+254 700 000 000',
        totalOrders: 0,
        totalSpent: 0,
        joinedDate: today,
        status: 'active',
        emailVerified: true,
        isVip: true,
        vipCode,
        vipJoinedDate: today,
        vipStatus: 'active',
        vipNotes: 'Subscribed directly to Decent VIP Club'
      };
      setCustomers(prev => [updatedOrNewCust, ...prev]);
    }

    // Automatic Welcome Email
    const welcomeNotif: NotificationRecord = {
      id: `notif_vip_welcome_${Date.now()}`,
      recipientName: name,
      recipientEmail: email,
      recipientPhone: phone || updatedOrNewCust.phone,
      channel: 'email',
      subject: '🎉 Welcome to the Decent Collection VIP Club',
      message: `Hello ${name},\n\nWelcome to the Decent Collection VIP Club!\n\nThank you for subscribing.\n\nAs one of our VIP Members, you will receive:\n✅ Exclusive Discounts\n✅ New Product Arrivals\n✅ Flash Sales\n✅ Holiday Offers\n✅ VIP Promotions\n\nWe look forward to serving you.\n\nKind regards,\nEsther Njoki Mbugua\nSuper Administrator\nDecent Collection`,
      sentDate: new Date().toLocaleString(),
      status: 'delivered',
      templateName: '🎉 Welcome Email',
      vipId: vipCode,
      sentBy: 'Esther Njoki Mbugua (Super Administrator)'
    };

    setNotificationHistory(prev => [welcomeNotif, ...prev]);

    return { 
      success: true, 
      message: `Welcome ${name}! You are now an official Decent Collection VIP Member.`, 
      vipCode 
    };
  };

  const approveVIPRecommendation = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const vipCount = customers.filter(c => c.isVip).length + 1;
    const vipCode = cust.vipCode || `VIP-${String(vipCount).padStart(6, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const updated: Customer = {
      ...cust,
      isVip: true,
      vipCode,
      vipStatus: 'active',
      vipJoinedDate: today,
      vipRecommendationStatus: 'approved',
      vipApprovedBy: 'Esther Njoki Mbugua (Super Admin)',
      vipApprovedDate: today
    };

    setCustomers(prev => prev.map(c => c.id === customerId ? updated : c));

    // Send Welcome Email
    const emailNotif: NotificationRecord = {
      id: `notif_appr_email_${Date.now()}`,
      recipientName: cust.name,
      recipientEmail: cust.email,
      recipientPhone: cust.phone,
      channel: 'email',
      subject: 'Welcome to the Decent Collection VIP Club!',
      message: `Hello ${cust.name},\n\nCongratulations!\n\nBecause of your continued loyalty and support, you have been upgraded to a VIP Member at Decent Collection.\n\nAs a VIP Member, you will enjoy:\n* ⭐ Early access to new arrivals\n* 🎁 Exclusive discounts\n* 🛍 VIP-only promotions\n* 📧 Priority notifications\n* 💬 Exclusive WhatsApp updates\n\nThank you for choosing Decent Collection.\n\nKind regards,\nEsther Njoki Mbugua\nSuper Administrator\nDecent Collection`,
      sentDate: new Date().toLocaleString(),
      status: 'delivered',
      vipId: vipCode,
      sentBy: 'Esther Njoki Mbugua'
    };

    // Send WhatsApp Welcome
    const waNotif: NotificationRecord = {
      id: `notif_appr_wa_${Date.now()}`,
      recipientName: cust.name,
      recipientEmail: cust.email,
      recipientPhone: cust.phone,
      channel: 'whatsapp',
      message: `🎉 Congratulations ${cust.name}!\n\nYou have been upgraded to a VIP Member at Decent Collection because of your continued support.\n\nYou will now receive:\n⭐ Early access to new arrivals\n🎁 Exclusive offers\n👔 VIP product announcements\n\nThank you for being one of our valued customers.\n\nDecent Collection\n📱 0729445172`,
      sentDate: new Date().toLocaleString(),
      status: 'delivered',
      vipId: vipCode,
      sentBy: 'Decent WhatsApp Business (+254729445172)'
    };

    setNotificationHistory(prev => [emailNotif, waNotif, ...prev]);
  };

  const declineVIPRecommendation = (customerId: string) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, vipRecommendationStatus: 'declined' } : c));
  };

  const sendVIPNotificationMultiChannel = (params: {
    recipients: 'all' | 'selected' | 'single';
    selectedEmails?: string[];
    channel: 'email' | 'whatsapp' | 'both';
    subject?: string;
    message: string;
    attachments?: string[];
    templateName?: string;
  }) => {
    const targetVips = customers.filter(c => {
      if (!c.isVip) return false;
      if (params.recipients === 'all') return true;
      if (params.selectedEmails && params.selectedEmails.length > 0) {
        return params.selectedEmails.includes(c.email);
      }
      return true;
    });

    const newRecords: NotificationRecord[] = [];

    targetVips.forEach(vip => {
      const formattedBody = params.message.replace(/{{Customer Name}}/g, vip.name);

      if (params.channel === 'email' || params.channel === 'both') {
        newRecords.push({
          id: `notif_out_e_${Date.now()}_${vip.id}`,
          recipientName: vip.name,
          recipientEmail: vip.email,
          recipientPhone: vip.phone,
          channel: 'email',
          subject: params.subject || 'Special Update from Decent Collection',
          message: formattedBody,
          sentDate: new Date().toLocaleString(),
          status: 'delivered',
          templateName: params.templateName,
          vipId: vip.vipCode,
          sentBy: settings.adminName || 'Esther Njoki Mbugua'
        });
      }

      if (params.channel === 'whatsapp' || params.channel === 'both') {
        newRecords.push({
          id: `notif_out_w_${Date.now()}_${vip.id}`,
          recipientName: vip.name,
          recipientEmail: vip.email,
          recipientPhone: vip.phone,
          channel: 'whatsapp',
          message: formattedBody,
          sentDate: new Date().toLocaleString(),
          status: 'delivered',
          templateName: params.templateName,
          vipId: vip.vipCode,
          sentBy: 'WhatsApp Business (+254729445172)'
        });
      }
    });

    setNotificationHistory(prev => [...newRecords, ...prev]);
  };

  const saveVIPRules = (rules: VIPRuleSettings) => {
    setSettings(prev => ({
      ...prev,
      vipRules: rules
    }));
  };

  // Order status updates with automatic notifications
  const updateOrderStatusWithNotification = (
    orderId: string, 
    status: OrderStatus, 
    notifyChannel?: 'email' | 'whatsapp' | 'both' | 'none',
    customMessage?: string,
    cancelReason?: string
  ) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          ...(cancelReason ? { cancelReason } : {}),
          lastNotifyChannel: notifyChannel || 'none'
        };
      }
      return o;
    }));

    const matchingOrder = orders.find(o => o.id === orderId);
    if (!matchingOrder) return;

    if (notifyChannel && notifyChannel !== 'none') {
      let defaultMsg = '';
      if (status === 'packing') {
        defaultMsg = `Hello ${matchingOrder.customerName},\n\nYour order #${matchingOrder.id} has been accepted and is currently being prepared.\n\nWe will notify you again once it is ready for collection or delivery.\n\nThank you for shopping with Decent Collection.`;
      } else if (status === 'completed') {
        defaultMsg = `Hello ${matchingOrder.customerName},\n\nGood news! Your order #${matchingOrder.id} has been completed successfully.\n\nThank you for shopping with Decent Collection. We look forward to serving you again!`;
      } else if (status === 'cancelled') {
        defaultMsg = `Hello ${matchingOrder.customerName},\n\nWe regret to inform you that your order #${matchingOrder.id} has been cancelled.\n\nReason: ${cancelReason || 'Administrative update'}\n\nIf you need assistance, please contact us at 0729445172.`;
      } else {
        defaultMsg = `Hello ${matchingOrder.customerName},\n\nYour order #${matchingOrder.id} status has been updated to: ${status.toUpperCase()}.\n\nThank you for choosing Decent Collection.`;
      }

      const finalMessage = customMessage ? `${customMessage}\n\n${defaultMsg}` : defaultMsg;

      const notif: NotificationRecord = {
        id: `ord_notif_${Date.now()}`,
        recipientName: matchingOrder.customerName,
        recipientEmail: matchingOrder.email,
        recipientPhone: matchingOrder.customerPhone,
        channel: notifyChannel === 'both' ? 'both' : (notifyChannel === 'whatsapp' ? 'whatsapp' : 'email'),
        subject: `Order #${matchingOrder.id} Status Update - Decent Collection`,
        message: finalMessage,
        sentDate: new Date().toLocaleString(),
        status: 'delivered',
        sentBy: 'Esther Njoki Mbugua'
      };

      setNotificationHistory(prev => [notif, ...prev]);
    }
  };

  const addOrderMessage = (orderId: string, sender: 'customer' | 'admin', senderName: string, text: string) => {
    const newMsg: OrderMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      sender,
      senderName,
      text,
      timestamp: new Date().toLocaleString()
    };

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          messages: [...(o.messages || []), newMsg]
        };
      }
      return o;
    }));
  };

  const toggleVipStatus = (customerId: string, status?: 'active' | 'inactive') => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const nextIsVip = status ? status === 'active' : !c.isVip;
        const nextVipStatus = status || (nextIsVip ? 'active' : 'inactive');
        return {
          ...c,
          isVip: nextIsVip,
          vipStatus: nextVipStatus,
          vipJoinedDate: c.vipJoinedDate || new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
  };

  const grantVipStatus = (customerId: string, notes?: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          isVip: true,
          vipStatus: 'active',
          vipJoinedDate: c.vipJoinedDate || new Date().toISOString().split('T')[0],
          vipNotes: notes || c.vipNotes || 'VIP Status Granted by Super Administrator'
        };
      }
      return c;
    }));
  };

  const removeVipStatus = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          isVip: false,
          vipStatus: 'inactive'
        };
      }
      return c;
    }));
  };

  const addVipMember = (data: Partial<Customer>): Customer => {
    const newCust: Customer = {
      id: `c_${Date.now()}`,
      name: data.name || 'VIP Member',
      email: data.email || '',
      phone: data.phone || '',
      totalOrders: data.totalOrders || 0,
      totalSpent: data.totalSpent || 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      isVip: true,
      vipJoinedDate: new Date().toISOString().split('T')[0],
      vipStatus: 'active',
      vipNotes: data.vipNotes || 'Joined Decent VIP Club',
      preferredCategories: data.preferredCategories || ['suits', 'shoes'],
      birthday: data.birthday || ''
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomerDetails = (customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...updates } : c));
  };

  const sendVipCommunication = (comm: Omit<VIPCommunication, 'id' | 'sentDate'>) => {
    const newComm: VIPCommunication = {
      ...comm,
      id: `comm_${Date.now()}`,
      sentDate: new Date().toLocaleString(),
      status: 'sent',
      sentBy: settings.adminName || 'Esther Njoki Mbugua'
    };
    setVipCommunications(prev => [newComm, ...prev]);
  };

  const addOffer = (offerData: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: `of_${Date.now()}`
    };
    setOffers(prev => [newOffer, ...prev]);
  };

  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setReviews(INITIAL_REVIEWS);
    setBranches(INITIAL_BRANCHES);
    setOffers(INITIAL_OFFERS);
    setMessages(INITIAL_MESSAGES);
    setSettings(INITIAL_SETTINGS);
    setMpesaTransactions([]);
    setActiveStkPush(null);
    setShowPhoneSimulator(false);
    setCart([]);
    setWishlistIds([]);
    localStorage.clear();
  };

  return (
    <StoreContext.Provider
      value={{
        viewMode, setViewMode,
        activeAdminTab, setActiveAdminTab,
        isLoggedIn, loginAdmin, logoutAdmin,
        products, orders, customers, reviews, branches, offers, messages, settings,
        mpesaTransactions, activeStkPush, showPhoneSimulator, setShowPhoneSimulator,
        
        currentCustomer, registerCustomer, verifyCustomerOTP, resendCustomerOTP,
        manuallyVerifyCustomer, deleteCustomer, loginCustomer, logoutCustomer,
        requestPasswordReset, resetPassword,

        cart, wishlistIds, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist,
        searchQuery, setSearchQuery, activeCategory, setActiveCategory,
        
        vipCommunications, emailTemplates, notificationHistory, subscribeVIPClub,
        toggleVipStatus, grantVipStatus, removeVipStatus, approveVIPRecommendation, declineVIPRecommendation,
        addVipMember, updateCustomerDetails, sendVIPNotificationMultiChannel, saveVIPRules,

        addOffer, updateOffer, deleteOffer,
        addProduct, updateProduct, deleteProduct, updateStock, createOrder, updateOrderStatus,
        updateOrderStatusWithNotification, addOrderMessage,
        markMessageRead, updateSettings, switchBranch, resetToDefaults,
        triggerStkPush, updateMpesaTransactionStatus, clearActiveStkPush
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
