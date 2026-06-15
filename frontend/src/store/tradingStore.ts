import { create } from 'zustand';
import { Order, Holding, Watchlist, Transaction, WalletBalance, OrderSide, OrderType } from '../types';
import { NSE_STOCKS } from '../lib/marketData';

interface TradingState {
  watchlists: Watchlist[];
  activeWatchlistId: string;
  orders: Order[];
  holdings: Holding[];
  wallet: WalletBalance;
  transactions: Transaction[];
  
  // Watchlist Actions
  setActiveWatchlist: (id: string) => void;
  createWatchlist: (name: string) => void;
  deleteWatchlist: (id: string) => void;
  addToWatchlist: (watchlistId: string, symbol: string) => void;
  removeFromWatchlist: (watchlistId: string, symbol: string) => void;
  
  // Trading Actions
  placeOrder: (orderData: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    price: number;
    triggerPrice?: number;
    targetPrice?: number;
    stopLoss?: number;
  }) => void;
  cancelOrder: (orderId: string) => void;
  
  // Wallet Actions
  depositFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  
  // Real-time market tick updates
  updateMarketTick: (symbol: string, ltp: number) => void;
}

// Initial Watchlists
const initialWatchlists: Watchlist[] = [
  {
    id: 'wl-tech',
    userId: 'demo-1',
    name: 'Tech & Services',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      { symbol: 'TCS', companyName: 'Tata Consultancy Services Ltd', addedAt: new Date().toISOString(), isPinned: true },
      { symbol: 'INFOSYS', companyName: 'Infosys Ltd', addedAt: new Date().toISOString(), isPinned: false },
      { symbol: 'WIPRO', companyName: 'Wipro Ltd', addedAt: new Date().toISOString(), isPinned: false },
      { symbol: 'RELIANCE', companyName: 'Reliance Industries Ltd', addedAt: new Date().toISOString(), isPinned: true },
    ]
  },
  {
    id: 'wl-banking',
    userId: 'demo-1',
    name: 'Banking & Finance',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      { symbol: 'HDFCBANK', companyName: 'HDFC Bank Ltd', addedAt: new Date().toISOString(), isPinned: true },
      { symbol: 'ICICIBANK', companyName: 'ICICI Bank Ltd', addedAt: new Date().toISOString(), isPinned: false },
      { symbol: 'BAJFINANCE', companyName: 'Bajaj Finance Ltd', addedAt: new Date().toISOString(), isPinned: false },
    ]
  }
];

// Initial Holdings
const initialHoldings: Holding[] = [
  {
    id: 'hold-1',
    userId: 'demo-1',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd',
    sector: 'Energy',
    quantity: 50,
    avgBuyPrice: 2400.50,
    currentPrice: 2450.50,
    investedValue: 120025.00,
    currentValue: 122525.00,
    pnl: 2500.00,
    pnlPercent: 2.08,
    dayChange: 500.00,
    dayChangePercent: 0.41,
    isin: 'INE002A01018'
  },
  {
    id: 'hold-2',
    userId: 'demo-1',
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services Ltd',
    sector: 'IT',
    quantity: 20,
    avgBuyPrice: 3850.00,
    currentPrice: 3800.00,
    investedValue: 77000.00,
    currentValue: 76000.00,
    pnl: -1000.00,
    pnlPercent: -1.30,
    dayChange: -200.00,
    dayChangePercent: -0.26,
    isin: 'INE467B01029'
  },
  {
    id: 'hold-3',
    userId: 'demo-1',
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd',
    sector: 'Banking',
    quantity: 100,
    avgBuyPrice: 1600.00,
    currentPrice: 1650.00,
    investedValue: 160000.00,
    currentValue: 165000.00,
    pnl: 5000.00,
    pnlPercent: 3.12,
    dayChange: 1250.00,
    dayChangePercent: 0.76,
    isin: 'INE040A01034'
  },
  {
    id: 'hold-4',
    userId: 'demo-1',
    symbol: 'WIPRO',
    companyName: 'Wipro Ltd',
    sector: 'IT',
    quantity: 200,
    avgBuyPrice: 430.00,
    currentPrice: 420.00,
    investedValue: 86000.00,
    currentValue: 84000.00,
    pnl: -2000.00,
    pnlPercent: -2.33,
    dayChange: -600.00,
    dayChangePercent: -0.71,
    isin: 'INE075A01022'
  }
];

// Initial Wallet
const initialWallet: WalletBalance = {
  available: 520000.00,
  usedMargin: 0.00,
  total: 520000.00,
  todayPnl: 950.00,
  unrealizedPnl: 4500.00
};

