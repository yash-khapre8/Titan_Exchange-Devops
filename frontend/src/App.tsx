import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WatchlistPage from './pages/WatchlistPage';
import PortfolioPage from './pages/PortfolioPage';
import StockDetailPage from './pages/StockDetailPage';
import OrdersPage from './pages/OrdersPage';
import WalletPage from './pages/WalletPage';
import NewsPage from './pages/NewsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="stocks/:symbol" element={<StockDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
