import { Product, Order, Customer, Review, Branch, Offer, StoreMessage, ShopSettings, EmailTemplate, NotificationRecord } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Italian Leather Oxford Shoes',
    category: 'shoes',
    price: 6500,
    discountPrice: 5500,
    costPrice: 3500,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    stock: 18,
    lowStockThreshold: 5,
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
    colors: ['Black', 'Tan Brown', 'Dark Mahogany'],
    description: 'Handcrafted genuine Italian leather dress shoes with polished finish and cushioned inner sole. Perfect for formal business meetings and weddings.',
    branchId: 'b1',
    quantityPurchased: 30,
    quantitySold: 12
  },
  {
    id: 'p2',
    name: 'Executive Slim-Fit Navy Suit',
    category: 'suits',
    price: 18500,
    discountPrice: 16000,
    costPrice: 9800,
    rating: 5.0,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
    isBestSeller: true,
    isOffer: true,
    stock: 12,
    lowStockThreshold: 3,
    sizes: ['UK 38R', 'UK 40R', 'UK 42R', 'UK 44R', 'UK 46R'],
    colors: ['Navy Blue', 'Charcoal Grey', 'Midnight Black'],
    description: '2-Piece premium wool-blend executive suit featuring notched lapels, dual rear vents, and flat-front trousers.',
    branchId: 'b1',
    quantityPurchased: 20,
    quantitySold: 8
  },
  {
    id: 'p3',
    name: 'Egyptian Cotton Formal Shirt',
    category: 'shirts',
    price: 3200,
    costPrice: 1750,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    stock: 35,
    lowStockThreshold: 10,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Crisp White', 'Sky Blue', 'Light Pink', 'Black'],
    description: '100% long-staple Egyptian cotton shirt with non-iron technology, reinforced collar, and French cuffs.',
    branchId: 'b1',
    quantityPurchased: 50,
    quantitySold: 15
  },
  {
    id: 'p4',
    name: 'Premium Indigo Stretch Jeans',
    category: 'jeans',
    price: 4200,
    discountPrice: 3800,
    costPrice: 2100,
    rating: 4.7,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1542272604-780c36856842?q=80&w=800&auto=format&fit=crop',
    isBestSeller: true,
    stock: 24,
    lowStockThreshold: 8,
    sizes: ['30W/32L', '32W/32L', '34W/32L', '36W/34L', '38W/34L'],
    colors: ['Dark Indigo', 'Washed Blue', 'Jet Black'],
    description: 'Heavyweight elastane-infused denim offering superior comfort, structured silhouette, and minimal fade.',
    branchId: 'b1',
    quantityPurchased: 40,
    quantitySold: 16
  },
  {
    id: 'p5',
    name: 'Suede Penny Loafers',
    category: 'shoes',
    price: 5200,
    costPrice: 2800,
    rating: 4.9,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    stock: 4, // low stock trigger
    lowStockThreshold: 6,
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    colors: ['Camel Suede', 'Navy Suede', 'Olive Green'],
    description: 'Casual sophistication made with soft velvet suede, hand-stitched apron, and durable rubber driving sole.',
    branchId: 'b1',
    quantityPurchased: 15,
    quantitySold: 11
  },
  {
    id: 'p6',
    name: 'Royal Velvet Dinner Blazer',
    category: 'suits',
    price: 14500,
    discountPrice: 12900,
    costPrice: 7200,
    rating: 4.9,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    isOffer: true,
    stock: 7,
    lowStockThreshold: 3,
    sizes: ['UK 38R', 'UK 40R', 'UK 42R', 'UK 44R'],
    colors: ['Burgundy Wine', 'Emerald Green', 'Royal Navy'],
    description: 'Luxe velvet blazer crafted with silk satin shawl lapels, targeted for red-carpet events and galas.',
    branchId: 'b1',
    quantityPurchased: 12,
    quantitySold: 5
  },
  {
    id: 'p7',
    name: 'Designer Casual Linen Shirt',
    category: 'shirts',
    price: 2800,
    costPrice: 1400,
    rating: 4.6,
    reviewsCount: 22,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
    stock: 28,
    lowStockThreshold: 8,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Beige', 'White', 'Sage Green', 'Terracotta'],
    description: 'Breathable pure European flax linen button-down shirt designed for warm African climates.',
    branchId: 'b1',
    quantityPurchased: 35,
    quantitySold: 7
  },
  {
    id: 'p8',
    name: 'Luxury Reversible Leather Belt',
    category: 'accessories',
    price: 2500,
    costPrice: 1100,
    rating: 4.8,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
    isBestSeller: true,
    stock: 45,
    lowStockThreshold: 10,
    sizes: ['32"-36"', '36"-40"', '40"-44"'],
    colors: ['Black/Brown Reversible'],
    description: 'Dual-sided top grain cowhide leather belt with brushed gold rotatable buckle.',
    branchId: 'b1',
    quantityPurchased: 60,
    quantitySold: 15
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    customerName: 'David Kimani',
    customerPhone: '+254 712 345 678',
    email: 'dkimani@gmail.com',
    address: 'Kilimani, Ring Road Apartment 4B, Nairobi',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'EU 42',
        selectedColor: 'Black'
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 2,
        selectedSize: 'L',
        selectedColor: 'Crisp White'
      }
    ],
    totalAmount: 11900,
    status: 'new',
    paymentMethod: 'mpesa',
    mpesaCode: 'QFH8921J1X',
    date: '2026-07-24 10:15 AM',
    branchId: 'b1'
  },
  {
    id: 'ORD-8920',
    customerName: 'Joseph Ochieng',
    customerPhone: '+254 722 987 654',
    email: 'jochieng@yahoo.com',
    address: 'Westlands, Mpaka Road Suite 12, Nairobi',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedSize: 'UK 42R',
        selectedColor: 'Navy Blue'
      }
    ],
    totalAmount: 16000,
    status: 'packing',
    paymentMethod: 'mpesa',
    mpesaCode: 'QFG7723K9M',
    date: '2026-07-24 08:30 AM',
    branchId: 'b1'
  },
  {
    id: 'ORD-8918',
    customerName: 'Marcus Waithaka',
    customerPhone: '+254 733 445 566',
    email: 'marcus.w@gmail.com',
    address: 'Karen, Bogani Road Gate 7, Nairobi',
    items: [
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        selectedSize: '34W/32L',
        selectedColor: 'Dark Indigo'
      },
      {
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        selectedSize: '34"-36"',
        selectedColor: 'Black/Brown Reversible'
      }
    ],
    totalAmount: 6300,
    status: 'completed',
    paymentMethod: 'mpesa',
    mpesaCode: 'QFE5510P3A',
    date: '2026-07-23 04:45 PM',
    branchId: 'b1'
  },
  {
    id: 'ORD-8915',
    customerName: 'Brian Mutua',
    customerPhone: '+254 701 112 233',
    email: 'bmutua@hotmail.com',
    address: 'Parklands, 3rd Parklands Avenue, Nairobi',
    items: [
      {
        product: INITIAL_PRODUCTS[5],
        quantity: 1,
        selectedSize: 'UK 40R',
        selectedColor: 'Burgundy Wine'
      }
    ],
    totalAmount: 12900,
    status: 'completed',
    paymentMethod: 'bank',
    date: '2026-07-22 02:10 PM',
    branchId: 'b1'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'David Kimani',
    email: 'dkimani@gmail.com',
    phone: '+254 712 345 678',
    totalOrders: 5,
    totalSpent: 48500,
    joinedDate: '2026-01-15',
    status: 'active',
    isVip: true,
    vipJoinedDate: '2026-02-01',
    vipStatus: 'active',
    vipNotes: 'High-value buyer interested in Italian Leather footwear and executive ties.',
    preferredCategories: ['shoes', 'suits'],
    lastPurchaseDate: '2026-07-20',
    birthday: '1988-08-14'
  },
  {
    id: 'c2',
    name: 'Joseph Ochieng',
    email: 'jochieng@yahoo.com',
    phone: '+254 722 987 654',
    totalOrders: 3,
    totalSpent: 34200,
    joinedDate: '2026-02-10',
    status: 'active',
    isVip: false
  },
  {
    id: 'c3',
    name: 'Marcus Waithaka',
    email: 'marcus.w@gmail.com',
    phone: '+254 733 445 566',
    totalOrders: 8,
    totalSpent: 86400,
    joinedDate: '2025-11-04',
    status: 'active',
    isVip: true,
    vipJoinedDate: '2025-12-01',
    vipStatus: 'active',
    vipNotes: 'Platinum patron. Buys full executive suit sets and bespoke footwear for galas.',
    preferredCategories: ['suits', 'shoes', 'shirts'],
    lastPurchaseDate: '2026-07-22',
    birthday: '1982-11-20'
  },
  {
    id: 'c4',
    name: 'Brian Mutua',
    email: 'bmutua@hotmail.com',
    phone: '+254 701 112 233',
    totalOrders: 2,
    totalSpent: 22100,
    joinedDate: '2026-03-20',
    status: 'active',
    isVip: true,
    vipJoinedDate: '2026-04-05',
    vipStatus: 'active',
    vipNotes: 'Lover of stretch denim and casual linen button-down shirts.',
    preferredCategories: ['jeans', 'shirts'],
    lastPurchaseDate: '2026-06-18',
    birthday: '1992-05-10'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    productName: 'Italian Leather Oxford Shoes',
    customerName: 'David Kimani',
    rating: 5,
    comment: 'Top tier quality! Leather is smooth and comfortable right out of the box.',
    date: '2026-07-20'
  },
  {
    id: 'r2',
    productId: 'p2',
    productName: 'Executive Slim-Fit Navy Suit',
    customerName: 'Marcus Waithaka',
    rating: 5,
    comment: 'Fits like a bespoke tailor made it for me. I received so many compliments at my nephew wedding!',
    date: '2026-07-18'
  },
  {
    id: 'r3',
    productId: 'p4',
    productName: 'Premium Indigo Stretch Jeans',
    customerName: 'Joseph Ochieng',
    rating: 4,
    comment: 'Great flex and stretch. Delivery to Westlands was within 2 hours.',
    date: '2026-07-15'
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'Nairobi Flagship Store',
    code: 'NRB-CBD',
    address: 'Kimathi Street, Opposite Hilton, Nairobi CBD',
    city: 'Nairobi',
    phone: '+254 700 123 456',
    email: 'nairobi@decent.co.ke',
    manager: 'Esta Njoki Mbugua (Managing Director & Super Admin)',
    openingHours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 10:00 AM - 4:00 PM',
    status: 'Open',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    isMainBranch: true,
    active: true
  },
  {
    id: 'b2',
    name: 'Westlands Mall Branch',
    code: 'WST-02',
    address: 'Mwanzi Road, 1st Floor Shop 14, Westlands',
    city: 'Nairobi',
    phone: '+254 700 987 654',
    email: 'westlands@decent.co.ke',
    manager: 'Anthony Njuguna',
    openingHours: 'Mon - Sun: 9:00 AM - 9:00 PM',
    status: 'Open',
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop',
    isMainBranch: false,
    active: false
  },
  {
    id: 'b3',
    name: 'Mombasa City Outlet',
    code: 'MBA-01',
    address: 'Nkrumah Road Plaza, Ground Floor, Mombasa',
    city: 'Mombasa',
    phone: '+254 711 555 777',
    email: 'mombasa@decent.co.ke',
    manager: 'Faith Hassan',
    openingHours: 'Mon - Sat: 8:30 AM - 7:00 PM',
    status: 'Open',
    imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=800&auto=format&fit=crop',
    isMainBranch: false,
    active: false
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'of1',
    title: 'Mid-Year Gentlemens Special',
    code: 'DECENT15',
    discountPercent: 15,
    active: true,
    validUntil: '2026-08-31',
    isVipOnly: false,
    type: 'discount',
    description: 'Public discount for all general shoppers on orders above KSh 5,000.'
  },
  {
    id: 'of2',
    title: 'Footwear & Shoes Discount',
    code: 'SHOES10',
    discountPercent: 10,
    active: true,
    validUntil: '2026-08-15',
    isVipOnly: false,
    type: 'discount',
    description: 'Special 10% off on all men leather shoes & oxford footwear.'
  },
  {
    id: 'of3',
    title: '⭐ VIP Executive Black Tier Pass',
    code: 'VIPGOLD25',
    discountPercent: 25,
    active: true,
    validUntil: '2026-12-31',
    isVipOnly: true,
    type: 'exclusive',
    description: 'Exclusive 25% discount for verified VIP Members on all Italian suits and footwear.'
  },
  {
    id: 'of4',
    title: '⭐ VIP Birthday Celebration Code',
    code: 'VIPBIRTHDAY',
    discountPercent: 30,
    active: true,
    validUntil: '2026-12-31',
    isVipOnly: true,
    type: 'birthday',
    description: 'Special 30% Birthday Gift offer valid during the VIP member\'s birthday month.'
  }
];

