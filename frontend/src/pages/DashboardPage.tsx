import React, { useEffect, useState, useRef } from 'react';
import { getMarketMovers, NSE_STOCKS, getCurrentPrice, generateCandleData } from '../lib/marketData';
import { useTradingStore } from '../store/tradingStore';
import { TrendingUp, TrendingDown, IndianRupee, PieChart, Activity, Layers } from 'lucide-react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';

export default function DashboardPage() {
  const wallet = useTradingStore(state => state.wallet);
  const holdings = useTradingStore(state => state.holdings);
  const updateMarketTick = useTradingStore(state => state.updateMarketTick);

  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    // Initial fetch & Heatmap
    const fetchMovers = () => {
      const data = getMarketMovers();
      setGainers(data.gainers);
      setLosers(data.losers);

      // Generate heatmap data
      const heat = NSE_STOCKS.map(s => {
        const ltp = getCurrentPrice(s.symbol);
        const changePercent = (Math.random() - 0.48) * 8; 
        return {
          symbol: s.symbol,
          sector: s.sector,
          changePercent,
          ltp
        };
      }).sort((a, b) => b.changePercent - a.changePercent);
      setHeatmapData(heat);

      // Simulate live portfolio ticks
      holdings.forEach(h => {
        if (Math.random() > 0.5) {
          updateMarketTick(h.symbol, getCurrentPrice(h.symbol));
        }
      });
    };
    
    fetchMovers();
    const interval = setInterval(fetchMovers, 3000);
    return () => clearInterval(interval);
  }, [holdings, updateMarketTick]);

  // Render Index Chart
  useEffect(() => {
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
        }
      });

      const areaSeries = chart.addAreaSeries({
        lineColor: '#3b82f6',
        topColor: 'rgba(59, 130, 246, 0.4)',
        bottomColor: 'rgba(59, 130, 246, 0.0)',
        lineWidth: 2,
      });

      // Generate mock NIFTY data
      const now = Math.floor(Date.now() / 1000);
      let currentPrice = 22400;
      const data = [];
      for (let i = 100; i >= 0; i--) {
        currentPrice += (Math.random() - 0.48) * 20;
        data.push({ time: (now - i * 60) as UTCTimestamp, value: currentPrice });
      }
      areaSeries.setData(data);
      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };
      window.addEventListener('resize', handleResize);

      const updateInterval = setInterval(() => {
        currentPrice += (Math.random() - 0.48) * 10;
        areaSeries.update({ time: Math.floor(Date.now() / 1000) as UTCTimestamp, value: currentPrice });
      }, 3000);

      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  // Compute sector allocation for simple SVG chart
  const sectorAllocations = holdings.reduce((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const totalInvested = holdings.reduce((sum, h) => sum + h.currentValue, 0) || 1;
  const sectors = Object.keys(sectorAllocations);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="text-accent" /> Market Dashboard
        </h1>
      </div>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="stat-label">Total Portfolio Value</span>
          <div className="flex items-center gap-1">
            <span className="stat-value">₹{wallet.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Unrealized P&L</span>
          <div className="flex items-center gap-2">
            <span className={`stat-value ${wallet.unrealizedPnl >= 0 ? 'text-success' : 'text-danger'}`}>
              {wallet.unrealizedPnl > 0 ? '+' : ''}₹{wallet.unrealizedPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Available Margin</span>
          <div className="flex items-center gap-1">
            <span className="stat-value">₹{wallet.available.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Today's P&L</span>
          <div className="flex items-center gap-2">
            <span className={`stat-value ${wallet.todayPnl >= 0 ? 'text-success' : 'text-danger'}`}>
              {wallet.todayPnl > 0 ? '+' : ''}₹{wallet.todayPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* NIFTY 50 Overview Chart */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">NIFTY 50 Overview</h2>
              <span className="badge badge-success">+1.24%</span>
            </div>
            <div className="tab-bar">
              <button className="tab">1D</button>
              <button className="tab tab-active">1W</button>
              <button className="tab">1M</button>
              <button className="tab">1Y</button>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] relative rounded-lg overflow-hidden border border-border/50">
            <div ref={chartContainerRef} className="absolute inset-0" />
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="card flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-accent" size={20} />
            <h2 className="font-semibold text-lg">Portfolio Allocation</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            {sectors.length === 0 ? (
              <div className="text-center text-text-muted text-sm py-10">
                No active holdings. Place orders to see allocation.
              </div>
            ) : (
              <>
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                    {sectors.map((sector, index) => {
                      const value = sectorAllocations[sector];
                      const percent = value / totalInvested;
                      const dashArray = `${percent * 314.159} 314.159`;
                      
                      let offset = 0;
                      for (let i = 0; i < index; i++) {
                        offset += (sectorAllocations[sectors[i]] / totalInvested) * 314.159;
                      }

                      return (
                        <circle
                          key={sector}
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke={colors[index % colors.length]}
                          strokeWidth="10"
                          strokeDasharray={dashArray}
                          strokeDashoffset={-offset}
                          className="transition-all duration-1000 ease-out hover:stroke-[12px] cursor-pointer"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold font-mono text-text-primary">{sectors.length}</span>
                    <span className="text-xs text-text-muted uppercase">Sectors</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 px-2">
                  {sectors.map((sector, idx) => (
                    <div key={sector} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                      <span className="text-text-secondary flex-1 truncate">{sector}</span>
                      <span className="font-mono text-text-primary font-medium">{((sectorAllocations[sector] / totalInvested) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap */}
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="text-accent" size={20} />
            <h2 className="font-semibold text-lg">Market Heatmap</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {heatmapData.map((item) => {
              const intensity = Math.min(100, Math.abs(item.changePercent) * 20);
              const isPositive = item.changePercent >= 0;
              const bgColor = isPositive 
                ? `rgba(16, 185, 129, ${intensity / 100})` 
                : `rgba(239, 68, 68, ${intensity / 100})`;
                
              return (
                <div 
                  key={item.symbol} 
                  className="p-3 rounded-lg border border-border/50 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="font-bold text-white text-sm">{item.symbol}</span>
                  <span className="text-white/80 font-mono text-xs mt-1">
                    {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-success" size={20} />
            <h2 className="font-semibold text-lg">Top Gainers</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th className="text-right">LTP</th>
                  <th className="text-right">% Change</th>
                </tr>
              </thead>
              <tbody>
                {gainers.map((g) => (
                  <tr key={g.symbol}>
                    <td className="font-medium text-accent">{g.symbol}</td>
                    <td className="text-right font-mono">₹{g.ltp.toFixed(2)}</td>
                    <td className="text-right font-mono text-success">+{g.changePercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Losers */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-danger" size={20} />
            <h2 className="font-semibold text-lg">Top Losers</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th className="text-right">LTP</th>
                  <th className="text-right">% Change</th>
                </tr>
              </thead>
              <tbody>
                {losers.map((l) => (
                  <tr key={l.symbol}>
                    <td className="font-medium text-accent">{l.symbol}</td>
                    <td className="text-right font-mono">₹{l.ltp.toFixed(2)}</td>
                    <td className="text-right font-mono text-danger">{l.changePercent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
