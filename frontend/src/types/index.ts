// ============================================================
// Core Application Types — TitanExchange
// ============================================================

export type UserRole = 'user' | 'admin' | 'superadmin';
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_MARKET';
export type OrderStatus = 'OPEN' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'BUY' | 'SELL' | 'DIVIDEND' | 'CHARGES';
export type Timeframe = '1m' | '5m' | '15m' | '1H' | '1D' | '1W' | '1M';
export type ChartType = 'Candlestick' | 'Line' | 'Area';
export type Indicator = 'RSI' | 'MACD' | 'EMA' | 'SMA' | 'BB' | 'Volume';
export type NewsCategory = 'Market' | 'Stocks' | 'Economy' | 'Global' | 'Corporate';

// ============================================================
// User
// ============================================================
export interface User {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLogin: string;
  pan?: string;
  demat?: string;
}

// ============================================================
// Market / Stock Data
// ============================================================
export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: 'NSE' | 'BSE';
  marketCap: number;
  pe: number;
  eps: number;
  dividendYield: number;
  high52w: number;
  low52w: number;
  basePrice: number;
  lotSize: number;
  isin: string;
}

export interface StockQuote {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  prevClose: number;
  volume: number;
  change: number;
  changePercent: number;
  timestamp: number;
  bid: number;
  ask: number;
  totalBuyQty: number;
  totalSellQty: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export interface MarketMover {
  symbol: string;
  name: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
}

// ============================================================
// Orders
// ============================================================
export interface Order {
  id: string;
  userId: string;
  symbol: string;
  companyName: string;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  quantity: number;
  price: number;
  triggerPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  filledQuantity: number;
  filledPrice?: number;
  margin: number;
  charges: number;
  pnl?: number;
  placedAt: string;
  updatedAt: string;
  validity: 'DAY' | 'IOC' | 'GTC';
  tag?: string;
}

// ============================================================
// Holdings / Portfolio
// ============================================================
export interface Holding {
  id: string;
  userId: string;
  symbol: string;
  companyName: string;
  sector: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  isin: string;
}

// ============================================================
// Watchlist
// ============================================================
export interface WatchlistItem {
  symbol: string;
  companyName: string;
  addedAt: string;
  isPinned: boolean;
  alertPrice?: number;
}

export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  items: WatchlistItem[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Wallet / Transactions
// ============================================================
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  symbol?: string;
  orderId?: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  reference: string;
}

export interface WalletBalance {
  available: number;
  usedMargin: number;
  total: number;
  todayPnl: number;
  unrealizedPnl: number;
}

// ============================================================
// Notifications
// ============================================================
export type NotificationType =
  | 'ORDER_EXECUTED'
  | 'ORDER_REJECTED'
  | 'STOP_LOSS_TRIGGERED'
  | 'PRICE_ALERT'
  | 'MARKET_UPDATE'
  | 'SYSTEM'
  | 'DIVIDEND'
  | 'MARGIN_CALL';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  symbol?: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================
// News
// ============================================================
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  category: NewsCategory;
  symbols: string[];
  publishedAt: string;
  isTrending: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
}

// ============================================================
// Admin
// ============================================================
export interface AdminUser extends User {
  totalTrades: number;
  totalVolume: number;
  portfolioValue: number;
  walletBalance: number;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalTrades: number;
  todayTrades: number;
  totalVolume: number;
  todayVolume: number;
  totalRevenue: number;
  todayRevenue: number;
}

// ============================================================
// UI State Types
// ============================================================
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  data?: Record<string, unknown>;
}
