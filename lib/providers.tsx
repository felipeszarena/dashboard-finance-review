import React from 'react';
import { AuthProvider } from './contexts/auth-context';
import { FinanceProvider } from './contexts/finance-context';
import { MetasProvider } from './contexts/metas-context';
import { StorageProvider } from './contexts/storage-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StorageProvider>
      <AuthProvider>
        <FinanceProvider>
          <MetasProvider>
            {children}
          </MetasProvider>
        </FinanceProvider>
      </AuthProvider>
    </StorageProvider>
  );
} 