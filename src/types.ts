export type CategoryType = 'shoes' | 'suits' | 'shirts' | 'jeans' | 'accessories' | 'jackets' | 'women' | 'kids' | 'sportswear' | string;

export interface CategoryItemConfig {
  id: string;
  name: string;
  icon: string;
  image?: string;
  hidden?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  price: number; // Selling Price in KSh
  discountPrice?: number;
  costPrice: number; // Buying Price / Cost Price in KSh
  rating: number;
  reviewsCount: number;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isOffer?: boolean;
  stock: number;
  lowStockThreshold: number;
  sizes: string[];
  colors: string[];
  description: string;
  branchId?: string;
  quantityPurchased?: number;
  quantitySold?: number;
  supplier?: string;
  purchaseDate?: string;
  archived?: boolean;
}

export interface CategoryItem {
  id: CategoryType;
  name: string;
  iconName: string;
  count: number;
}

export type OrderStatus = 'new' | 'packing' | 'delivery' | 'completed' | 'cancelled' | 'declined';
export type PaymentMethod = 'mpesa' | 'bank' | 'cash';

export type MpesaStkPushStatus = 
  | 'idle'
  | 'waiting'
  | 'sent'
  | 'entering_pin'
  | 'processing'
  | 'paid'
  | 'cancelled'
  | 'failed';

export interface MpesaTransaction {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: MpesaStkPushStatus;
  mpesaReceiptNumber?: string;
  checkoutRequestId: string;
  merchantRequestId: string;
  timestamp: string;
  failureReason?: string;
  itemsSummary?: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  sender: 'customer' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  email: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  mpesaCode?: string;
  date: string;
  branchId: string;
  orderNotes?: string;
  cancelReason?: string;
  messages?: OrderMessage[];
  lastNotifyChannel?: 'email' | 'whatsapp' | 'both' | 'none';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status?: 'active' | 'suspended';
  
  // 📧 Email Verification & OTP Attributes
  emailVerified?: boolean;
  verificationCode?: string; // 6-digit OTP e.g. "834271"
  otpExpiresAt?: string; // ISO string
  emailVerifiedAt?: string;
  passwordHash?: string;
  whatsappOptIn?: boolean;

  // ⭐ VIP Member & Loyalty Recommendation Attributes
  isVip?: boolean;
  vipCode?: string; // e.g. VIP-000001
  vipJoinedDate?: string;
  vipStatus?: 'active' | 'inactive';
  vipNotes?: string;
  vipRecommendationStatus?: 'pending' | 'eligible' | 'approved' | 'declined' | 'reviewed';
  vipApprovedBy?: string;
  vipApprovedDate?: string;
  preferredCategories?: string[];
  firstPurchaseDate?: string;
  lastPurchaseDate?: string;
  monthsActive?: number;
  birthday?: string;
  emailsReceivedCount?: number;
  lastEmailSentDate?: string;
}

export interface NotificationRecord {
  id: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: 'email' | 'whatsapp' | 'both';
  subject?: string;
  message: string;
  sentDate: string;
  status: 'sent' | 'delivered' | 'failed' | 'scheduled';
  attachments?: string[];
  templateName?: string;
  vipId?: string;
  sentBy?: string;
}

export interface VIPRuleSettings {
  minMonthsActive: number; // e.g., 3 or 4
  minCompletedOrders: number; // e.g., 10
  minTotalSpent: number; // e.g., 50000 KSh
  approvalType: 'manual' | 'automatic'; // default 'manual'
  autoSendWelcomeEmail: boolean;
  autoSendWhatsAppWelcome: boolean;
}

export interface VIPCommunication {
  id: string;
  subject: string;
  body: string;
  recipientType: 'all' | 'selected' | 'single';
  recipientNames?: string[];
  recipientEmails?: string[];
  sentDate: string;
  status: 'sent' | 'delivered' | 'failed' | 'scheduled' | 'draft';
  sentBy?: string;
  attachmentName?: string;
  imageUrl?: string;
  templateType?: string;
  scheduledDate?: string;
  senderEmail?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  icon: string;
  subject: string;
  body: string;
  category: 'welcome' | 'products' | 'offers' | 'holidays' | 'clearance';
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city?: string;
  phone: string;
  email?: string;
  manager: string;
  openingHours?: string;
  status?: 'Open' | 'Closed' | 'Under Maintenance';
  imageUrl?: string;
  isMainBranch?: boolean;
  active: boolean;
}

