import React, { useState } from 'react';
import { useTradingStore } from '../store/tradingStore';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History, IndianRupee, Landmark, ShieldCheck } from 'lucide-react';

export default function WalletPage() {
  const wallet = useTradingStore(state => state.wallet);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="text-accent" /> Funds & Margin
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balances */}
        <div className="card lg:col-span-2 bg-gradient-to-br from-bg-secondary to-bg-tertiary border-border/50 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 opacity-5">
            <Wallet size={300} />
          </div>
          
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10">
            <IndianRupee size={20} className="text-accent" /> Available Balance
          </h2>
          
          <div className="mb-8 relative z-10">
            <span className="text-5xl font-bold font-mono text-text-primary tracking-tight">
              ₹{wallet.available.toLocaleString('en-IN', {minimumFractionDigits: 2})}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div>
              <p className="text-xs text-text-muted uppercase mb-1">Total Margin</p>
              <p className="font-mono font-medium">₹{wallet.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase mb-1">Used Margin</p>
              <p className="font-mono font-medium text-warning">₹{wallet.usedMargin.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase mb-1">Opening Balance</p>
              <p className="font-mono font-medium text-text-secondary">₹10,00,000.00</p>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase mb-1">Payin Today</p>
              <p className="font-mono font-medium text-success">₹0.00</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Transfer Funds</h2>
          
          <div className="flex bg-bg-tertiary rounded-lg p-1 mb-6">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded ${action === 'DEPOSIT' ? 'bg-bg-secondary text-accent shadow' : 'text-text-muted'}`}
              onClick={() => setAction('DEPOSIT')}
            >Deposit</button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded ${action === 'WITHDRAW' ? 'bg-bg-secondary text-accent shadow' : 'text-text-muted'}`}
              onClick={() => setAction('WITHDRAW')}
            >Withdraw</button>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="input-label">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">₹</span>
                <input 
                  type="number" 
                  className="input pl-8 font-mono text-lg" 
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button className="btn-secondary py-1 text-xs" onClick={() => setAmount('10000')}>+10k</button>
              <button className="btn-secondary py-1 text-xs" onClick={() => setAmount('50000')}>+50k</button>
              <button className="btn-secondary py-1 text-xs" onClick={() => setAmount('100000')}>+1L</button>
            </div>

            <button className="btn-primary w-full py-3 mt-auto flex justify-center items-center gap-2">
              {action === 'DEPOSIT' ? <ArrowDownToLine size={18} /> : <ArrowUpFromLine size={18} />}
              {action === 'DEPOSIT' ? 'Add Funds via UPI / Netbanking' : 'Withdraw to Bank Account'}
            </button>
            
            <p className="text-center flex items-center justify-center gap-1 text-[10px] text-text-muted mt-2">
              <ShieldCheck size={12} className="text-success" /> Secure 256-bit encrypted transaction
            </p>
          </div>
        </div>
      </div>

      {/* Linked Bank Accounts */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Landmark className="text-accent" size={20} /> Linked Accounts
        </h2>
        
        <div className="flex items-center justify-between p-4 bg-bg-tertiary border border-border rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/HDFC_Bank_Logo.svg" alt="HDFC" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">HDFC Bank Ltd.</p>
              <p className="text-sm text-text-muted font-mono">XXXX-XXXX-XXXX-4921</p>
            </div>
          </div>
          <span className="badge badge-success">Primary</span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card flex-1">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <History className="text-accent" size={20} /> Recent Ledger Entries
        </h2>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Narration</th>
                <th className="text-center">Status</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm text-text-muted font-mono">Today, 09:15 AM</td>
                <td>Margin blocked for order 24158912</td>
                <td className="text-center"><span className="badge badge-muted">SUCCESS</span></td>
                <td className="text-right font-mono text-danger">-₹1,24,500.00</td>
                <td className="text-right font-mono text-text-muted">₹8,75,500.00</td>
              </tr>
              <tr>
                <td className="text-sm text-text-muted font-mono">Yesterday, 14:30 PM</td>
                <td>Funds added via UPI (Ref: 1245892124)</td>
                <td className="text-center"><span className="badge badge-success">SUCCESS</span></td>
                <td className="text-right font-mono text-success">+₹2,00,000.00</td>
                <td className="text-right font-mono text-text-muted">₹10,00,000.00</td>
              </tr>
              <tr>
                <td className="text-sm text-text-muted font-mono">12 Jun, 10:45 AM</td>
                <td>Dividend received: RELIANCE</td>
                <td className="text-center"><span className="badge badge-success">SUCCESS</span></td>
                <td className="text-right font-mono text-success">+₹4,500.50</td>
                <td className="text-right font-mono text-text-muted">₹8,00,000.00</td>
              </tr>
              <tr>
                <td className="text-sm text-text-muted font-mono">10 Jun, 09:15 AM</td>
                <td>Opening Balance Allocation</td>
                <td className="text-center"><span className="badge badge-success">SUCCESS</span></td>
                <td className="text-right font-mono text-success">+₹7,95,499.50</td>
                <td className="text-right font-mono text-text-muted">₹7,95,499.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
