import React, { useState } from 'react';
import { Transaction, Category, BankAccount, TransactionType } from '../types';
import { Plus, Search, Filter } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions, accounts, setAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Form
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return alert("請先建立銀行帳戶");

    const val = parseFloat(amount);
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId,
      amount: val,
      type,
      category,
      date: new Date(date).toISOString(),
      description
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update Account Balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        return {
          ...acc,
          balance: type === 'INCOME' ? acc.balance + val : acc.balance - val
        };
      }
      return acc;
    }));

    setIsModalOpen(false);
    // Reset Form
    setAmount('');
    setDescription('');
  };

  const filteredTransactions = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .filter(t => t.description.includes(searchTerm) || t.category.includes(searchTerm));

  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown Account';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">財務紀錄</h2>
        <div className="flex space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜尋交易..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden md:inline">記一筆</span>
            <span className="md:hidden">新增</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          全部
        </button>
        <button 
          onClick={() => setFilterType('INCOME')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filterType === 'INCOME' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
        >
          收入
        </button>
        <button 
          onClick={() => setFilterType('EXPENSE')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filterType === 'EXPENSE' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
        >
          支出
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">日期</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">類別/描述</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">帳戶</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">金額</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{t.date.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{t.description}</span>
                    <span className="text-xs text-slate-500 inline-block px-2 py-0.5 rounded bg-slate-100 w-fit mt-1">{t.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{getAccountName(t.accountId)}</td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-green-600' : 'text-slate-800'}`}>
                  {t.type === 'EXPENSE' ? '-' : '+'}${t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">沒有符合的交易紀錄</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">新增交易</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
                <button type="button" onClick={() => setType('EXPENSE')} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${type === 'EXPENSE' ? 'bg-white shadow text-red-600' : 'text-slate-500'}`}>支出</button>
                <button type="button" onClick={() => setType('INCOME')} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${type === 'INCOME' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}>收入</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">金額</label>
                <input required type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold" placeholder="0" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">類別</label>
                <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶</label>
                <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：午餐、薪水" />
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

export default Transactions;