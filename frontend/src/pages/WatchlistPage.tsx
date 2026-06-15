import React, { useState, useEffect } from 'react';
import { useTradingStore } from '../store/tradingStore';
import { NSE_STOCKS, getCurrentPrice } from '../lib/marketData';
import { Search, Star, Trash2, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WatchlistPage() {
  const watchlists = useTradingStore(state => state.watchlists);
  const activeWatchlistId = useTradingStore(state => state.activeWatchlistId);
  const setActiveWatchlist = useTradingStore(state => state.setActiveWatchlist);
  const createWatchlist = useTradingStore(state => state.createWatchlist);
  const deleteWatchlist = useTradingStore(state => state.deleteWatchlist);
  const addToWatchlist = useTradingStore(state => state.addToWatchlist);
  const removeFromWatchlist = useTradingStore(state => state.removeFromWatchlist);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, { ltp: number; change: number; changePercent: number }>>({});

  const activeWatchlist = watchlists.find(wl => wl.id === activeWatchlistId) || watchlists[0];

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      const res = NSE_STOCKS.filter(s => s.symbol.toLowerCase().includes(q) || (s.name && s.name.toLowerCase().includes(q))).slice(0, 5);
      setSearchResults(res);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchPrices = () => {
      if (!activeWatchlist) return;
      const prices: Record<string, any> = {};
      activeWatchlist.items.forEach(item => {
        const ltp = getCurrentPrice(item.symbol);
        const changePercent = (Math.random() - 0.48) * 5;
        const change = (ltp * changePercent) / 100;
        prices[item.symbol] = { ltp, change, changePercent };
      });
      setLivePrices(prices);
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, [activeWatchlist]);

  const handleCreateWatchlist = () => {
    const name = prompt("Enter new watchlist name:");
    if (name) createWatchlist(name);
  };

  const handleDeleteWatchlist = (id: string) => {
    if (confirm("Are you sure you want to delete this watchlist?")) {
      deleteWatchlist(id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sidebar - Watchlists */}
      <div className="w-64 border-r border-border pr-4 hidden lg:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Watchlists</h2>
          <button onClick={handleCreateWatchlist} className="btn-icon">
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-2">
          {watchlists.map(wl => (
            <div 
              key={wl.id}
              onClick={() => setActiveWatchlist(wl.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                activeWatchlistId === wl.id 
                  ? 'bg-bg-secondary border-accent' 
                  : 'bg-transparent border-transparent hover:bg-bg-secondary border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${activeWatchlistId === wl.id ? 'text-accent' : 'text-text-primary'}`}>
                  {wl.name}
                </h3>
                {activeWatchlistId === wl.id && watchlists.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteWatchlist(wl.id); }}
                    className="text-text-muted hover:text-danger p-1 rounded hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-xs text-text-muted mt-1">{wl.items.length} items</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{activeWatchlist?.name || 'Watchlist'}</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search stocks to add..." 
              className="input pl-10 h-10 w-full bg-bg-secondary focus:ring-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border rounded-lg shadow-panel z-20 overflow-hidden">
                {searchResults.map(res => (
                  <div key={res.symbol} className="flex justify-between items-center p-3 hover:bg-bg-tertiary cursor-pointer border-b border-border/50 last:border-0"
                    onClick={() => {
                      if (activeWatchlist) {
                        addToWatchlist(activeWatchlist.id, res.symbol);
                        setSearchQuery('');
                      }
                    }}
                  >
                    <div>
                      <p className="font-semibold text-sm text-accent">{res.symbol}</p>
                      <p className="text-xs text-text-muted truncate max-w-[150px]">{res.name}</p>
                    </div>
                    <button className="btn-ghost py-1 px-3 text-xs">Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card flex-1 overflow-hidden flex flex-col">
          {activeWatchlist?.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
              <Star size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">This watchlist is empty</p>
              <p className="text-sm mt-1">Search for a stock above to add it to this list.</p>
            </div>
          ) : (
            <div className="table-container flex-1">
              <table className="table">
                <thead className="sticky top-0 z-10 bg-bg-tertiary">
                  <tr>
                    <th>Instrument</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Change</th>
                    <th className="text-right">% Chg</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeWatchlist?.items.map((item) => {
                    const priceData = livePrices[item.symbol] || { ltp: 0, change: 0, changePercent: 0 };
                    return (
                      <tr key={item.symbol} className="group cursor-pointer">
                        <td>
                          <div className="flex items-center gap-3">
                            <Star size={16} className={`${item.isPinned ? 'text-warning' : 'text-text-muted'} cursor-pointer hover:text-warning`} fill={item.isPinned ? "currentColor" : "none"} />
                            <Link to={`/stocks/${item.symbol}`} className="hover:underline">
                              <p className="font-medium text-accent">{item.symbol}</p>
                              <p className="text-xs text-text-muted">{item.companyName}</p>
                            </Link>
                          </div>
                        </td>
                        <td className="text-right font-mono font-medium">
                          ₹{priceData.ltp.toFixed(2)}
                        </td>
                        <td className={`text-right font-mono ${priceData.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {priceData.change >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                            {priceData.change > 0 ? '+' : ''}{priceData.change.toFixed(2)}
                          </div>
                        </td>
                        <td className={`text-right font-mono ${priceData.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                          {priceData.changePercent > 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/stocks/${item.symbol}`} className="btn-primary py-1 px-3 text-xs bg-success hover:bg-success-dark">Buy</Link>
                            <Link to={`/stocks/${item.symbol}`} className="btn-danger py-1 px-3 text-xs">Sell</Link>
                            <button 
                              onClick={() => removeFromWatchlist(activeWatchlist.id, item.symbol)}
                              className="btn-icon text-text-muted hover:text-danger hover:bg-danger/10"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
