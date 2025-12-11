import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Plus, Trash2, Edit2, CreditCard } from 'lucide-react';

interface AccountsProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('TWD');

  const handleOpenModal = (account?: BankAccount) => {
    if (account) {
      setEditingId(account.id);
      setName(account.name);
      setBankName(account.bankName);
      setAccountNumber(account.accountNumber);
      setBalance(account.balance.toString());
      setCurrency(account.currency);
    } else {
      setEditingId(null);
      setName('');
      setBankName('');
      setAccountNumber('');
      setBalance('');
      setCurrency('TWD');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: BankAccount = {
      id: editingId || `acc_${Date.now()}`,
      name,
      bankName,
      accountNumber,
      balance: parseFloat(balance),
      currency,
    };

    if (editingId) {
      setAccounts(prev => prev.map(acc => acc.id === editingId ? newAccount : acc));
    } else {
      setAccounts(prev => [...prev, newAccount]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此帳戶嗎？所有相關交易紀錄將保留，但帳戶將移除。')) {
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">我的帳戶</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          <span>新增帳戶</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-100 rounded-full text-slate-600">
                  <CreditCard size={24} />
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenModal(acc)} className="text-slate-400 hover:text-blue-600 p-1">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(acc.id)} className="text-slate-400 hover:text-red-600 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{acc.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{acc.bankName} • {acc.accountNumber}</p>
              <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-400 uppercase">Balance</span>
                <span className="text-2xl font-bold text-slate-800">${acc.balance.toLocaleString()} <span className="text-sm text-slate-500">{acc.currency}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{editingId ? '編輯帳戶' : '新增帳戶'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶暱稱</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：主要薪轉戶" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">銀行名稱</label>
                <input required type="text" value={bankName} onChange={e => setBankName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例如：中國信託" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳號</label>
                <input required type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">餘額</label>
                  <input required type="number" value={balance} onChange={e => setBalance(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">幣別</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="TWD">TWD</option>
                    <option value="USD">USD</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
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

export default Accounts;