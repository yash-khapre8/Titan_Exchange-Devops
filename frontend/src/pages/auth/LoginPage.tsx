import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('demo@titanexchange.com');
  const [password, setPassword] = useState('Demo@1234');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        id: 'demo-1',
        email,
        fullName: 'Demo User',
        mobile: '+91 9876543210',
        role: 'user',
        isActive: true,
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-auth flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome to TitanExchange</h1>
          <p className="text-text-secondary text-lg mb-8">
            Experience the next generation of institutional-grade securities trading. Fast, secure, and professional.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-primary/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-left">
              <p className="text-success text-2xl font-mono font-bold mb-1">99.99%</p>
              <p className="text-text-muted text-sm uppercase tracking-wide">Uptime</p>
            </div>
            <div className="bg-bg-primary/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-left">
              <p className="text-accent text-2xl font-mono font-bold mb-1">&lt; 1ms</p>
              <p className="text-text-muted text-sm uppercase tracking-wide">Execution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-gradient tracking-tight">TitanExchange</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Sign in</h2>
            <p className="text-text-muted">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="email" 
                  className="input pl-10 h-12" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-text-muted uppercase tracking-wide mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="password" 
                  className="input pl-10 h-12" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="rounded border-border bg-bg-secondary text-accent focus:ring-accent" />
              <label htmlFor="remember" className="ml-2 text-sm text-text-muted">Remember me for 30 days</label>
            </div>

            <button 
              type="submit" 
              className="w-full h-12 rounded-lg font-bold text-white bg-accent hover:bg-accent-hover shadow-glow-blue transition-all flex justify-center items-center mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-8">
            Don't have an account? <Link to="/register" className="text-accent hover:underline font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
