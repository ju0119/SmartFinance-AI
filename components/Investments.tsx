import React, { useState } from 'react';
import { StockHolding } from '../types';
import { RefreshCw, Plus, TrendingUp, TrendingDown, Bot } from 'lucide-react';
import { getStockAnalysis } from '../services/geminiService';

interface InvestmentsProps {
  investments: StockHolding[];
  setInvestments: React.Dispatch<React.SetStateAction<StockHolding[]>>;
}

const Investments: React.FC<InvestmentsProps> = ({ investments, setInvestments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{symbol: string, content: string} | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Form State
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [shares, setShares] = useState('');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('TWD');

  // Simulation function
  const refreshPrices = () => {
    setInvestments(prev => prev.map(inv => {
      // Random fluctuation between -2% and +2%
      const change = 1 + (Math.random() * 0.04 - 0.02); 
      return {
        ...inv,
        currentPrice: Math.round(inv.currentPrice * change * 100) / 100
      };
    }));
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const newStock: StockHolding = {
      id: `stk_${Date.now()}`,
      symbol,
      name,
      shares: parseFloat(shares),
      averageCost: parseFloat(cost),
      currentPrice: parseFloat(cost), // Init with cost
      currency
    };
    setInvestments(prev => [...prev, newStock]);
    setIsModalOpen(false);
    // Reset
    setSymbol(''); setName(''); setShares(''); setCost('');
  };

  const handleAiAnalyze = async (symbol: string, name: string) => {
    setAiAnalysis(null);
    setIsLoadingAi(true);
    const result = await getStockAnalysis(symbol, name);
    setAiAnalysis({ symbol, content: result });
    setIsLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">股票投資管理</h2>
        <div className="flex space-x-2">
          <button 
            onClick={refreshPrices}
            className="flex items-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg transition"
          >
            <RefreshCw size={18} />
            <span className="hidden md:inline">更新股價 (模擬)</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} />
            <span>新增持股</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map(inv => {
          const totalValue = inv.currentPrice * inv.shares;
          const totalCost = inv.averageCost * inv.shares;
          const profit = totalValue - totalCost;
          const profitPercent = ((profit / totalCost) * 100).toFixed(2);
          const isPositive = profit >= 0;

          return (
            <div key={inv.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition relative overflow-hidden">
               <div className={`absolute top-0 left-0 w-1 h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
               <div className="flex justify-between items-start mb-4 pl-2">
                 <div>
                   <h3 className="text-xl font-bold text-slate-800">{inv.name}</h3>
                   <span className="text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded">{inv.symbol}</span>
                 </div>
                 <button 
                  onClick={() => handleAiAnalyze(inv.symbol, inv.name)}
                  className="text-blue-600 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition tooltip-trigger"
                  title="AI 分析"
                 >
                   <Bot size={20} />
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-4 pl-2">
                 <div>
                   <p className="text-xs text-slate-400 uppercase">持股數</p>
                   <p className="font-semibold">{inv.shares}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase">平均成本</p>
                   <p className="font-semibold">{inv.averageCost}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase">現價</p>
                   <p className="font-semibold">{inv.currentPrice}</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-400 uppercase">市值 ({inv.currency})</p>
                   <p className="font-bold">{totalValue.toLocaleString()}</p>
                 </div>
               </div>

               <div className={`flex items-center pl-2 pt-4 border-t border-slate-100 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                 {isPositive ? <TrendingUp size={20} className="mr-2" /> : <TrendingDown size={20} className="mr-2" />}
                 <span className="font-bold text-lg">{isPositive ? '+' : ''}{profit.toLocaleString()} ({profitPercent}%)</span>
               </div>
            </div>
          );
        })}
      </div>

      {/* AI Analysis Modal */}
      {(isLoadingAi || aiAnalysis) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bot className="text-blue-600"/> 
                  {isLoadingAi ? 'AI 正在分析市場...' : `${aiAnalysis?.symbol} 市場分析`}
                </h3>
                <button onClick={() => { setAiAnalysis(null); setIsLoadingAi(false); }} className="text-slate-400 hover:text-slate-600">✕</button>
             </div>
             
             {isLoadingAi ? (
               <div className="space-y-3 animate-pulse">
                 <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-200 rounded w-full"></div>
                 <div className="h-4 bg-slate-200 rounded w-5/6"></div>
               </div>
             ) : (
               <div className="prose prose-sm text-slate-700 max-h-[60vh] overflow-y-auto">
                 <p className="whitespace-pre-line leading-relaxed">{aiAnalysis?.content}</p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">新增持股</h3>
            <form onSubmit={handleAddStock} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">股票代號</label>
                    <input required type="text" value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：2330" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">股票名稱</label>
                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：台積電" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">持有股數</label>
                    <input required type="number" value={shares} onChange={e => setShares(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">平均成本</label>
                    <input required type="number" value={cost} onChange={e => setCost(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">幣別</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="TWD">TWD</option>
                    <option value="USD">USD</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">取消</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">儲存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;