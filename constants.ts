import { BankAccount, Category, StockHolding, Transaction, UserProfile } from "./types";

export const INITIAL_USER: UserProfile = {
  id: "user_1",
  name: "王小明",
  email: "ming@example.com",
  password: "password", // Demo password
  isLoggedIn: false,
};

export const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: "acc_1",
    name: "主要薪轉戶",
    bankName: "中國信託",
    accountNumber: "822-1234567890",
    balance: 150000,
    currency: "TWD",
  },
  {
    id: "acc_2",
    name: "生活零用金",
    bankName: "國泰世華",
    accountNumber: "013-0987654321",
    balance: 25000,
    currency: "TWD",
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_1",
    accountId: "acc_1",
    amount: 50000,
    type: "INCOME",
    category: Category.SALARY,
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    description: "十月份薪資",
  },
  {
    id: "tx_2",
    accountId: "acc_2",
    amount: 120,
    type: "EXPENSE",
    category: Category.FOOD,
    date: new Date().toISOString(),
    description: "便利商店午餐",
  },
  {
    id: "tx_3",
    accountId: "acc_2",
    amount: 1280,
    type: "EXPENSE",
    category: Category.TRANSPORT,
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    description: "高鐵票",
  },
  {
    id: "tx_4",
    accountId: "acc_1",
    amount: 3000,
    type: "EXPENSE",
    category: Category.SHOPPING,
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    description: "Uniqlo 服飾",
  }
];

export const INITIAL_INVESTMENTS: StockHolding[] = [
  {
    id: "stk_1",
    symbol: "2330",
    name: "台積電",
    shares: 1000,
    averageCost: 600,
    currentPrice: 1080,
    currency: "TWD",
  },
  {
    id: "stk_2",
    symbol: "0050",
    name: "元大台灣50",
    shares: 2000,
    averageCost: 120,
    currentPrice: 185,
    currency: "TWD",
  },
  {
    id: "stk_3",
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 50,
    averageCost: 150,
    currentPrice: 225,
    currency: "USD",
  },
];