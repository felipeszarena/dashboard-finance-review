import { useCallback, useMemo } from 'react';
import { useStorage } from '../contexts/storage-context';
import { Transaction } from '../contexts/finance-context';

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryTotals: Record<string, number>;
  monthlyTrends: {
    income: number[];
    expenses: number[];
  };
}

export function useFinance() {
  const { data: storageData, saveData } = useStorage();
  const transactions = storageData?.data.transactions as Transaction[] | undefined;

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!transactions) throw new Error('Transactions not initialized');

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveData('transactions', [...transactions, newTransaction]);
  }, [transactions, saveData]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (!transactions) throw new Error('Transactions not initialized');

    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === id) {
        return {
          ...transaction,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return transaction;
    });

    await saveData('transactions', updatedTransactions);
  }, [transactions, saveData]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!transactions) throw new Error('Transactions not initialized');

    const updatedTransactions = transactions.filter(t => t.id !== id);
    await saveData('transactions', updatedTransactions);
  }, [transactions, saveData]);

  const getFinancialSummary = useCallback((): FinancialSummary => {
    if (!transactions) throw new Error('Transactions not initialized');

    const summary: FinancialSummary = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      categoryTotals: {},
      monthlyTrends: {
        income: Array(12).fill(0),
        expenses: Array(12).fill(0),
      },
    };

    transactions.forEach(transaction => {
      const amount = transaction.amount;
      const month = new Date(transaction.date).getMonth();

      if (transaction.type === 'income') {
        summary.totalIncome += amount;
        summary.monthlyTrends.income[month] += amount;
      } else if (transaction.type === 'expense') {
        summary.totalExpenses += amount;
        summary.monthlyTrends.expenses[month] += amount;
      }

      // Update category totals
      if (!summary.categoryTotals[transaction.category]) {
        summary.categoryTotals[transaction.category] = 0;
      }
      summary.categoryTotals[transaction.category] +=
        transaction.type === 'income' ? amount : -amount;
    });

    summary.balance = summary.totalIncome - summary.totalExpenses;
    return summary;
  }, [transactions]);

  const getTransactionsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    if (!transactions) throw new Error('Transactions not initialized');

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions]);

  const getTransactionsByCategory = useCallback((category: string) => {
    if (!transactions) throw new Error('Transactions not initialized');

    return transactions.filter(transaction => transaction.category === category);
  }, [transactions]);

  const summary = useMemo(() => getFinancialSummary(), [getFinancialSummary]);

  return {
    transactions,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
  };
} 