import React, { useEffect } from 'react';
import { useTradingStore } from '../store/tradingStore';
import { getCurrentPrice } from '../lib/marketData';
import { Briefcase, ArrowUpRight, ArrowDownRight, IndianRupee, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortfolioPage() {
  const holdings = useTradingStore(state => state.holdings);
  const updateMarketTick = useTradingStore(state => state.updateMarketTick);

  useEffect(() => {
    // Simulate live P&L updates for portfolio
    const interval = setInterval(() => {
      holdings.forEach(h => {
        if (Math.random() > 0.4) {
          updateMarketTick(h.symbol, getCurrentPrice(h.symbol));
        }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [holdings, updateMarketTick]);

  const totalInvested = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const currentValuation = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalUnrealizedPnl = currentValuation - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalUnrealizedPnl / totalInvested) * 100 : 0;
  const todaysPnl = holdings.reduce((sum, h) => sum + h.dayChange, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="text-accent" /> Portfolio
          </h1>
          <p className="text-text-muted mt-1">Manage your equity holdings</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card bg-bg-secondary border-border/50">
          <span className="stat-label">Invested Value</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-text-primary">₹{totalInvested.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          </div>
        </div>
        <div className="stat-card bg-bg-secondary border-border/50">
          <span className="stat-label">Current Value</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-accent">₹{currentValuation.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          </div>
        </div>
        <div className="stat-card bg-bg-secondary border-border/50">
          <span className="stat-label">Total Returns</span>
          <div className={`flex items-center gap-2 mt-1 ${totalUnrealizedPnl >= 0 ? 'text-success' : 'text-danger'}`}>
            <span className="text-xl font-bold font-mono">
              {totalUnrealizedPnl > 0 ? '+' : ''}₹{totalUnrealizedPnl.toLocaleString('en-IN', {minimumFractionDigits: 2})}
            </span>
            <span className={`badge ${totalUnrealizedPnl >= 0 ? 'badge-success' : 'badge-danger'}`}>
              {totalPnlPercent > 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="stat-card bg-bg-secondary border-border/50">
          <span className="stat-label">1D Returns</span>
          <div className={`flex items-center gap-2 mt-1 ${todaysPnl >= 0 ? 'text-success' : 'text-danger'}`}>
            <span className="text-xl font-bold font-mono">
              {todaysPnl > 0 ? '+' : ''}₹{todaysPnl.toLocaleString('en-IN', {minimumFractionDigits: 2})}
            </span>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card flex-1 min-h-[400px]">
        <div className="table-container">
          {holdings.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-text-muted py-20">
              <Briefcase size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Your portfolio is empty</p>
              <p className="text-sm mt-1">Invest in stocks to see them here.</p>
              <Link to="/dashboard" className="btn-primary mt-6">Explore Markets</Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Avg. Price</th>
                  <th className="text-right">LTP</th>
                  <th className="text-right">Invested</th>
                  <th className="text-right">Current Value</th>
                  <th className="text-right">Unrealized P&L</th>
                  <th className="text-right">1D P&L</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.symbol} className="group hover:bg-bg-secondary/50">
                    <td>
                      <Link to={`/stocks/${h.symbol}`} className="hover:underline block">
                        <p className="font-medium text-accent">{h.symbol}</p>
                        <p className="text-xs text-text-muted">{h.sector}</p>
                      </Link>
                    </td>
                    <td className="text-right font-mono">{h.quantity}</td>
                    <td className="text-right font-mono">₹{h.avgBuyPrice.toFixed(2)}</td>
                    <td className="text-right font-mono font-medium">₹{h.currentPrice.toFixed(2)}</td>
                    <td className="text-right font-mono">₹{h.investedValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className="text-right font-mono font-medium text-text-primary">₹{h.currentValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                    <td className={`text-right font-mono ${h.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                      <p>{h.pnl > 0 ? '+' : ''}₹{h.pnl.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                      <p className="text-xs">{(h.pnlPercent > 0 ? '+' : '') + h.pnlPercent.toFixed(2)}%</p>
                    </td>
                    <td className={`text-right font-mono ${h.dayChange >= 0 ? 'text-success' : 'text-danger'}`}>
                      {h.dayChange > 0 ? '+' : ''}₹{h.dayChange.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/stocks/${h.symbol}`} className="btn-primary py-1 px-3 text-xs">Trade</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
