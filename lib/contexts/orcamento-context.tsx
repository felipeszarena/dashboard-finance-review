import React, { createContext, useContext, useState, useEffect } from 'react';
import { z } from 'zod';
import { useStorage } from '@/lib/hooks/useStorage';

// Types
export type Categoria = 'alimentacao' | 'transporte' | 'moradia' | 'lazer' | 'saude' | 'educacao' | 'outros';

export const OrcamentoSchema = z.object({
  id: z.string(),
  categoria: z.enum(['alimentacao', 'transporte', 'moradia', 'lazer', 'saude', 'educacao', 'outros']),
  valorOrcado: z.number().positive(),
  valorGasto: z.number().min(0),
  mes: z.string().regex(/^\d{4}-\d{2}$/),
  alertas: z.boolean(),
  criadoEm: z.string(),
});

export type Orcamento = z.infer<typeof OrcamentoSchema>;

interface OrcamentoContextType {
  orcamentos: Orcamento[];
  loading: boolean;
  error: string | null;
  addOrcamento: (orcamento: Omit<Orcamento, 'id' | 'criadoEm'>) => Promise<void>;
  updateOrcamento: (id: string, orcamento: Partial<Orcamento>) => Promise<void>;
  deleteOrcamento: (id: string) => Promise<void>;
  getOrcamentosByMes: (mes: string) => Orcamento[];
  getOrcamentosByCategoria: (categoria: Categoria) => Orcamento[];
  getTotalOrcado: (mes?: string) => number;
  getTotalGasto: (mes?: string) => number;
  getSaldoDisponivel: (mes?: string) => number;
}

const OrcamentoContext = createContext<OrcamentoContextType | undefined>(undefined);

export function OrcamentoProvider({ children }: { children: React.ReactNode }) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getItem, setItem } = useStorage();

  useEffect(() => {
    loadOrcamentos();
  }, []);

  const loadOrcamentos = async () => {
    try {
      setLoading(true);
      const data = await getItem('orcamentos');
      if (data) {
        setOrcamentos(JSON.parse(data));
      }
    } catch (err) {
      setError('Erro ao carregar orçamentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveOrcamentos = async (newOrcamentos: Orcamento[]) => {
    try {
      await setItem('orcamentos', JSON.stringify(newOrcamentos));
      setOrcamentos(newOrcamentos);
    } catch (err) {
      setError('Erro ao salvar orçamentos');
      console.error(err);
    }
  };

  const addOrcamento = async (orcamento: Omit<Orcamento, 'id' | 'criadoEm'>) => {
    try {
      const newOrcamento: Orcamento = {
        ...orcamento,
        id: crypto.randomUUID(),
        criadoEm: new Date().toISOString(),
      };
      await saveOrcamentos([...orcamentos, newOrcamento]);
    } catch (err) {
      setError('Erro ao adicionar orçamento');
      console.error(err);
    }
  };

  const updateOrcamento = async (id: string, orcamento: Partial<Orcamento>) => {
    try {
      const newOrcamentos = orcamentos.map(o =>
        o.id === id ? { ...o, ...orcamento } : o
      );
      await saveOrcamentos(newOrcamentos);
    } catch (err) {
      setError('Erro ao atualizar orçamento');
      console.error(err);
    }
  };

  const deleteOrcamento = async (id: string) => {
    try {
      const newOrcamentos = orcamentos.filter(o => o.id !== id);
      await saveOrcamentos(newOrcamentos);
    } catch (err) {
      setError('Erro ao deletar orçamento');
      console.error(err);
    }
  };

  const getOrcamentosByMes = (mes: string) => {
    return orcamentos.filter(o => o.mes === mes);
  };

  const getOrcamentosByCategoria = (categoria: Categoria) => {
    return orcamentos.filter(o => o.categoria === categoria);
  };

  const getTotalOrcado = (mes?: string) => {
    return orcamentos
      .filter(o => !mes || o.mes === mes)
      .reduce((sum, o) => sum + o.valorOrcado, 0);
  };

  const getTotalGasto = (mes?: string) => {
    return orcamentos
      .filter(o => !mes || o.mes === mes)
      .reduce((sum, o) => sum + o.valorGasto, 0);
  };

  const getSaldoDisponivel = (mes?: string) => {
    return getTotalOrcado(mes) - getTotalGasto(mes);
  };

  return (
    <OrcamentoContext.Provider
      value={{
        orcamentos,
        loading,
        error,
        addOrcamento,
        updateOrcamento,
        deleteOrcamento,
        getOrcamentosByMes,
        getOrcamentosByCategoria,
        getTotalOrcado,
        getTotalGasto,
        getSaldoDisponivel,
      }}
    >
      {children}
    </OrcamentoContext.Provider>
  );
}

export function useOrcamento() {
  const context = useContext(OrcamentoContext);
  if (context === undefined) {
    throw new Error('useOrcamento must be used within an OrcamentoProvider');
  }
  return context;
} 