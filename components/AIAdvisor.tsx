import React, { useState } from 'react';
import { FinancialState } from '../types';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, Bot, Loader2 } from 'lucide-react';

interface AIAdvisorProps {
  data: FinancialState;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ data }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerateAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(data.accounts, data.transactions, data.investments);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg text-white mb-4">
           <Bot size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">AI 智能財務顧問</h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          利用 Gemini AI 的強大能力，分析您的收支習慣、投資組合，並提供個人化的理財建議。
        </p>
      </div>

      {!advice && !loading && (
        <div className="flex justify-center">
          <button 
            onClick={handleGenerateAdvice}
            className="group flex items-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-lg">生成我的財務報告</span>
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">AI 正在分析您的財務大數據...</p>
        </div>
      )}

      {advice && (
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden animate-fade-in-up">
          <div className="bg-indigo-50 px-8 py-6 border-b border-indigo-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20}/>
              分析報告
            </h3>
            <button 
              onClick={handleGenerateAdvice} 
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            >
              重新生成
            </button>
          </div>
          <div className="p-8 prose prose-slate max-w-none">
            <div className="whitespace-pre-line leading-loose text-slate-700">
              {advice}
            </div>
          </div>
          <div className="bg-slate-50 px-8 py-4 text-center text-xs text-slate-400">
            免責聲明：本報告由 AI 生成，僅供參考，不構成專業投資建議。
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;