// Initial Orders
const initialOrders: Order[] = [
  {
    id: 'ORD-12345',
    userId: 'demo-1',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd',
    side: 'BUY',
    type: 'MARKET',
    status: 'COMPLETED',
    quantity: 50,
    price: 2450.50,
    filledQuantity: 50,
    filledPrice: 2450.50,
    margin: 122525.00,
    charges: 122.53,
    placedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    validity: 'DAY'
  },
  {
    id: 'ORD-12346',
    userId: 'demo-1',
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services Ltd',
    side: 'SELL',
    type: 'LIMIT',
    status: 'OPEN',
    quantity: 20,
    price: 3900.00,
    filledQuantity: 0,
    margin: 78000.00,
    charges: 78.00,
    placedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    validity: 'DAY'
  },
  {
    id: 'ORD-12347',
    userId: 'demo-1',
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd',
    side: 'BUY',
    type: 'LIMIT',
    status: 'COMPLETED',
    quantity: 100,
    price: 1600.00,
    filledQuantity: 100,
    filledPrice: 1600.00,
    margin: 160000.00,
    charges: 160.00,
    placedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 29 * 60 * 1000).toISOString(),
    validity: 'DAY'
  }
];

export const useTradingStore = create<TradingState>((set, get) => ({
  watchlists: initialWatchlists,
  activeWatchlistId: 'wl-tech',
  orders: initialOrders,
  holdings: initialHoldings,
  wallet: initialWallet,
  transactions: [],

  setActiveWatchlist: (id) => set({ activeWatchlistId: id }),

  createWatchlist: (name) => set((state) => {
    const id = `wl-${Date.now()}`;
    const newWatchlist: Watchlist = {
      id,
      userId: 'demo-1',
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: []
    };
    return {
      watchlists: [...state.watchlists, newWatchlist],
      activeWatchlistId: id
    };
  }),

  deleteWatchlist: (id) => set((state) => {
    const remaining = state.watchlists.filter(wl => wl.id !== id);
    return {
      watchlists: remaining,
      activeWatchlistId: remaining[0]?.id || ''
    };
  }),

  addToWatchlist: (watchlistId, symbol) => set((state) => {
    const stock = NSE_STOCKS.find(s => s.symbol === symbol);
    if (!stock) return {};

    const updatedWatchlists = state.watchlists.map(wl => {
      if (wl.id === watchlistId) {
        // Prevent duplicate
        if (wl.items.some(item => item.symbol === symbol)) return wl;
        return {
          ...wl,
          items: [...wl.items, {
            symbol,
            companyName: stock.name || symbol,
            addedAt: new Date().toISOString(),
            isPinned: false
          }],
          updatedAt: new Date().toISOString()
        };
      }
      return wl;
    });

    return { watchlists: updatedWatchlists };
  }),

  removeFromWatchlist: (watchlistId, symbol) => set((state) => {
    const updatedWatchlists = state.watchlists.map(wl => {
      if (wl.id === watchlistId) {
        return {
          ...wl,
          items: wl.items.filter(item => item.symbol !== symbol),
          updatedAt: new Date().toISOString()
        };
      }
      return wl;
    });
    return { watchlists: updatedWatchlists };
  }),

  placeOrder: (orderData) => set((state) => {
    const { symbol, side, type, quantity, price, triggerPrice, targetPrice, stopLoss } = orderData;
    const stock = NSE_STOCKS.find(s => s.symbol === symbol);
    const companyName = stock?.name || symbol;
    const orderVal = quantity * price;
    const chargesVal = parseFloat((orderVal * 0.0005).toFixed(2)); // 0.05% brokerage
    
    // Check available margin
    if (side === 'BUY' && state.wallet.available < orderVal + chargesVal) {
      alert("Insufficient margin available in account.");
      return {};
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const status = type === 'MARKET' ? 'COMPLETED' : 'OPEN';

    const newOrder: Order = {
      id: orderId,
      userId: 'demo-1',
      symbol,
      companyName,
      side,
      type,
      status,
      quantity,
      price,
      triggerPrice,
      targetPrice,
      stopLoss,
      filledQuantity: status === 'COMPLETED' ? quantity : 0,
      filledPrice: status === 'COMPLETED' ? price : undefined,
      margin: orderVal,
      charges: chargesVal,
      placedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validity: 'DAY'
    };

    // If order is completed, update holdings and wallet
    let nextHoldings = [...state.holdings];
    let nextWallet = { ...state.wallet };

    if (status === 'COMPLETED') {
      const isin = stock?.isin || 'INE' + Math.floor(100000000 + Math.random() * 900000000);
      const sector = stock?.sector || 'General';

      if (side === 'BUY') {
        nextWallet.available -= (orderVal + chargesVal);
        
        // Find if holding exists
        const existingIdx = nextHoldings.findIndex(h => h.symbol === symbol);
        if (existingIdx !== -1) {
          const existing = nextHoldings[existingIdx];
          const newQty = existing.quantity + quantity;
          const newAvg = parseFloat(((existing.quantity * existing.avgBuyPrice + orderVal) / newQty).toFixed(2));
          nextHoldings[existingIdx] = {
            ...existing,
            quantity: newQty,
            avgBuyPrice: newAvg,
            investedValue: newQty * newAvg,
            currentValue: newQty * price,
            pnl: (newQty * price) - (newQty * newAvg),
            pnlPercent: parseFloat((((price - newAvg) / newAvg) * 100).toFixed(2))
          };
        } else {
          nextHoldings.push({
            id: `hold-${Date.now()}`,
            userId: 'demo-1',
            symbol,
            companyName,
            sector,
            quantity,
            avgBuyPrice: price,
            currentPrice: price,
            investedValue: orderVal,
            currentValue: orderVal,
            pnl: 0,
            pnlPercent: 0,
            dayChange: 0,
            dayChangePercent: 0,
            isin
          });
        }
      } else { // SELL
        const existingIdx = nextHoldings.findIndex(h => h.symbol === symbol);
        if (existingIdx !== -1) {
          const existing = nextHoldings[existingIdx];
          if (existing.quantity < quantity) {
            alert("Insufficient shares to execute sell order.");
            return {};
          }
          
          nextWallet.available += (orderVal - chargesVal);
          
          const newQty = existing.quantity - quantity;
          if (newQty === 0) {
            nextHoldings = nextHoldings.filter(h => h.symbol !== symbol);
          } else {
            nextHoldings[existingIdx] = {
              ...existing,
              quantity: newQty,
              investedValue: newQty * existing.avgBuyPrice,
              currentValue: newQty * price,
              pnl: (newQty * price) - (newQty * existing.avgBuyPrice),
              pnlPercent: parseFloat((((price - existing.avgBuyPrice) / existing.avgBuyPrice) * 100).toFixed(2))
            };
          }
        } else {
          alert("No holdings found for this stock to sell.");
          return {};
        }
      }
    }

    // Recalculate totals
    const invested = nextHoldings.reduce((sum, h) => sum + h.investedValue, 0);
    const current = nextHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    nextWallet.unrealizedPnl = current - invested;
    nextWallet.total = nextWallet.available + current;

    return {
      orders: [newOrder, ...state.orders],
      holdings: nextHoldings,
      wallet: nextWallet
    };
  }),

  cancelOrder: (orderId) => set((state) => {
    return {
      orders: state.orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' as const, updatedAt: new Date().toISOString() } : o)
    };
  }),

  depositFunds: (amount) => set((state) => {
    const nextWallet = {
      ...state.wallet,
      available: state.wallet.available + amount,
      total: state.wallet.total + amount
    };
    return { wallet: nextWallet };
  }),

  withdrawFunds: (amount) => set((state) => {
    if (state.wallet.available < amount) {
      alert("Insufficient funds to withdraw.");
      return {};
    }
    const nextWallet = {
      ...state.wallet,
      available: state.wallet.available - amount,
      total: state.wallet.total - amount
    };
    return { wallet: nextWallet };
  }),

  updateMarketTick: (symbol, ltp) => set((state) => {
    let holdingsChanged = false;
    const updatedHoldings = state.holdings.map(h => {
      if (h.symbol === symbol) {
        holdingsChanged = true;
        const investedVal = h.quantity * h.avgBuyPrice;
        const currentVal = h.quantity * ltp;
        const pnl = currentVal - investedVal;
        const pnlPct = parseFloat(((pnl / investedVal) * 100).toFixed(2));
        const dayChange = (ltp - h.currentPrice) * h.quantity;
        return {
          ...h,
          currentPrice: ltp,
          currentValue: currentVal,
          pnl,
          pnlPercent: pnlPct,
          dayChange: h.dayChange + dayChange,
          dayChangePercent: parseFloat((((ltp - h.avgBuyPrice) / h.avgBuyPrice) * 100).toFixed(2)) // quick mock
        };
      }
      return h;
    });

    if (!holdingsChanged) return {};

    const invested = updatedHoldings.reduce((sum, h) => sum + h.investedValue, 0);
    const current = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
    
    const nextWallet = {
      ...state.wallet,
      unrealizedPnl: current - invested,
      total: state.wallet.available + current
    };

    return {
      holdings: updatedHoldings,
      wallet: nextWallet
    };
  })
}));
