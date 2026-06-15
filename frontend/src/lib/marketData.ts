import { Candle, MarketMover, NewsItem, Stock, StockQuote } from '../types';

export const NSE_STOCKS: Stock[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy',
    industry: 'Oil & Gas / Retail / Telecom',
    exchange: 'NSE',
    marketCap: 1654320, // In Crores
    pe: 26.4,
    eps: 92.8,
    dividendYield: 0.36,
    high52w: 2650.00,
    low52w: 2180.00,
    basePrice: 2450.50,
    lotSize: 250,
    isin: 'INE002A01018'
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    sector: 'IT',
    industry: 'IT Services & Consulting',
    exchange: 'NSE',
    marketCap: 1387600,
    pe: 30.2,
    eps: 125.8,
    dividendYield: 1.25,
    high52w: 4250.00,
    low52w: 3200.00,
    basePrice: 3800.00,
    lotSize: 175,
    isin: 'INE467B01029'
  },
  {
    symbol: 'INFOSYS',
    name: 'Infosys Ltd',
    sector: 'IT',
    industry: 'IT Services & Consulting',
    exchange: 'NSE',
    marketCap: 602300,
    pe: 24.1,
    eps: 60.1,
    dividendYield: 2.34,
    high52w: 1750.00,
    low52w: 1220.00,
    basePrice: 1450.00,
    lotSize: 400,
    isin: 'INE009A01021'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking',
    industry: 'Private Sector Banking',
    exchange: 'NSE',
    marketCap: 1245000,
    pe: 18.5,
    eps: 89.2,
    dividendYield: 1.09,
    high52w: 1720.00,
    low52w: 1360.00,
    basePrice: 1650.00,
    lotSize: 550,
    isin: 'INE040A01034'
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    sector: 'Banking',
    industry: 'Private Sector Banking',
    exchange: 'NSE',
    marketCap: 735600,
    pe: 17.2,
    eps: 61.0,
    dividendYield: 0.95,
    high52w: 1150.00,
    low52w: 840.00,
    basePrice: 1050.00,
    lotSize: 700,
    isin: 'INE090A01021'
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    sector: 'IT',
    industry: 'IT Services & Consulting',
    exchange: 'NSE',
    marketCap: 219400,
    pe: 19.8,
    eps: 21.2,
    dividendYield: 0.24,
    high52w: 540.00,
    low52w: 360.00,
    basePrice: 420.00,
    lotSize: 1500,
    isin: 'INE075A01022'
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd',
    sector: 'Finance',
    industry: 'Non-Banking Financial Company',
    exchange: 'NSE',
    marketCap: 436200,
    pe: 34.6,
    eps: 208.1,
    dividendYield: 0.42,
    high52w: 8190.00,
    low52w: 5900.00,
    basePrice: 7200.00,
    lotSize: 125,
    isin: 'INE296A01024'
  },
  {
    symbol: 'ADANIENT',
    name: 'Adani Enterprises Ltd',
    sector: 'Conglomerate',
    industry: 'Multi-Sector Trading & Mining',
    exchange: 'NSE',
    marketCap: 319200,
    pe: 88.4,
    eps: 31.7,
    dividendYield: 0.05,
    high52w: 3350.00,
    low52w: 1800.00,
    basePrice: 2800.00,
    lotSize: 250,
    isin: 'INE423A01024'
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    sector: 'Auto',
    industry: 'Automobile Manufacturer',
    exchange: 'NSE',
    marketCap: 215300,
    pe: 15.4,
    eps: 42.2,
    dividendYield: 0.46,
    high52w: 780.00,
    low52w: 480.00,
    basePrice: 650.00,
    lotSize: 1000,
    isin: 'INE155A01022'
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries Ltd',
    sector: 'Pharma',
    industry: 'Pharmaceuticals Formulation',
    exchange: 'NSE',
    marketCap: 264500,
    pe: 28.1,
    eps: 39.1,
    dividendYield: 0.86,
    high52w: 1260.00,
    low52w: 920.00,
    basePrice: 1100.00,
    lotSize: 700,
    isin: 'INE044A01036'
  }
];

