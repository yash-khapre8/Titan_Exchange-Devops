import React, { useEffect, useState } from 'react';
import { Shield, Users, Activity, CreditCard, Cpu, HardDrive, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memUsage, setMemUsage] = useState(68);
  const [latency, setLatency] = useState(12);
  const [activeTraders, setActiveTraders] = useState(1284);
  const [dailyTrades, setDailyTrades] = useState(42812);
  
  // Real-time telemetry simulation
  useEffect(() => {
    // Generate initial logs
    const initialLogs = [
      `[${new Date(Date.now() - 5000).toISOString()}] INFO: [vault-agent] Successfully renewed AWS credentials token`,
      `[${new Date(Date.now() - 4000).toISOString()}] INFO: [order-matcher-pod-1] Processing order match queue, current depth: 0`,
      `[${new Date(Date.now() - 3000).toISOString()}] INFO: [ingress-nginx] GET /api/v1/stocks/RELIANCE/quote 200 OK - 8.4ms`,
      `[${new Date(Date.now() - 2000).toISOString()}] INFO: [k8s-hpa] CPU threshold below limit, replica count: 3`,
      `[${new Date(Date.now() - 1000).toISOString()}] INFO: [filebeat] Harvested 12 logs from stdout of pod: titan-frontend-7f9b8`
    ];
    setLogs(initialLogs);

    const interval = setInterval(() => {
      // Fluctuate metrics
      setCpuUsage(prev => Math.max(15, Math.min(95, prev + Math.floor(Math.random() * 11) - 5)));
      setMemUsage(prev => Math.max(40, Math.min(90, prev + Math.floor(Math.random() * 5) - 2)));
      setLatency(prev => Math.max(4, Math.min(45, prev + Math.floor(Math.random() * 7) - 3)));
      setActiveTraders(prev => prev + Math.floor(Math.random() * 5) - 2);
      setDailyTrades(prev => prev + 1);

      // Append new mock log
      const services = ['order-matcher', 'vault-agent', 'ingress-nginx', 'titan-frontend', 'postgres-primary', 'prometheus-operator'];
      const actions = [
        'Connection pool health check passed: active_conns=24',
        'Successfully pushed metrics to Prometheus pushgateway',
        'GET /api/v1/user/portfolio 200 OK - 12.1ms',
        'Matched BUY order ORD-83921 for RELIANCE at ₹2450.50',
        'Scraped pods metrics in namespace titan-exchange: 12 targets found',
        'HashiCorp Vault read secret secret/data/prod/db successful'
      ];
      
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const newLog = `[${new Date().toISOString()}] INFO: [${randomService}] ${randomAction}`;
      
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-accent" size={24} /> Admin DevOps Dashboard
          </h1>
          <p className="text-text-muted text-sm mt-1">Real-time system health and operations cockpit.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-bg-secondary border border-border rounded-xl px-4 py-2 text-sm">
          <span className="pulse-dot"></span>
          <span className="font-semibold text-success uppercase">All Systems Operational</span>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary font-mono">Region: ap-south-1</span>
        </div>
      </div>

      {/* Main Core KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-bg-secondary flex flex-row items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-medium">Total Active Traders</p>
            <p className="text-2xl font-bold font-mono mt-0.5">{activeTraders.toLocaleString()}</p>
          </div>
        </div>

        <div className="card bg-bg-secondary flex flex-row items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-medium">Trades Executed Today</p>
            <p className="text-2xl font-bold font-mono mt-0.5">{dailyTrades.toLocaleString()}</p>
          </div>
        </div>

        <div className="card bg-bg-secondary flex flex-row items-center gap-4">
          <div className="p-3 bg-warning/10 text-warning rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-medium">Matching Engine Latency</p>
            <p className="text-2xl font-bold font-mono mt-0.5">{latency}ms</p>
          </div>
        </div>

        <div className="card bg-bg-secondary flex flex-row items-center gap-4">
          <div className="p-3 bg-danger/10 text-danger rounded-xl">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase font-medium">Daily Platform Revenue</p>
            <p className="text-2xl font-bold font-mono mt-0.5">₹4,82,410.50</p>
          </div>
        </div>
      </div>

      {/* Grid: Cluster Resource utilization & Service health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Resource utilization */}
        <div className="card lg:col-span-2 flex flex-col gap-5">
          <h2 className="text-lg font-bold">EKS Cluster Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CPU utilization widget */}
            <div className="p-4 bg-bg-tertiary rounded-xl border border-border">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Cpu size={18} className="text-accent" />
                  <span className="font-semibold text-sm">Cluster CPU Allocation</span>
                </div>
                <span className="font-mono text-sm font-bold text-text-primary">{cpuUsage}%</span>
              </div>
              <div className="h-3 w-full bg-bg-primary rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full transition-all duration-500 ${
                    cpuUsage > 80 ? 'bg-danger' : cpuUsage > 60 ? 'bg-warning' : 'bg-accent'
                  }`}
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 text-center text-xs text-text-muted">
                <div>
                  <p>Requested</p>
                  <p className="font-mono font-bold text-text-secondary mt-0.5">4.2 vCPU</p>
                </div>
                <div>
                  <p>Limit</p>
                  <p className="font-mono font-bold text-text-secondary mt-0.5">12.0 vCPU</p>
                </div>
                <div>
                  <p>Active Pods</p>
                  <p className="font-mono font-bold text-text-secondary mt-0.5">18 / 24</p>
                </div>
              </div>
            </div>

            {/* Memory utilization widget */}
            <div className="p-4 bg-bg-tertiary rounded-xl border border-border">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive size={18} className="text-success" />
                  <span className="font-semibold text-sm">Cluster Memory Allocation</span>
                </div>
                <span className="font-mono text-sm font-bold text-text-primary">{memUsage}%</span>
              </div>
              <div className="h-3 w-full bg-bg-primary rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full transition-all duration-500 ${
                    memUsage > 80 ? 'bg-danger' : memUsage > 60 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${memUsage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 text-center text-xs text-text-muted">
                <div>
                  <p>Allocated</p>
                  <p className="font-mono font-bold text-text-secondary mt-0.5">16.8 GiB</p>
                </div>
                <div>
                  <p>Capacity</p>
                  <p className="font-mono font-bold text-text-secondary mt-0.5">24.0 GiB</p>
                </div>
                <div>
                  <p>EKS Nodes</p>
                  <p className="font-mono font-bold text-text-secondary mt-0.5">3 (t3.medium)</p>
                </div>
              </div>
            </div>

          </div>

          {/* Simple animated waves simulating live traffic loads using SVG */}
          <div className="p-4 bg-bg-tertiary rounded-xl border border-border flex flex-col gap-2">
            <span className="text-xs text-text-muted uppercase font-semibold">Incoming Request Ingress Flow</span>
            <div className="h-16 flex items-end justify-between gap-1 pt-4">
              {Array.from({ length: 24 }).map((_, i) => {
                const height = Math.floor(Math.sin((i + Date.now()/3000)) * 20 + 35 + Math.random() * 10);
                return (
                  <div 
                    key={i} 
                    className="flex-1 bg-accent/30 rounded-t hover:bg-accent transition-all duration-300"
                    style={{ height: `${Math.max(10, Math.min(100, height))}%` }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-text-muted font-mono mt-1">
              <span>2 hours ago</span>
              <span>1 hour ago</span>
              <span>Just Now</span>
            </div>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="card flex flex-col gap-4">
          <h2 className="text-lg font-bold">Services Topology status</h2>
          
          <div className="flex flex-col gap-3">
            {[
              { name: 'ingress-nginx', type: 'Gateway', status: 'healthy', version: 'v1.9.4' },
              { name: 'titan-frontend', type: 'App Pods (3/3)', status: 'healthy', version: 'v1.0.0' },
              { name: 'order-matcher', type: 'Engine (2/2)', status: 'healthy', version: 'v2.1.0' },
              { name: 'vault-secrets-agent', type: 'Security', status: 'healthy', version: 'v1.15.2' },
              { name: 'postgres-db-primary', type: 'Database', status: 'healthy', version: 'v15.4' },
              { name: 'elastic-aggregator', type: 'Logging', status: 'degraded', version: 'v8.11.1' },
            ].map(svc => (
              <div key={svc.name} className="flex items-center justify-between p-2.5 bg-bg-tertiary rounded-lg border border-border/50 text-xs">
                <div className="flex items-center gap-2.5">
                  {svc.status === 'healthy' ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : (
                    <AlertTriangle size={14} className="text-warning animate-pulse" />
                  )}
                  <div>
                    <p className="font-semibold text-text-primary">{svc.name}</p>
                    <p className="text-[10px] text-text-muted">{svc.type} • {svc.version}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[9px] ${
                  svc.status === 'healthy' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live logging stream console */}
      <div className="card flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} className="text-text-muted animate-spin" />
            <h2 className="text-lg font-bold">Simulated EKS Pod Logs Stream</h2>
          </div>
          <span className="text-xs font-mono text-text-muted bg-bg-tertiary px-2 py-1 rounded">stdout / stderr</span>
        </div>
        
        <div className="bg-black/80 rounded-lg p-4 font-mono text-xs text-green-400 overflow-y-auto max-h-60 border border-border flex flex-col gap-1.5 shadow-inner">
          {logs.map((log, index) => {
            const isError = log.includes('ERROR') || log.includes('degraded');
            const isWarning = log.includes('WARNING') || log.includes('threshold');
            const colorClass = isError ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-green-400';
            
            return (
              <div key={index} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
