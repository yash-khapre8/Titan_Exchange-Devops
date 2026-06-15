import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, List, Briefcase, Wallet, Newspaper, Settings, LogOut, Search, Bell, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-bg-secondary border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xl font-bold text-gradient tracking-tight">TitanExchange</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/watchlist" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
          <List size={18} />
          <span>Watchlist</span>
        </NavLink>
        <NavLink to="/portfolio" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
          <Briefcase size={18} />
          <span>Portfolio</span>
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
          <List size={18} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/wallet" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
          <Wallet size={18} />
          <span>Wallet</span>
        </NavLink>
        <NavLink to="/news" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
          <Newspaper size={18} />
          <span>News</span>
        </NavLink>
        <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>
          <Shield size={18} />
          <span>Admin</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <button className="nav-link w-full text-left" onClick={() => useAuthStore.getState().logout()}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const [tickerOffset, setTickerOffset] = useState(0);

  // Simple simulated indices
  const indices = [
    { name: 'NIFTY 50', value: 22450.50, change: 125.20, pct: 0.56 },
    { name: 'SENSEX', value: 73850.10, change: -45.60, pct: -0.06 },
    { name: 'BANKNIFTY', value: 47520.80, change: 250.40, pct: 0.53 },
    { name: 'FINNIFTY', value: 21100.20, change: 85.10, pct: 0.40 },
    { name: 'NIFTY IT', value: 37400.90, change: -120.30, pct: -0.32 },
  ];

  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex flex-col justify-center sticky top-0 z-10 overflow-hidden">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Ticker Area */}
        <div className="flex-1 flex items-center overflow-hidden mr-6 mask-image-linear">
          <div className="flex items-center gap-6 animate-ticker-scroll whitespace-nowrap">
            {[...indices, ...indices, ...indices].map((idx, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-text-secondary">{idx.name}</span>
                <span className="font-mono text-text-primary">{idx.value.toFixed(2)}</span>
                <span className={`flex items-center text-xs font-mono ${idx.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {idx.change >= 0 ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                  {idx.pct > 0 ? '+' : ''}{idx.pct}%
                </span>
                <span className="text-border mx-2">•</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <button className="btn-icon relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
              {user?.fullName.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary">{user?.fullName || 'User'}</p>
              <p className="text-xs text-text-muted capitalize">{user?.role || 'Guest'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col min-h-screen w-[calc(100%-16rem)]">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto page-enter-active">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