export interface StockPurchasingRecord {
  id: string;
  productId: string;
  productName: string;
  category: CategoryType;
  supplier?: string;
  purchaseDate: string;
  quantityPurchased: number;
  buyingPrice: number;
  sellingPrice: number;
  notes?: string;
  imageUrl?: string;
  costValue: number;
  expectedSalesValue: number;
  expectedProfit: number;
}

export interface AuditLog {
  id: string;
  date: string;
  time: string;
  administratorName: string;
  action: string;
  details?: string;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  active: boolean;
  validUntil: string;
  isVipOnly?: boolean;
  type?: 'discount' | 'early_access' | 'exclusive' | 'limited_time' | 'birthday' | 'loyalty';
  description?: string;
  minimumSpend?: number;
}

export interface StoreMessage {
  id: string;
  senderName: string;
  senderPhone: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SlideshowItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  link?: string;
}

export interface DaySchedule {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface SocialAccounts {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  pinterest?: string;
  telegram?: string;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  currency: string; // e.g. "KSh"
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  mpesaTill: string;
  mpesaPaybill: string;
  bankAccount: string;
  instagram: string;
  facebook: string;
  tiktok?: string;
  activeBranchId: string;
  logoUrl?: string;
  heroBanners?: string[];
  slideshows?: SlideshowItem[];
  aboutUsTitle?: string;
  aboutUsText?: string;
  openingHours?: string;
  businessSchedule?: DaySchedule[];
  socialAccounts?: SocialAccounts;
  googleMapsUrl?: string;
  announcementText?: string;
  promoBannerText?: string;
  promoCode?: string;
  customCategories?: CategoryItemConfig[];
  isMaintenanceMode?: boolean;
  maintenanceMessage?: string;
  allowCustomerRegistration?: boolean;
  themeMode?: 'dark' | 'light';
  adminEmail?: string;
  adminPassword?: string;

  // Executive Personalization & Admin Workspace
  adminName?: string;
  adminTitle?: string;
  adminAvatarUrl?: string;
  adminWelcomeMessage?: string;
  pinnedAdminTabs?: string[];
  
  // Admin Workspace Background & Glassmorphism
  adminBgType?: 'wallpaper' | 'solid' | 'gradient' | 'pattern' | 'custom_image' | 'custom_video';
  adminBgValue?: string;
  adminGlassmorphism?: boolean;
  adminThemeMode?: 'dark' | 'light';

  // Theme Presets & Color Palette Customization
  themePreset?: 'luxury_gold' | 'classic_executive' | 'royal_navy' | 'emerald_prestige' | 'rose_gold' | 'custom';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  buttonStyle?: 'rounded' | 'pill' | 'sharp';
  cardStyle?: 'glass' | 'flat' | 'shadow' | 'bordered';
  enableAnimations?: boolean;
  enableRoundedCorners?: boolean;

  // Typography & Font Configuration
  headingFont?: 'Poppins' | 'Inter' | 'Montserrat' | 'DM Sans' | 'Manrope' | 'Outfit' | 'Playfair Display';
  bodyFont?: 'Poppins' | 'Inter' | 'Montserrat' | 'DM Sans' | 'Manrope' | 'Outfit';
  fontSizeScale?: 'compact' | 'normal' | 'spacious';
  letterSpacing?: 'normal' | 'wide' | 'wider';

  // Public Storefront Customization
  publicBgType?: 'default' | 'solid' | 'gradient' | 'pattern' | 'custom_image';
  publicBgValue?: string;
  categoryBgImage?: string;
  footerBgImage?: string;
  heroVideoUrl?: string;
  slideshowDuration?: number; // in seconds: 3, 5, 8, 10
  slideshowAutoPlay?: boolean;

  // Gmail & Email Marketing Integration
  gmailConnected?: boolean;
  connectedGmailAccount?: string;
  emailSignature?: string;
  replyToEmail?: string;
  autoWelcomeEmailEnabled?: boolean;

  // WhatsApp Business Integration
  whatsAppConnected?: boolean;
  connectedWhatsAppNumber?: string;

  // VIP Rules
  vipRules?: VIPRuleSettings;
}

export type ReportDateRange = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'custom';

export type ReportType = 
  | 'sales_excel'
  | 'profit_loss_excel'
  | 'inventory_excel'
  | 'stock_movement_excel'
  | 'business_performance_word'
  | 'executive_summary_word'
  | 'sales_summary_word'
  | 'inventory_audit_word'
  | 'customer_activity_word';
