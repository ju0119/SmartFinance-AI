import { GoogleGenAI } from "@google/genai";
import { Transaction, StockHolding, BankAccount } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  investments: StockHolding[]
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "請設定 API Key 以啟用 AI 財務顧問功能。";

  // Prepare data summary for AI
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.slice(0, 20).map(t => 
    `${t.date.split('T')[0]}: ${t.description} (${t.category}) - ${t.type === 'INCOME' ? '+' : '-'}${t.amount}`
  ).join('\n');
  
  const portfolio = investments.map(i => 
    `${i.name} (${i.symbol}): 持有 ${i.shares} 股, 成本 ${i.averageCost}, 現價 ${i.currentPrice}`
  ).join('\n');

  const prompt = `
    請擔任我的個人財務顧問。以下是我的財務概況：
    
    總存款資產: ${totalBalance} TWD
    
    近期交易紀錄:
    ${recentTransactions}
    
    投資組合:
    ${portfolio}
    
    請根據以上數據，用繁體中文提供：
    1. 我的消費習慣簡短分析。
    2. 針對我的投資組合提供風險評估或建議（注意：請依據一般金融常識，不構成絕對投資建議）。
    3. 給予 3 個具體的理財行動建議。
    請保持語氣專業且鼓勵性。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "無法生成建議。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服務暫時無法使用，請稍後再試。";
  }
};

export const getStockAnalysis = async (symbol: string, name: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "請設定 API Key。";

  const prompt = `
    請針對股票代號 ${symbol} (${name}) 提供一份簡短的市場分析。
    包含：
    1. 該公司的主要業務。
    2. 近期市場關注焦點（請基於你的訓練知識庫）。
    3. 投資該股票的潛在風險。
    請用繁體中文回答，字數控制在 200 字以內。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "無法獲取資訊。";
  } catch (error) {
    console.error(error);
    return "分析失敗。";
  }
};