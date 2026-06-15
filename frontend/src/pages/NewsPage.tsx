import React, { useState } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Clock, Search, Filter, ExternalLink } from 'lucide-react';

const MOCK_NEWS = [
  {
    id: 1,
    title: "RBI keeps repo rate unchanged at 6.5% for 7th consecutive time",
    summary: "The Reserve Bank of India's Monetary Policy Committee has decided to keep the benchmark repo rate unchanged at 6.5 per cent. The MPC also decided to remain focused on withdrawal of accommodation to ensure that inflation progressively aligns to the target.",
    source: "BloombergQuint",
    time: "10 mins ago",
    sentiment: "positive",
    tags: ["MACRO", "RBI", "BANKNIFTY"],
    impact: "High"
  },
  {
    id: 2,
    title: "Reliance Industries Q4 Results: Net profit rises 14% to ₹21,243 crore",
    summary: "Reliance Industries reported a 14% year-on-year increase in its consolidated net profit to ₹21,243 crore for the quarter ended March 2024. Revenue from operations grew 11% to ₹2.40 lakh crore.",
    source: "Reuters",
    time: "45 mins ago",
    sentiment: "positive",
    tags: ["RELIANCE", "EARNINGS", "NIFTY50"],
    impact: "High"
  },
  {
    id: 3,
    title: "TCS bags $1.5 billion deal from UK-based insurance firm",
    summary: "Tata Consultancy Services has won a multi-year IT services deal worth $1.5 billion from a leading UK-based insurance provider to modernize its core operations and transition workloads to the cloud.",
    source: "Economic Times",
    time: "2 hours ago",
    sentiment: "positive",
    tags: ["TCS", "IT", "DEALS"],
    impact: "Medium"
  },
  {
    id: 4,
    title: "FIIs pull out ₹4,500 crore from Indian equities amid global tech sell-off",
    summary: "Foreign Institutional Investors remained net sellers in the Indian equity market, offloading shares worth ₹4,500 crore on Thursday tracking weakness in global technology stocks and rising US bond yields.",
    source: "CNBC TV18",
    time: "3 hours ago",
    sentiment: "negative",
    tags: ["FII", "MARKETS", "GLOBAL"],
    impact: "High"
  },
  {
    id: 5,
    title: "HDFC Bank merger synergies to take 12-18 months to reflect fully: CEO",
    summary: "HDFC Bank CEO stated that the full benefits and synergies of the historic merger with HDFC Ltd will take about 12 to 18 months to reflect in the bank's profitability and return metrics.",
    source: "Mint",
    time: "4 hours ago",
    sentiment: "neutral",
    tags: ["HDFCBANK", "BANKING"],
    impact: "Medium"
  },
  {
    id: 6,
    title: "Auto sales data: Maruti Suzuki domestic PV sales rise 8% in April",
    summary: "Maruti Suzuki India reported an 8% increase in domestic passenger vehicle sales to 1,37,320 units in April compared to the same month last year. SUVs led the growth chart.",
    source: "Business Standard",
    time: "5 hours ago",
    sentiment: "positive",
    tags: ["MARUTI", "AUTO", "SALES"],
    impact: "Medium"
  }
];

export default function NewsPage() {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = MOCK_NEWS.filter(news => {
    if (filter !== 'ALL' && news.sentiment !== filter.toLowerCase() && !news.tags.includes(filter)) return false;
    if (searchQuery && !news.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Newspaper className="text-accent" /> Market Intelligence
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)]">
        {/* Left Side: News Feed */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="card shrink-0 p-4 pb-0 border-b-0 rounded-b-none bg-bg-secondary">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              <div className="tab-bar overflow-x-auto whitespace-nowrap hide-scrollbar max-w-full">
                <button className={`tab ${filter === 'ALL' ? 'tab-active' : ''}`} onClick={() => setFilter('ALL')}>Latest</button>
                <button className={`tab ${filter === 'EARNINGS' ? 'tab-active' : ''}`} onClick={() => setFilter('EARNINGS')}>Earnings</button>
                <button className={`tab ${filter === 'MACRO' ? 'tab-active' : ''}`} onClick={() => setFilter('MACRO')}>Macro</button>
                <button className={`tab ${filter === 'POSITIVE' ? 'tab-active' : ''}`} onClick={() => setFilter('POSITIVE')}>Positive</button>
                <button className={`tab ${filter === 'NEGATIVE' ? 'tab-active' : ''}`} onClick={() => setFilter('NEGATIVE')}>Negative</button>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="text" 
                  placeholder="Search headlines..." 
                  className="input pl-10 h-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {filteredNews.map((news) => (
              <div key={news.id} className="card hover:border-accent/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted font-medium mb-2">
                    <span className="text-accent">{news.source}</span>
                    <span>•</span>
                    <Clock size={12} />
                    <span>{news.time}</span>
                  </div>
                  {news.sentiment === 'positive' && <TrendingUp size={16} className="text-success" />}
                  {news.sentiment === 'negative' && <TrendingDown size={16} className="text-danger" />}
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors leading-snug">
                  {news.title}
                </h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed">
                  {news.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {news.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-bg-tertiary border border-border rounded text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-accent flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Full <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredNews.length === 0 && (
              <div className="card flex flex-col items-center justify-center py-16 text-text-muted">
                <Filter size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">No articles found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Market Movers & Calendar */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Breaking News Flash */}
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-danger font-bold text-sm mb-2">
              <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
              BREAKING
            </div>
            <p className="text-sm font-medium text-text-primary leading-relaxed">
              US Fed Chairman indicates possible rate cuts in Q3, citing cooling inflation data. DOW futures surge 300 points.
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">Earnings Calendar</h3>
            <div className="space-y-3">
              {[
                { company: "INFY", date: "Today", impact: "High" },
                { company: "HDFCBANK", date: "Tomorrow", impact: "High" },
                { company: "ITC", date: "15 May", impact: "Medium" },
                { company: "TATAMOTORS", date: "18 May", impact: "High" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-bg-tertiary rounded-lg border border-transparent hover:border-border transition-colors">
                  <div>
                    <p className="font-bold text-sm text-text-primary">{item.company}</p>
                    <p className="text-xs text-text-muted">{item.date}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.impact === 'High' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
                  }`}>
                    {item.impact} IMPACT
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-xs font-bold text-accent mt-4 py-2 hover:bg-accent/10 rounded-lg transition-colors">
              View Full Calendar
            </button>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4 flex items-center gap-2">Sector Performance</h3>
            <div className="space-y-3">
              {[
                { name: "NIFTY IT", value: "+2.4%" },
                { name: "NIFTY BANK", value: "+0.8%" },
                { name: "NIFTY AUTO", value: "+0.5%" },
                { name: "NIFTY FMCG", value: "-0.2%" },
                { name: "NIFTY METAL", value: "-1.1%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{item.name}</span>
                  <span className={`font-mono font-medium ${item.value.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
