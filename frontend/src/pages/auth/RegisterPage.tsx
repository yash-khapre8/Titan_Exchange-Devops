import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lock, Mail, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        id: 'new-user-1',
        email: 'newuser@example.com',
        fullName: 'New User',
        mobile: '+91 0000000000',
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
    <div className="min-h-screen bg-bg-primary flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-bg-secondary p-8 rounded-2xl border border-border shadow-panel">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient tracking-tight mb-2">TitanExchange</h1>
          <p className="text-text-muted">Create your trading account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input type="text" className="input pl-10 h-11" required placeholder="Arjun Sharma" />
            </div>
          </div>

          <div>
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input type="email" className="input pl-10 h-11" required placeholder="arjun@example.com" />
            </div>
          </div>

          <div>
            <label className="input-label">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input type="tel" className="input pl-10 h-11" required placeholder="+91 9876543210" />
            </div>
          </div>
          
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input type="password" className="input pl-10 h-11" required placeholder="••••••••" />
            </div>
          </div>

          <div className="flex items-start mt-4">
            <input type="checkbox" id="terms" className="mt-1 rounded border-border bg-bg-secondary text-accent focus:ring-accent" required />
            <label htmlFor="terms" className="ml-2 text-xs text-text-muted leading-tight">
              By creating an account, you agree to our Terms of Service, Privacy Policy, and Trading Regulations.
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full h-11 rounded-lg font-bold text-white bg-accent hover:bg-accent-hover shadow-glow-blue transition-all flex justify-center items-center mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6 pt-6 border-t border-border/50">
          Already have an account? <Link to="/login" className="text-accent hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
