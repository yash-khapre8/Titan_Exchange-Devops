import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts';
import { generateCandleData, NSE_STOCKS, getCurrentPrice, calculateSMA, calculateEMA, calculateRSI, calculateBB } from '../lib/marketData';
import { useTradingStore } from '../store/tradingStore';
import { ArrowUpRight, ArrowDownRight, Clock, Info, CheckCircle2 } from 'lucide-react';
import { OrderSide, OrderType } from '../types';
import { UTCTimestamp } from 'lightweight-charts';

export default function StockDetailPage() {
  const { symbol = 'RELIANCE' } = useParams();
  const placeOrder = useTradingStore(state => state.placeOrder);
  const wallet = useTradingStore(state => state.wallet);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const indicatorSeriesRef = useRef<ISeriesApi<"Line">[]>([]);

  const [stockInfo, setStockInfo] = useState<any>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  
  // Chart Config
  const [timeframe, setTimeframe] = useState('5m');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['Volume', 'SMA 20']);

  // Order state
  const [orderSide, setOrderSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const stock = NSE_STOCKS.find(s => s.symbol === symbol) || NSE_STOCKS[0];
    setStockInfo(stock);
    
    const initialPrice = getCurrentPrice(symbol);
    setCurrentPrice(initialPrice);
    setPrice(initialPrice);
    
    const initialChangePercent = (Math.random() - 0.48) * 5;
    setChangePercent(initialChangePercent);
    setChange((initialPrice * initialChangePercent) / 100);

    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: 'solid', color: 'transparent' } as any,
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: 'rgba(30, 45, 74, 0.5)' },
          horzLines: { color: 'rgba(30, 45, 74, 0.5)' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#1e2d4a',
        },
        crosshair: {
          vertLine: { color: '#64748b', labelBackgroundColor: '#1e2d4a' },
          horzLine: { color: '#64748b', labelBackgroundColor: '#1e2d4a' },
        }
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      const initialData = generateCandleData(symbol, timeframe, 150).map(d => ({
        ...d,
        time: d.time as UTCTimestamp
      }));
      candleSeries.setData(initialData);

      chartRef.current = chart;
      seriesRef.current = candleSeries;
      indicatorSeriesRef.current = [];

      // Volume Series
      if (activeIndicators.includes('Volume')) {
        const volumeSeries = chart.addHistogramSeries({
          color: '#26a69a',
          priceFormat: { type: 'volume' },
          priceScaleId: '', 
        });
        const volData = initialData.map(d => ({
          time: d.time as UTCTimestamp,
          value: d.volume,
          color: d.close >= d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
        }));
        volumeSeries.setData(volData);
        volumeSeriesRef.current = volumeSeries;
      }

      // SMA 20
      if (activeIndicators.includes('SMA 20')) {
        const smaSeries = chart.addLineSeries({ color: '#f59e0b', lineWidth: 2 });
        smaSeries.setData(calculateSMA(initialData, 20).map(d => ({ ...d, time: d.time as UTCTimestamp })));
        indicatorSeriesRef.current.push(smaSeries);
      }

      // EMA 9
      if (activeIndicators.includes('EMA 9')) {
        const emaSeries = chart.addLineSeries({ color: '#8b5cf6', lineWidth: 2 });
        emaSeries.setData(calculateEMA(initialData, 9).map(d => ({ ...d, time: d.time as UTCTimestamp })));
        indicatorSeriesRef.current.push(emaSeries);
      }

      // Bollinger Bands
      if (activeIndicators.includes('Bollinger Bands')) {
        const bbData = calculateBB(initialData, 20, 2);
        const upperSeries = chart.addLineSeries({ color: 'rgba(59, 130, 246, 0.4)', lineWidth: 1, lineStyle: LineStyle.Dashed });
        const lowerSeries = chart.addLineSeries({ color: 'rgba(59, 130, 246, 0.4)', lineWidth: 1, lineStyle: LineStyle.Dashed });
        
        upperSeries.setData(bbData.map(d => ({ time: d.time as UTCTimestamp, value: d.upper })));
        lowerSeries.setData(bbData.map(d => ({ time: d.time as UTCTimestamp, value: d.lower })));
        
        indicatorSeriesRef.current.push(upperSeries, lowerSeries);
      }

      // RSI (Subplot)
      if (activeIndicators.includes('RSI 14')) {
        const rsiSeries = chart.addLineSeries({
          color: '#ec4899',
          lineWidth: 2,
          priceScaleId: 'rsi',
        });
        chart.priceScale('rsi').applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 },
        });
        rsiSeries.setData(calculateRSI(initialData, 14).map(d => ({ ...d, time: d.time as UTCTimestamp })));
        indicatorSeriesRef.current.push(rsiSeries);
      }

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };
      window.addEventListener('resize', handleResize);

      const updateInterval = setInterval(() => {
        const newPrice = getCurrentPrice(symbol);
        setCurrentPrice(newPrice);
        const lastCandle = initialData[initialData.length - 1];
        
        const updatedCandle = {
          time: lastCandle.time as UTCTimestamp,
          open: lastCandle.open,
          high: Math.max(lastCandle.high, newPrice),
          low: Math.min(lastCandle.low, newPrice),
          close: newPrice,
        };
        candleSeries.update(updatedCandle);
      }, 2000);

      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [symbol, timeframe, activeIndicators]);

  const handlePlaceOrder = () => {
    placeOrder({
      symbol,
      side: orderSide,
      type: orderType,
      quantity,
      price: orderType === 'MARKET' ? currentPrice : price
    });
    
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 3000);
  };

  const toggleIndicator = (name: string) => {
    setActiveIndicators(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  if (!stockInfo) return <div className="p-8 text-center animate-pulse">Loading data...</div>;

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left side: Chart and Info */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{stockInfo.symbol}</h1>
              <span className="badge badge-muted">{stockInfo.exchange || 'NSE'}</span>
              <span className="text-xs text-text-muted font-mono">{stockInfo.isin}</span>
            </div>
            <p className="text-text-muted mt-1 text-lg">{stockInfo.name}</p>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-bold font-mono">₹{currentPrice.toFixed(2)}</h2>
            <div className={`flex items-center justify-end gap-1 mt-1 font-mono font-medium ${change >= 0 ? 'text-success' : 'text-danger'}`}>
              {change >= 0 ? <ArrowUpRight size={18}/> : <ArrowDownRight size={18}/>}
              {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Chart Toolbar */}
        <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted uppercase">Timeframe</span>
            <div className="tab-bar">
              {['1m', '5m', '15m', '1H', '1D', '1W'].map(t => (
                <button 
                  key={t}
                  className={`tab ${timeframe === t ? 'tab-active' : ''}`}
                  onClick={() => setTimeframe(t)}
                >{t}</button>
              ))}
            </div>
          </div>
          <div className="h-6 w-px bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted uppercase">Indicators</span>
            <div className="flex flex-wrap gap-2">
              {['Volume', 'SMA 20', 'EMA 9', 'Bollinger Bands', 'RSI 14'].map(ind => (
                <button 
                  key={ind}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${activeIndicators.includes(ind) ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-transparent border-border text-text-muted hover:border-text-muted'}`}
                  onClick={() => toggleIndicator(ind)}
                >{ind}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="card flex-1 min-h-[450px] relative p-1 border-border/50">
          <div ref={chartContainerRef} className="absolute inset-0 rounded-lg overflow-hidden" />
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card bg-bg-secondary border-none shadow-none">
            <span className="text-text-muted text-xs uppercase">Market Cap</span>
            <span className="font-medium font-mono text-sm">₹{(stockInfo.marketCap / 100000).toFixed(2)}L Cr</span>
          </div>
          <div className="stat-card bg-bg-secondary border-none shadow-none">
            <span className="text-text-muted text-xs uppercase">P/E Ratio</span>
            <span className="font-medium font-mono text-sm">{stockInfo.pe}</span>
          </div>
          <div className="stat-card bg-bg-secondary border-none shadow-none">
            <span className="text-text-muted text-xs uppercase">52W High</span>
            <span className="font-medium font-mono text-sm text-success">₹{stockInfo.high52w.toFixed(2)}</span>
          </div>
          <div className="stat-card bg-bg-secondary border-none shadow-none">
            <span className="text-text-muted text-xs uppercase">52W Low</span>
            <span className="font-medium font-mono text-sm text-danger">₹{stockInfo.low52w.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Right side: Order Panel */}
      <div className="w-full xl:w-80 shrink-0 h-full overflow-y-auto hide-scrollbar">
        <div className="card sticky top-0 border-border/50 shadow-panel">
          {/* Buy/Sell Toggle */}
          <div className="flex rounded-lg overflow-hidden mb-6 border border-border">
            <button 
              className={`flex-1 py-3 text-center font-bold transition-colors ${orderSide === 'BUY' ? 'bg-success text-white' : 'bg-bg-tertiary text-text-muted hover:bg-bg-secondary'}`}
              onClick={() => setOrderSide('BUY')}
            >BUY</button>
            <button 
              className={`flex-1 py-3 text-center font-bold transition-colors ${orderSide === 'SELL' ? 'bg-danger text-white' : 'bg-bg-tertiary text-text-muted hover:bg-bg-secondary'}`}
              onClick={() => setOrderSide('SELL')}
            >SELL</button>
          </div>

          <div className="space-y-5">
            {/* Order Type */}
            <div>
              <div className="flex gap-1 p-1 bg-bg-tertiary rounded-lg">
                {['MARKET', 'LIMIT', 'STOP_LOSS'].map(type => (
                  <button 
                    key={type}
                    className={`flex-1 py-1.5 text-xs font-medium rounded ${orderType === type ? 'bg-bg-secondary shadow text-white' : 'text-text-muted'}`}
                    onClick={() => setOrderType(type as OrderType)}
                  >
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Qty (Lot: {stockInfo.lotSize})</label>
                <input 
                  type="number" 
                  min="1" 
                  className="input font-mono" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="input-label">Price</label>
                <input 
                  type="number" 
                  className="input font-mono disabled:opacity-50" 
                  value={orderType === 'MARKET' ? currentPrice.toFixed(2) : price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  disabled={orderType === 'MARKET'}
                />
              </div>
            </div>

            {orderType === 'STOP_LOSS' && (
              <div>
                <label className="input-label">Trigger Price</label>
                <input type="number" className="input font-mono" defaultValue={(currentPrice * (orderSide === 'BUY' ? 1.01 : 0.99)).toFixed(2)} />
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-text-muted">Required Margin</span>
                <span className="font-mono text-text-primary font-bold">₹{(quantity * (orderType === 'MARKET' ? currentPrice : price)).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-text-muted">Available Margin</span>
                <span className="font-mono text-accent">₹{wallet.available.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
              
              {orderSuccess ? (
                <button className="w-full py-3 rounded-lg font-bold text-white bg-bg-tertiary border border-success text-success flex items-center justify-center gap-2 cursor-default">
                  <CheckCircle2 size={18} /> ORDER PLACED
                </button>
              ) : (
                <button 
                  className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${
                    orderSide === 'BUY' ? 'bg-success hover:bg-success-dark shadow-glow-green' : 'bg-danger hover:bg-danger-dark shadow-glow-red'
                  }`}
                  onClick={handlePlaceOrder}
                >
                  {orderSide} {quantity} {symbol}
                </button>
              )}
            </div>
            
            <div className="flex items-start gap-2 mt-4 p-3 bg-bg-tertiary/50 border border-border/50 rounded-lg text-xs text-text-muted leading-relaxed">
              <Info size={14} className="shrink-0 mt-0.5 text-accent" />
              <p>Simulated execution environment. Orders route to the local matcher and update your active portfolio instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
