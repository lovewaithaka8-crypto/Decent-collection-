import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
  AlignmentType, WidthType, HeadingLevel, BorderStyle 
} from 'docx';
import { Product, Order, Customer, ShopSettings, ReportDateRange } from '../types';

export interface FilteredData {
  filteredOrders: Order[];
  filteredProducts: Product[];
  totalSales: number;
  totalCost: number;
  totalProfit: number;
  dateLabel: string;
}

export function filterDataByDateRange(
  orders: Order[],
  products: Product[],
  dateRange: ReportDateRange,
  customStartDate?: string,
  customEndDate?: string
): FilteredData {
  const now = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let dateLabel = '';

  switch (dateRange) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      dateLabel = `Today (${now.toLocaleDateString()})`;
      break;
    case 'yesterday':
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      dateLabel = `Yesterday (${startDate.toLocaleDateString()})`;
      break;
    case 'this_week':
      const dayOfWeek = now.getDay();
      startDate.setDate(now.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      dateLabel = `This Week (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;
      break;
    case 'last_week':
      const lastWeekNow = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastWeekDay = lastWeekNow.getDay();
      startDate = new Date(lastWeekNow);
      startDate.setDate(lastWeekNow.getDate() - lastWeekDay);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      dateLabel = `Last Week (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`;
      break;
    case 'this_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      dateLabel = `This Month (${now.toLocaleString('default', { month: 'long', year: 'numeric' })})`;
      break;
    case 'last_month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      dateLabel = `Last Month (${startDate.toLocaleString('default', { month: 'long', year: 'numeric' })})`;
      break;
    case 'custom':
      if (customStartDate) startDate = new Date(customStartDate);
      if (customEndDate) endDate = new Date(customEndDate);
      dateLabel = `Custom Range (${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()})`;
      break;
    default:
      startDate = new Date(0);
      dateLabel = 'All Time Record';
  }

  // Filter orders by date range
  const filteredOrders = orders.filter(o => {
    const orderDate = new Date(o.date);
    if (isNaN(orderDate.getTime())) return true; // Keep default mock orders
    return orderDate >= startDate && orderDate <= endDate;
  });

  // Calculate total revenue, cost, profit
  let totalSales = 0;
  let totalCost = 0;

  filteredOrders.forEach(ord => {
    totalSales += ord.totalAmount;
    ord.items.forEach(item => {
      const buyingPrice = item.product.costPrice || (item.product.price * 0.55);
      totalCost += buyingPrice * item.quantity;
    });
  });

  const totalProfit = totalSales - totalCost;

  return {
    filteredOrders,
    filteredProducts: products,
    totalSales,
    totalCost,
    totalProfit,
    dateLabel
  };
}

// ---------------------------------------------------------------------------
// 1. EXCEL REPORT GENERATOR (.xlsx)
// ---------------------------------------------------------------------------
export function generateExcelSalesReport(
  settings: ShopSettings,
  data: FilteredData,
  reportTitle: string = 'Sales & Financial Audit Report'
) {
  const currency = settings.currency || 'KSh';
  const now = new Date().toLocaleString();

  // Header metadata rows
  const headerRows = [
    [settings.shopName.toUpperCase()],
    [settings.tagline || 'Official Business Financial Record'],
    [settings.address],
    [`Report Title: ${reportTitle}`],
    [`Period Covered: ${data.dateLabel}`],
    [`Generated On: ${now}`],
    [`Prepared By: Store Manager (Super Admin)`],
    [] // Empty row
  ];

  // Sales Transactions Table
  const salesHeaders = [
    'Receipt / Order ID',
    'Customer Name',
    'Phone Number',
    'Date & Time',
    'Payment Method',
    'M-Pesa Code',
    'Items Summary',
    `Total Amount (${currency})`,
    'Status'
  ];

  const salesRows = data.filteredOrders.map(o => [
    o.id,
    o.customerName,
    o.customerPhone,
    o.date,
    o.paymentMethod.toUpperCase(),
    o.mpesaCode || 'N/A',
    o.items.map(i => `${i.product.name} (x${i.quantity})`).join(', '),
    o.totalAmount,
    o.status.toUpperCase()
  ]);

  // Product Financial & Profit Breakdown Table
  const profitHeaders = [
    'Product ID',
    'Product Name',
    'Category',
    `Buying Price (${currency})`,
    `Selling Price (${currency})`,
    `Profit / Item (${currency})`,
    'Current Stock',
    'Units Sold in Period',
    `Total Sales Revenue (${currency})`,
    `Total Buying Cost (${currency})`,
    `Net Profit Generated (${currency})`
  ];

  const profitRows = data.filteredProducts.map(p => {
    const buying = p.costPrice || (p.price * 0.55);
    const selling = p.discountPrice || p.price;
    const profitPerItem = selling - buying;

    // Calculate units sold in filtered orders
    let unitsSold = 0;
    data.filteredOrders.forEach(o => {
      o.items.forEach(i => {
        if (i.product.id === p.id) unitsSold += i.quantity;
      });
    });

    const totalRev = selling * unitsSold;
    const totalCost = buying * unitsSold;
    const netProfit = profitPerItem * unitsSold;

    return [
      p.id,
      p.name,
      p.category.toUpperCase(),
      buying,
      selling,
      profitPerItem,
      p.stock,
      unitsSold,
      totalRev,
      totalCost,
      netProfit
    ];
  });

  // Summary Totals Block
  const summaryRows = [
    [],
    ['FINANCIAL PERFORMANCE SUMMARY'],
    ['Total Sales Revenue:', `${currency} ${data.totalSales.toLocaleString()}`],
    ['Total Cost of Goods Sold (COGS):', `${currency} ${data.totalCost.toLocaleString()}`],
    ['Gross Operating Profit:', `${currency} ${data.totalProfit.toLocaleString()}`],
    ['Profit Margin (%):', data.totalSales > 0 ? `${((data.totalProfit / data.totalSales) * 100).toFixed(2)}%` : '0%']
  ];

  // Build sheet data array
  const fullSheetData = [
    ...headerRows,
    salesHeaders,
    ...salesRows,
    [],
    ['PRODUCT PROFITABILITY BREAKDOWN'],
    profitHeaders,
    ...profitRows,
    ...summaryRows
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(fullSheetData);

  // Formatting column widths
  worksheet['!cols'] = [
    { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 20 },
    { wch: 16 }, { wch: 16 }, { wch: 35 }, { wch: 18 }, { wch: 14 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales & Financial Audit');

  const fileName = `${settings.shopName.replace(/\s+/g, '_')}_Financial_Report_${Date.now()}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

// ---------------------------------------------------------------------------
// 2. WORD EXECUTIVE DOCUMENT GENERATOR (.docx)
// ---------------------------------------------------------------------------
export async function generateWordBusinessReport(
  settings: ShopSettings,
  data: FilteredData,
  reportTitle: string = 'Executive Business Performance & Audit Summary'
) {
  const currency = settings.currency || 'KSh';
  const now = new Date().toLocaleString();

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header / Brand Title
          new Paragraph({
            text: settings.shopName.toUpperCase(),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: settings.tagline || 'Premium Fashion & Retail Enterprise',
                italics: true,
                size: 20,
                color: 'D4AF37'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),

          // Metadata Table / Box
          new Paragraph({
            children: [
              new TextRun({ text: `DOCUMENT TITLE: `, bold: true }),
              new TextRun({ text: reportTitle })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `PERIOD COVERED: `, bold: true }),
              new TextRun({ text: data.dateLabel })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `DATE GENERATED: `, bold: true }),
              new TextRun({ text: now })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `PREPARED BY: `, bold: true }),
              new TextRun({ text: `Store Manager (Super Administrator)` })
            ],
            spacing: { after: 300 }
          }),

          // 1. EXECUTIVE SUMMARY
          new Paragraph({
            text: '1. EXECUTIVE SUMMARY',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This report presents a formal business evaluation for ${settings.shopName} during the period of ${data.dateLabel}. Total gross sales revenue recorded amounted to `
              }),
              new TextRun({
                text: `${currency} ${data.totalSales.toLocaleString()}`,
                bold: true
              }),
              new TextRun({
                text: `, with a total estimated Cost of Goods Sold (COGS) of `
              }),
              new TextRun({
                text: `${currency} ${data.totalCost.toLocaleString()}`,
                bold: true
              }),
              new TextRun({
                text: `. Net operational profit achieved is calculated at `
              }),
              new TextRun({
                text: `${currency} ${data.totalProfit.toLocaleString()}`,
                bold: true,
                color: '008000'
              }),
              new TextRun({
                text: `, yielding a healthy operational profit margin.`
              })
            ],
            spacing: { after: 250 }
          }),

          // 2. FINANCIAL METRICS SUMMARY TABLE
          new Paragraph({
            text: '2. KEY FINANCIAL PERFORMANCE METRICS',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 }
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Financial Metric', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Value (${currency})`, bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Gross Revenue' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${currency} ${data.totalSales.toLocaleString()}` })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Cost of Goods Sold (COGS)' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${currency} ${data.totalCost.toLocaleString()}` })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Net Operating Profit', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${currency} ${data.totalProfit.toLocaleString()}`, bold: true })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Completed Transactions' })] }),
                  new TableCell({ children: [new Paragraph({ text: `${data.filteredOrders.length} Orders` })] })
                ]
              })
            ]
          }),

          // 3. INVENTORY & STOCK ANALYSIS
          new Paragraph({
            text: '3. INVENTORY & STOCK AUDIT',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `The active catalog comprises ${data.filteredProducts.length} product lines across men's footwear, suits, shirts, jeans, and luxury accessories. Low stock items requiring restocking attention include: `
              }),
              new TextRun({
                text: data.filteredProducts.filter(p => p.stock <= p.lowStockThreshold).map(p => `${p.name} (${p.stock} left)`).join(', ') || 'All stock levels are currently healthy.',
                italics: true
              })
            ],
            spacing: { after: 250 }
          }),

          // 4. STRATEGIC RECOMMENDATIONS
          new Paragraph({
            text: '4. STRATEGIC RECOMMENDATIONS FOR MANAGEMENT',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Inventory Replenishment: ', bold: true }),
              new TextRun({ text: 'Prioritize reordering high-margin products such as Italian Oxford Shoes and Executive Suits before stock depletion.' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Digital M-Pesa Payment Optimization: ', bold: true }),
              new TextRun({ text: 'Safaricom M-Pesa continues to account for over 85% of total sales receipts. Maintain smooth STK push services.' })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Marketing Promotions: ', bold: true }),
              new TextRun({ text: 'Continue promotional campaigns using promo codes such as DECENT15 to sustain customer acquisition.' })
            ],
            spacing: { after: 300 }
          }),

          // Sign-off block
          new Paragraph({
            text: '______________________________________',
            spacing: { before: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Approved & Signed By: ', bold: true }),
              new TextRun({ text: 'Store Owner / Managing Director' })
            ],
            spacing: { after: 50 }
          }),
          new Paragraph({
            text: settings.shopName,
            spacing: { after: 100 }
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${settings.shopName.replace(/\s+/g, '_')}_Business_Summary_${Date.now()}.docx`;
  saveAs(blob, fileName);
}

// ==========================================
// ⭐ VIP CUSTOMERS EXCEL REPORT GENERATOR
// ==========================================
export function generateExcelVipReport(
  settings: ShopSettings,
  vipCustomers: Customer[]
) {
  const wb = XLSX.utils.book_new();

  // Summary Row
  const totalSpent = vipCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrders = vipCustomers.reduce((acc, c) => acc + c.totalOrders, 0);

  const reportRows = [
    ['STORE NAME:', settings.shopName],
    ['REPORT TITLE:', '⭐ VIP CUSTOMER CLUB MEMBERSHIP DIRECTORY'],
    ['GENERATED DATE:', new Date().toLocaleString()],
    ['TOTAL VIP MEMBERS:', vipCustomers.length],
    ['TOTAL VIP REVENUE:', `${settings.currency || 'KSh'} ${totalSpent.toLocaleString()}`],
    ['TOTAL VIP ORDERS:', totalOrders],
    [],
    [
      'Customer ID',
      'Full Name',
      'Email Address',
      'Phone Number',
      'VIP Join Date',
      'VIP Status',
      'Total Orders',
      `Total Spent (${settings.currency || 'KSh'})`,
      'Last Purchase Date',
      'Preferred Categories',
      'Notes'
    ],
    ...vipCustomers.map(c => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.vipJoinedDate || c.joinedDate,
      (c.vipStatus || 'active').toUpperCase(),
      c.totalOrders,
      c.totalSpent,
      c.lastPurchaseDate || 'N/A',
      (c.preferredCategories || []).join(', ') || 'General Fashion',
      c.vipNotes || 'VIP Club Member'
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(reportRows);
  ws['!cols'] = [
    { wch: 12 },
    { wch: 22 },
    { wch: 25 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 25 },
    { wch: 35 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'VIP Members');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = `${settings.shopName.replace(/\s+/g, '_')}_VIP_Customers_${Date.now()}.xlsx`;
  saveAs(dataBlob, fileName);
}

// ==========================================
// ⭐ VIP CUSTOMERS WORD REPORT GENERATOR
// ==========================================
export async function generateWordVipReport(
  settings: ShopSettings,
  vipCustomers: Customer[]
) {
  const totalSpent = vipCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrders = vipCustomers.reduce((acc, c) => acc + c.totalOrders, 0);
  const currency = settings.currency || 'KSh';

  const tableHeader = new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Customer', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Contact', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'VIP Joined', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Orders', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Spent (${currency})`, bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true })] })] })
    ]
  });

  const tableRows = vipCustomers.map(c => new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(`⭐ ${c.name}`)] }),
      new TableCell({ children: [new Paragraph(`${c.phone}\n${c.email}`)] }),
      new TableCell({ children: [new Paragraph(c.vipJoinedDate || c.joinedDate)] }),
      new TableCell({ children: [new Paragraph(c.totalOrders.toString())] }),
      new TableCell({ children: [new Paragraph(`${currency} ${c.totalSpent.toLocaleString()}`)] }),
      new TableCell({ children: [new Paragraph((c.vipStatus || 'active').toUpperCase())] })
    ]
  }));

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: settings.shopName.toUpperCase(),
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: '⭐ VIP CUSTOMER CLUB EXECUTIVE REPORT',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Generated Date: ', bold: true }),
              new TextRun({ text: new Date().toLocaleString() })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Total Active VIP Members: ', bold: true }),
              new TextRun({ text: vipCustomers.length.toString() })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Total VIP Gross Sales: ', bold: true }),
              new TextRun({ text: `${currency} ${totalSpent.toLocaleString()}` })
            ],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Total VIP Orders Completed: ', bold: true }),
              new TextRun({ text: totalOrders.toString() })
            ],
            spacing: { after: 300 }
          }),
          new Table({
            rows: [tableHeader, ...tableRows],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),
          new Paragraph({
            text: '______________________________________',
            spacing: { before: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Approved by Managing Director: ', bold: true }),
              new TextRun({ text: settings.adminName || 'Esther Njoki Mbugua' })
            ],
            spacing: { after: 50 }
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${settings.shopName.replace(/\s+/g, '_')}_VIP_Report_${Date.now()}.docx`;
  saveAs(blob, fileName);
}
