import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  Bot, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Investments from './components/Investments';
import AIAdvisor from './components/AIAdvisor';
import ProfileSettings from './components/ProfileSettings';
import { FinancialState, UserProfile } from './types';
import { INITIAL_ACCOUNTS, INITIAL_INVESTMENTS, INITIAL_TRANSACTIONS } from './constants';

// Router Type
type View = 'DASHBOARD' | 'ACCOUNTS' | 'TRANSACTIONS' | 'INVESTMENTS' | 'ADVISOR' | 'PROFILE';

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  
  // App Data State (Currently Local, Todo: Connect to Firestore)
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [investments, setInvestments] = useState(INITIAL_INVESTMENTS);
  
  // UI State
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth UI State
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Mock Auth State Listener
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate checking local storage or session
      const storedUser = localStorage.getItem('mock_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, []);

  // Derived state bundle for child components
  const fullState: FinancialState = { 
    user: currentUser || { id: '', name: '', email: '', isLoggedIn: false }, 
    accounts, 
    transactions, 
    investments 
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoadingAuth(true);
    
    // Simulate Network Request
    setTimeout(() => {
        if (authForm.email && authForm.password) {
            // Mock Login Success
            const user: UserProfile = {
                id: 'user_mock_' + Date.now(),
                name: authForm.email.split('@')[0], // Default name
                email: authForm.email,
                isLoggedIn: true
            };
            setCurrentUser(user);
            localStorage.setItem('mock_user', JSON.stringify(user));
            
            setAuthForm({ name: '', email: '', password: '' });
            setCurrentView('DASHBOARD');
        } else {
            setAuthError('登入失敗：請檢查帳號密碼');
        }
        setIsLoadingAuth(false);
    }, 800);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authForm.name || !authForm.email || !authForm.password) {
      setAuthError('請填寫所有欄位');
      return;
    }

    setIsLoadingAuth(true);

    // Simulate Network Request
    setTimeout(() => {
        const user: UserProfile = {
            id: 'user_mock_' + Date.now(),
            name: authForm.name,
            email: authForm.email,
            isLoggedIn: true
        };
        
        setCurrentUser(user);
        localStorage.setItem('mock_user', JSON.stringify(user));
        
        setAuthForm({ name: '', email: '', password: '' });
        setCurrentView('DASHBOARD');
        setIsLoadingAuth(false);
    }, 800);
  };

  const handleLogout = async () => {
    setIsLoadingAuth(true);
    setTimeout(() => {
        localStorage.removeItem('mock_user');
        setCurrentUser(null);
        setCurrentView('DASHBOARD');
        setAuthMode('LOGIN');
        setAuthError('');
        setIsLoadingAuth(false);
    }, 500);
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    // Mock Update
    setCurrentUser(updatedUser);
    localStorage.setItem('mock_user', JSON.stringify(updatedUser));
  };

  if (isLoadingAuth) {
     return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
       </div>
     );
  }

  // Auth Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">SmartFinance AI</h1>
            <p className="text-slate-500">您的個人智慧財務管家</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
            <button 
              onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === 'LOGIN' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              登入
            </button>
            <button 
              onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${authMode === 'REGISTER' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              註冊
            </button>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {authError}
            </div>
          )}

          <form onSubmit={authMode === 'LOGIN' ? handleLogin : handleRegister} className="space-y-4">
            {authMode === 'REGISTER' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                <input 
                  type="text" 
                  value={authForm.name}
                  onChange={e => setAuthForm({...authForm, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="請輸入姓名"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">電子郵件</label>
              <input 
                type="email" 
                value={authForm.email}
                onChange={e => setAuthForm({...authForm, email: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
              <input 
                type="password" 
                value={authForm.password}
                onChange={e => setAuthForm({...authForm, password: e.target.value})}
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="********"
              />
            </div>
            <button type="button" onClick={() => {
                // Quick fill helper for demo/testing if needed, or remove
                setAuthForm(prev => ({...prev, email: 'demo@example.com', password: 'password123'}));
            }} className="text-xs text-slate-300 hover:text-slate-500">
               (Demo Fill)
            </button>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg">
              {authMode === 'LOGIN' ? '登入系統' : '註冊帳號'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main App Layout
  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        currentView === view 
          ? 'bg-blue-50 text-blue-600 font-semibold' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm z-20 sticky top-0">
        <div className="font-bold text-xl text-blue-600">SmartFinance AI</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 bg-white w-64 border-r border-slate-200 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-10 flex flex-col`}>
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">SmartFinance</h1>
          <p className="text-xs text-slate-400 mt-1">Personal Wealth Manager</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem view="DASHBOARD" icon={LayoutDashboard} label="總覽儀表板" />
          <NavItem view="ACCOUNTS" icon={CreditCard} label="銀行帳戶" />
          <NavItem view="TRANSACTIONS" icon={Receipt} label="收支紀錄" />
          <NavItem view="INVESTMENTS" icon={TrendingUp} label="投資組合" />
          <NavItem view="ADVISOR" icon={Bot} label="AI 顧問" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setCurrentView('PROFILE')}
            className={`w-full flex items-center p-3 mb-2 rounded-lg transition text-left group ${currentView === 'PROFILE' ? 'bg-blue-50 ring-1 ring-blue-200' : 'hover:bg-slate-50'}`}
          >
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3 group-hover:bg-blue-200 transition">
              <User size={16} />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-slate-800 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
            <Settings size={16} className="text-slate-400 group-hover:text-blue-500" />
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={16} />
            <span>登出</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {currentView === 'DASHBOARD' && <Dashboard data={fullState} />}
          {currentView === 'ACCOUNTS' && <Accounts accounts={accounts} setAccounts={setAccounts} />}
          {currentView === 'TRANSACTIONS' && <Transactions transactions={transactions} setTransactions={setTransactions} accounts={accounts} setAccounts={setAccounts} />}
          {currentView === 'INVESTMENTS' && <Investments investments={investments} setInvestments={setInvestments} />}
          {currentView === 'ADVISOR' && <AIAdvisor data={fullState} />}
          {currentView === 'PROFILE' && <ProfileSettings user={currentUser} onUpdateUser={handleUpdateUser} />}
        </div>
      </main>

    </div>
  );
};

export default App;