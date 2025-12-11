import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { FinancialState, Category } from '../types';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardProps {
  data: FinancialState;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalBalance = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalInvestmentValue = data.investments.reduce((sum, inv) => {
     // Simplification: assuming USD:TWD = 1:32 for quick aggregate, ideally we handle currency better
     const rate = inv.currency === 'USD' ? 32 : 1;
     return sum + (inv.shares * inv.currentPrice * rate);
  }, 0);
  const totalAssets = totalBalance + totalInvestmentValue;

  const expenses = data.transactions.filter(t => t.type === 'EXPENSE');
  const income = data.transactions.filter(t => t.type === 'INCOME');

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">總資產 (TWD)</p>
              <h3 className="text-2xl font-bold text-slate-800">${totalAssets.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">本月收入</p>
              <h3 className="text-2xl font-bold text-slate-800">${totalIncome.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <ArrowDownRight size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">本月支出</p>
              <h3 className="text-2xl font-bold text-slate-800">${totalExpense.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">支出分類分析</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">尚無支出資料</div>
            )}
          </div>
        </div>

        {/* Investment Quick View */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">投資組合概況</h3>
          <div className="space-y-4">
            {data.investments.slice(0, 3).map((inv) => {
              const profit = (inv.currentPrice - inv.averageCost) * inv.shares;
              const isProfit = profit >= 0;
              return (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded shadow-sm">
                      <TrendingUp size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{inv.name}</p>
                      <p className="text-xs text-slate-500">{inv.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">${(inv.currentPrice * inv.shares).toLocaleString()} {inv.currency}</p>
                    <p className={`text-xs font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                      {isProfit ? '+' : ''}{profit.toLocaleString()} ({((profit / (inv.averageCost * inv.shares)) * 100).toFixed(2)}%)
                    </p>
                  </div>
                </div>
              );
            })}
            {data.investments.length === 0 && (
              <div className="text-center text-slate-400 py-4">尚無投資紀錄</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;