import React, { useState } from 'react';
import { useTradingStore } from '../store/tradingStore';
import { Clock, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const orders = useTradingStore(state => state.orders);
  const cancelOrder = useTradingStore(state => state.cancelOrder);
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(o => {
    if (filter !== 'ALL' && o.status !== filter) return false;
    if (searchQuery && !o.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="text-accent" /> Order Book
        </h1>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="tab-bar w-full md:w-auto">
            <button className={`tab ${filter === 'ALL' ? 'tab-active' : ''}`} onClick={() => setFilter('ALL')}>All Orders</button>
            <button className={`tab ${filter === 'OPEN' ? 'tab-active' : ''}`} onClick={() => setFilter('OPEN')}>Open</button>
            <button className={`tab ${filter === 'COMPLETED' ? 'tab-active' : ''}`} onClick={() => setFilter('COMPLETED')}>Executed</button>
            <button className={`tab ${filter === 'CANCELLED' ? 'tab-active' : ''}`} onClick={() => setFilter('CANCELLED')}>Cancelled</button>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search symbols..." 
              className="input pl-10 h-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <Filter size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm mt-1">Try changing your filters or place a new order.</p>
              <Link to="/dashboard" className="btn-primary mt-6">Explore Markets</Link>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Symbol</th>
                  <th>Type</th>
                  <th>Side</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-bg-secondary/50">
                    <td className="text-sm text-text-muted font-mono">{new Date(order.placedAt).toLocaleString()}</td>
                    <td>
                      <Link to={`/stocks/${order.symbol}`} className="font-bold text-accent hover:underline">{order.symbol}</Link>
                    </td>
                    <td>
                      <span className="badge badge-muted font-mono">{order.type}</span>
                    </td>
                    <td>
                      <span className={`badge ${order.side === 'BUY' ? 'badge-success' : 'badge-danger'} font-mono`}>{order.side}</span>
                    </td>
                    <td className="text-right font-mono font-medium">{order.quantity}</td>
                    <td className="text-right font-mono font-medium">₹{order.price.toFixed(2)}</td>
                    <td className="text-center">
                      {order.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-2 py-1 rounded">
                          <CheckCircle2 size={12} /> EXECUTED
                        </span>
                      )}
                      {order.status === 'OPEN' && (
                        <span className="inline-flex items-center gap-1 text-warning text-xs font-bold bg-warning/10 px-2 py-1 rounded">
                          <Clock size={12} /> OPEN
                        </span>
                      )}
                      {order.status === 'CANCELLED' && (
                        <span className="inline-flex items-center gap-1 text-text-muted text-xs font-bold bg-bg-tertiary px-2 py-1 rounded">
                          <XCircle size={12} /> CANCELLED
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      {order.status === 'OPEN' ? (
                        <button 
                          className="btn-danger py-1 px-3 text-xs"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-text-muted text-xs">-</span>
                      )}
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