export const INITIAL_MESSAGES: StoreMessage[] = [
  {
    id: 'm1',
    senderName: 'Samuel Kamau',
    senderPhone: '+254 720 111 222',
    message: 'Hello Decent Collection, do you have the Italian Oxford shoes in Size 43 in Nairobi CBD branch?',
    timestamp: 'Today, 09:40 AM',
    read: false
  },
  {
    id: 'm2',
    senderName: 'Peter Maina',
    senderPhone: '+254 735 999 000',
    message: 'Can I pay via M-Pesa Till number directly when picking up at Westlands branch?',
    timestamp: 'Yesterday, 03:15 PM',
    read: true
  }
];

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'DECENT COLLECTION',
  tagline: 'Premium Men\'s Fashion & Footwear',
  currency: 'KSh',
  phone: '+254 700 123 456',
  whatsappNumber: '+254 700 123 456',
  email: 'info@decentcollection.co.ke',
  address: 'Kimathi Street, Opposite Hilton Hotel, Nairobi CBD, Kenya',
  mpesaTill: '892100',
  mpesaPaybill: '400200',
  bankAccount: 'KCB Bank - Acc: 1100223344',
  instagram: '@decent_collection_ke',
  facebook: 'Decent Collection Fashion',
  tiktok: '@decentcollection_official',
  activeBranchId: 'b1',
  logoUrl: '',
  heroBanners: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop'
  ],
  slideshows: [
    {
      id: 'sl1',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
      title: 'LUXURY EXECUTIVE SUITS & BLAZERS',
      subtitle: 'Bespoke European Cut • 100% Fine Wool Blend',
      buttonText: 'SHOP SUITS NOW'
    },
    {
      id: 'sl2',
      imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1600&auto=format&fit=crop',
      title: 'AUTHENTIC ITALIAN LEATHER FOOTWEAR',
      subtitle: 'Polished Oxfords, Penny Loafers & Dress Boots',
      buttonText: 'BROWSE FOOTWEAR'
    },
    {
      id: 'sl3',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1600&auto=format&fit=crop',
      title: 'EGYPTIAN COTTON FORMAL SHIRTS',
      subtitle: 'Non-Iron Technology • Tailored Executive Fit',
      buttonText: 'VIEW SHIRTS'
    }
  ],
  aboutUsTitle: 'Crafted for Style, Built for Comfort',
  aboutUsText: 'Founded in Nairobi CBD, Decent Collection was established with a singular vision: bringing world-class European men\'s fashion and authentic Italian leather footwear directly to Kenyan gentlemen. Every pair of shoes, suit, and shirt in our collection is handpicked for superior craftsmanship, breathable fabric, and impeccable fit.',
  openingHours: 'Monday - Saturday: 8:00 AM - 8:00 PM | Sunday: 10:00 AM - 4:00 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Kimathi+Street+Nairobi',
  announcementText: '🔥 FREE Nairobi Same-Day Delivery on orders over KSh 10,000! Pay securely via Safaricom M-Pesa STK Push.',
  promoBannerText: 'Mid-Year Gentlemen\'s Luxury Sale - Get up to 15% off select Italian Leather Footwear and Executive Suits.',
  promoCode: 'DECENT15',
  customCategories: [
    { id: 'shoes', name: 'Shoes & Footwear', icon: '👞', hidden: false },
    { id: 'suits', name: 'Executive Suits', icon: '👔', hidden: false },
    { id: 'shirts', name: 'Shirts & Tops', icon: '👕', hidden: false },
    { id: 'jeans', name: 'Jeans & Trousers', icon: '👖', hidden: false },
    { id: 'accessories', name: 'Leather Accessories', icon: '💼', hidden: false },
    { id: 'women', name: 'Women\'s Collection', icon: '👗', hidden: false },
    { id: 'kids', name: 'Kids & Boys Wear', icon: '👦', hidden: false },
    { id: 'sportswear', name: 'Sportswear & Golf', icon: '⛳', hidden: false }
  ],
  isMaintenanceMode: false,
  maintenanceMessage: 'Decent Collection is currently undergoing scheduled inventory updates and maintenance. We will be back online shortly!',
  allowCustomerRegistration: true,
  themeMode: 'dark',
  adminEmail: 'manager@decentcollection.co.ke',
  adminPassword: 'admin',

  // Executive Personalization
  adminName: 'Esther Njoki Mbugua',
  adminTitle: 'Super Administrator & Founder',
  adminAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  adminWelcomeMessage: 'Welcome Esther Njoki Mbugua. Your Decent Collection Executive Portal is fully operational.',
  pinnedAdminTabs: ['dashboard', 'orders', 'products', 'reports', 'payments'],

  // Business Hours & Dropdown Schedule
  businessSchedule: [
    { day: 'Monday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
    { day: 'Tuesday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
    { day: 'Wednesday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
    { day: 'Thursday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
    { day: 'Friday', openTime: '08:00 AM', closeTime: '06:00 PM', isClosed: false },
    { day: 'Saturday', openTime: '09:00 AM', closeTime: '05:00 PM', isClosed: false },
    { day: 'Sunday', openTime: '10:00 AM', closeTime: '04:00 PM', isClosed: true }
  ],

  // Social Media Accounts
  socialAccounts: {
    whatsapp: '+254712345678',
    facebook: 'decentcollectionke',
    instagram: 'decentcollection.co.ke',
    tiktok: '@decentcollection',
    youtube: 'DecentCollectionOfficial',
    twitter: '@decent_ke',
    linkedin: 'decent-collection-kenya',
    pinterest: 'decentcollection',
    telegram: 'decentcollectionke'
  },

  // Workspace Background & Visual Style
  adminBgType: 'wallpaper',
  adminBgValue: 'dark_marble',
  adminGlassmorphism: true,
  adminThemeMode: 'dark',

  // Theme Presets & Palette
  themePreset: 'luxury_gold',
  primaryColor: '#D4AF37',
  secondaryColor: '#1A1A1A',
  accentColor: '#F3E5AB',
  buttonStyle: 'rounded',
  cardStyle: 'glass',
  enableAnimations: true,
  enableRoundedCorners: true,

  // Typography & Fonts
  headingFont: 'Poppins',
  bodyFont: 'Inter',
  fontSizeScale: 'normal',
  letterSpacing: 'wide',

  // Storefront Public Backgrounds & Slideshow Engine
  publicBgType: 'default',
  publicBgValue: '#111111',
  categoryBgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
  footerBgImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop',
  slideshowDuration: 5,
  slideshowAutoPlay: true,

  // Gmail & WhatsApp Integration
  gmailConnected: true,
  connectedGmailAccount: 'decentcollection@gmail.com',
  emailSignature: 'Esther Njoki Mbugua\nSuper Administrator\nDecent Collection Kenya',
  replyToEmail: 'decentcollection@gmail.com',
  autoWelcomeEmailEnabled: true,
  whatsAppConnected: true,
  connectedWhatsAppNumber: '+254729445172'
};

export const INITIAL_VIP_RULES = {
  minMonthsActive: 3,
  minCompletedOrders: 3,
  minTotalSpent: 30000,
  approvalType: 'manual' as const,
  autoSendWelcomeEmail: true,
  autoSendWhatsAppWelcome: true
};

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 't1',
    name: '🎉 Welcome Email',
    icon: '🎉',
    category: 'welcome',
    subject: '🎉 Welcome to the Decent Collection VIP Club',
    body: `Hello {{Customer Name}},\n\nWelcome to the Decent Collection VIP Club!\n\nThank you for subscribing.\n\nAs one of our VIP Members, you will receive:\n✅ Exclusive Discounts\n✅ New Product Arrivals\n✅ Flash Sales\n✅ Holiday Offers\n✅ VIP Promotions\n\nWe look forward to serving you.\n\nKind regards,\nEsther Njoki Mbugua\nSuper Administrator\nDecent Collection`
  },
  {
    id: 't2',
    name: '🛍 New Arrivals',
    icon: '🛍',
    category: 'products',
    subject: '✨ Exclusive VIP Preview: New Arrivals Collection',
    body: `Hello {{Customer Name}},\n\nWe are excited to announce that our latest European menswear and Italian footwear arrivals have landed in shop!\n\n✔ Premium Italian Suits\n✔ Authentic Leather Oxfords & Loafers\n✔ Non-Iron Executive Cotton Shirts\n\nVisit our Nairobi CBD shop or order online with free same-day delivery.\n\nThank you for being a valued VIP Member.\n\nDecent Collection`
  },
  {
    id: 't3',
    name: '🔥 Weekend VIP Sale',
    icon: '🔥',
    category: 'offers',
    subject: '🔥 Weekend VIP Offer - Special Member Discounts',
    body: `Hello {{Customer Name}},\n\nThis weekend only!\n\nEnjoy exclusive discounts on our latest premium collection.\n\n✔ Premium Suits\n✔ Designer Shoes\n✔ New Arrivals\n\nVisit our shop today or place your order online.\n\nThank you for being a VIP Member.\n\nDecent Collection`
  },
  {
    id: 't4',
    name: '🎄 Holiday Offers',
    icon: '🎄',
    category: 'holidays',
    subject: '🎄 Holiday VIP Exclusive Promotions & Gift Collections',
    body: `Hello {{Customer Name}},\n\nCelebrate the season in style with Decent Collection!\n\nAs a VIP Member, take advantage of 20% off all complete executive suit and leather shoe packages.\n\nOrder today for guaranteed holiday delivery.\n\nWarm regards,\nEsther Njoki Mbugua`
  },
  {
    id: 't5',
    name: '🎁 Birthday Offer',
    icon: '🎁',
    category: 'offers',
    subject: '🎁 Happy Birthday from Decent Collection!',
    body: `Happy Birthday {{Customer Name}}!\n\nTo celebrate your special day, Decent Collection is gifting you an exclusive KSh 2,500 voucher on your next purchase.\n\nUse code: VIPBIRTHDAY at checkout or mention it in shop.\n\nCheers to elegance,\nDecent Collection`
  },
  {
    id: 't6',
    name: '👞 New Shoes',
    icon: '👞',
    category: 'products',
    subject: '👞 Authentic Italian Leather Footwear - Just Arrived',
    body: `Hello {{Customer Name}},\n\nStep out in confidence with our newly stocked handcrafted Italian Leather Oxfords, Penny Loafers, and Chelsea Boots.\n\nComplimentary leather care kit included with every pair this week.\n\nDecent Collection`
  },
  {
    id: 't7',
    name: '👔 New Suits',
    icon: '👔',
    category: 'products',
    subject: '👔 Executive Wool & Linen Suits Collection',
    body: `Hello {{Customer Name}},\n\nUpgrade your wardrobe with our latest tailored double-breasted and slim-fit 3-piece suits.\n\nComplimentary tailoring adjustment included for all VIP members.\n\nDecent Collection`
  },
  {
    id: 't8',
    name: '💰 Clearance Sale',
    icon: '💰',
    category: 'clearance',
    subject: '💰 VIP Early Access: End of Season Clearance',
    body: `Hello {{Customer Name}},\n\nGet up to 40% off remaining seasonal stock before public access opens.\n\nLimited sizes available. Shop early to secure your items.\n\nDecent Collection`
  }
];

export const INITIAL_NOTIFICATION_HISTORY: NotificationRecord[] = [
  {
    id: 'n1',
    recipientName: 'David Kimani',
    recipientEmail: 'dkimani@gmail.com',
    recipientPhone: '+254 712 345 678',
    channel: 'email',
    subject: '🎉 Welcome to the Decent Collection VIP Club',
    message: 'Welcome to the Decent Collection VIP Club! Thank you for subscribing.',
    sentDate: '2026-07-24 10:15 AM',
    status: 'delivered',
    templateName: '🎉 Welcome Email',
    vipId: 'VIP-000001',
    sentBy: 'Esther Njoki Mbugua'
  },
  {
    id: 'n2',
    recipientName: 'Marcus Waithaka',
    recipientEmail: 'marcus.w@gmail.com',
    recipientPhone: '+254 733 445 566',
    channel: 'both',
    subject: '🔥 Weekend VIP Offer - Special Member Discounts',
    message: '🔥 Weekend VIP Offer! Enjoy exclusive discounts on suits & shoes.',
    sentDate: '2026-07-23 03:30 PM',
    status: 'delivered',
    templateName: '🔥 Weekend VIP Sale',
    vipId: 'VIP-000002',
    sentBy: 'Esther Njoki Mbugua'
  }
];