export function getCurrentPrice(symbol: string): number {
  const stock = NSE_STOCKS.find(s => s.symbol === symbol);
  if (!stock) return 100;
  // random walk
  const variance = stock.basePrice * 0.008;
  return stock.basePrice + (Math.random() * variance - variance / 2);
}

export function generateCandleData(symbol: string, timeframe: string, count: number): Candle[] {
  const stock = NSE_STOCKS.find(s => s.symbol === symbol);
  let currentPrice = stock ? stock.basePrice : 100;
  
  const candles: Candle[] = [];
  const now = Date.now();
  
  let intervalMs = 60 * 1000; // default 1m
  if (timeframe === '5m') intervalMs = 5 * 60 * 1000;
  else if (timeframe === '15m') intervalMs = 15 * 60 * 1000;
  else if (timeframe === '1H') intervalMs = 60 * 60 * 1000;
  else if (timeframe === '1D') intervalMs = 24 * 60 * 60 * 1000;
  else if (timeframe === '1W') intervalMs = 7 * 24 * 60 * 60 * 1000;
  else if (timeframe === '1M') intervalMs = 30 * 24 * 60 * 60 * 1000;
  
  for (let i = count; i >= 0; i--) {
    const time = now - i * intervalMs;
    const volatility = currentPrice * 0.006;
    
    const open = currentPrice;
    const close = currentPrice + (Math.random() - 0.49) * volatility; // slight upward bias
    const high = Math.max(open, close) + Math.random() * volatility * 0.4;
    const low = Math.min(open, close) - Math.random() * volatility * 0.4;
    
    candles.push({
      time: Math.floor(time / 1000),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 500000 + 50000)
    });
    
    currentPrice = close;
  }
  
  return candles;
}

export function getMarketMovers(): { gainers: MarketMover[], losers: MarketMover[] } {
  const movers = NSE_STOCKS.map(s => {
    const ltp = getCurrentPrice(s.symbol);
    const changePercent = (Math.random() - 0.48) * 8; // slight bias to match market
    const change = (ltp * changePercent) / 100;
    return {
      symbol: s.symbol,
      name: s.name,
      ltp,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 2000000 + 100000)
    };
  });
  
  const sorted = [...movers].sort((a, b) => b.changePercent - a.changePercent);
  return {
    gainers: sorted.slice(0, 5),
    losers: sorted.slice(-5).reverse()
  };
}

// ── Technical Indicator Math ───────────────────────────────────────────────────

export function calculateSMA(data: Candle[], period: number): { time: number; value: number }[] {
  const sma: { time: number; value: number }[] = [];
  if (data.length < period) return [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    sma.push({ time: data[i].time, value: parseFloat((sum / period).toFixed(2)) });
  }
  return sma;
}

export function calculateEMA(data: Candle[], period: number): { time: number; value: number }[] {
  const ema: { time: number; value: number }[] = [];
  if (data.length < period) return [];
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  let prevEma = sum / period;
  ema.push({ time: data[period - 1].time, value: parseFloat(prevEma.toFixed(2)) });
  const k = 2 / (period + 1);
  for (let i = period; i < data.length; i++) {
    const currentEma = data[i].close * k + prevEma * (1 - k);
    ema.push({ time: data[i].time, value: parseFloat(currentEma.toFixed(2)) });
    prevEma = currentEma;
  }
  return ema;
}

export function calculateBB(data: Candle[], period: number = 20, multiplier: number = 2): {
  time: number;
  upper: number;
  middle: number;
  lower: number;
}[] {
  const bb: { time: number; upper: number; middle: number; lower: number; }[] = [];
  if (data.length < period) return [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    const mean = sum / period;
    let variance = 0;
    for (let j = 0; j < period; j++) {
      variance += Math.pow(data[i - j].close - mean, 2);
    }
    const stdDev = Math.sqrt(variance / period);
    bb.push({
      time: data[i].time,
      middle: parseFloat(mean.toFixed(2)),
      upper: parseFloat((mean + multiplier * stdDev).toFixed(2)),
      lower: parseFloat((mean - multiplier * stdDev).toFixed(2))
    });
  }
  return bb;
}

