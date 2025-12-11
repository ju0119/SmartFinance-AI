export type TransactionType = 'INCOME' | 'EXPENSE';

export enum Category {
  FOOD = '飲食',
  TRANSPORT = '交通',
  HOUSING = '居住',
  SALARY = '薪資',
  INVESTMENT = '投資',
  ENTERTAINMENT = '娛樂',
  SHOPPING = '購物',
  OTHER = '其他'
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: Category | string;
  date: string; // ISO string
  description: string;
}

export interface StockHolding {
  id: string;
  symbol: string; // e.g., 2330.TW, AAPL
  name: string;
  shares: number;
  averageCost: number; // Average buy price
  currentPrice: number;
  currency: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock auth
  isLoggedIn: boolean;
}

export interface FinancialState {
  user: UserProfile;
  accounts: BankAccount[];
  transactions: Transaction[];
  investments: StockHolding[];
}