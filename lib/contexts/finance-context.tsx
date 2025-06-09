import React, { createContext, useContext, useState, useCallback } from 'react';
import { z } from 'zod';

// Schema definitions
const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string(),
  amount: z.number(),
  description: z.string(),
  date: z.string(),
  account: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

interface FinanceContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getBalance: () => number;
  getIncome: () => number;
  getExpenses: () => number;
  getCategoryTotals: () => Record<string, number>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);

      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const validatedTransaction = TransactionSchema.parse(newTransaction);
      setTransactions(prev => [...prev, validatedTransaction]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add transaction'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, data: Partial<Transaction>) => {
    try {
      setIsLoading(true);
      setError(null);

      setTransactions(prev => prev.map(transaction => {
        if (transaction.id === id) {
          const updated = {
            ...transaction,
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return TransactionSchema.parse(updated);
        }
        return transaction;
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update transaction'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete transaction'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBalance = useCallback(() => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') return acc + transaction.amount;
      if (transaction.type === 'expense') return acc - transaction.amount;
      return acc;
    }, 0);
  }, [transactions]);

  const getIncome = useCallback(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const getExpenses = useCallback(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const getCategoryTotals = useCallback(() => {
    return transactions.reduce((acc, transaction) => {
      const { category, amount, type } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += type === 'income' ? amount : -amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getBalance,
        getIncome,
        getExpenses,
        getCategoryTotals,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
} 