export function calculateRSI(data: Candle[], period: number = 14): { time: number; value: number }[] {
  const rsi: { time: number; value: number }[] = [];
  if (data.length <= period) return [];
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push({ time: data[period].time, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
  
  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push({ time: data[i].time, value: parseFloat((100 - 100 / (1 + rs)).toFixed(2)) });
  }
  return rsi;
}

export function calculateMACD(data: Candle[]): {
  time: number;
  macd: number;
  signal: number;
  histogram: number;
}[] {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  const macdLine: { time: number; value: number }[] = [];
  ema26.forEach(item26 => {
    const item12 = ema12.find(item => item.time === item26.time);
    if (item12) {
      macdLine.push({ time: item26.time, value: item12.value - item26.value });
    }
  });
  
  const macdCandles: Candle[] = macdLine.map(item => ({
    time: item.time,
    open: item.value,
    high: item.value,
    low: item.value,
    close: item.value,
    volume: 0
  }));
  
  const signalLine = calculateEMA(macdCandles, 9);
  
  const macdResults: { time: number; macd: number; signal: number; histogram: number; }[] = [];
  signalLine.forEach(sig => {
    const macdVal = macdLine.find(m => m.time === sig.time);
    if (macdVal) {
      macdResults.push({
        time: sig.time,
        macd: parseFloat(macdVal.value.toFixed(2)),
        signal: parseFloat(sig.value.toFixed(2)),
        histogram: parseFloat((macdVal.value - sig.value).toFixed(2))
      });
    }
  });
  
  return macdResults;
}

export const simulatedNews: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Reliance Retail Expands Smart Point Outlets to 50 More Locations',
    summary: 'Reliance Retail has announced the addition of 50 new Smart Point outlets across tier-2 cities, aiming to boost local supply chain integrations and increase retail margins.',
    source: 'Financial Express',
    url: '#',
    category: 'Corporate',
    symbols: ['RELIANCE'],
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isTrending: true,
    sentiment: 'positive'
  },
  {
    id: 'news-2',
    title: 'TCS Secures Multi-Million Dollar Infrastructure Deal with Eurocorp Bank',
    summary: 'Tata Consultancy Services signs a strategic digital transformation contract to upgrade Eurocorps legacy systems onto AWS EKS and hybrid cloud configurations.',
    source: 'Bloomberg Quint',
    url: '#',
    category: 'Stocks',
    symbols: ['TCS'],
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isTrending: true,
    sentiment: 'positive'
  },
  {
    id: 'news-3',
    title: 'IT Index Consolidates Amid Inflationary Pressures in US Markets',
    summary: 'Tech stocks including Infosys and Wipro trade slightly lower in early sessions as investors digest federal reserve minutes hinting at sustained high rates.',
    source: 'Economic Times',
    url: '#',
    category: 'Market',
    symbols: ['INFOSYS', 'WIPRO'],
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    isTrending: false,
    sentiment: 'neutral'
  },
  {
    id: 'news-4',
    title: 'HDFC Bank Receives RBI Clearance for Additional Stake Sale',
    summary: 'RBI grants HDFC Bank approval to divest minor shares in its insurance subsidiary, unlocking capital for credit growth in retail mortgage products.',
    source: 'LiveMint',
    url: '#',
    category: 'Corporate',
    symbols: ['HDFCBANK'],
    publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    isTrending: true,
    sentiment: 'positive'
  },
  {
    id: 'news-5',
    title: 'Global Semiconductor Shortage Challenges Automobile Manufacturers',
    summary: 'Tata Motors flags potential bottlenecks in high-end electric vehicle shipments owing to tight supply lines for engine microcontroller units.',
    source: 'Reuters Business',
    url: '#',
    category: 'Economy',
    symbols: ['TATAMOTORS'],
    publishedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    isTrending: false,
    sentiment: 'negative'
  }
];
