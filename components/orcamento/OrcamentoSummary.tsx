import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Orcamento } from '@/lib/contexts/orcamento-context';

interface OrcamentoSummaryProps {
  orcamentos: Orcamento[];
  selectedMes: string;
}

export function OrcamentoSummary({ orcamentos, selectedMes }: OrcamentoSummaryProps) {
  const stats = React.useMemo(() => {
    const filtered = orcamentos.filter(o => o.mes === selectedMes);

    const totalOrcado = filtered.reduce((sum, o) => sum + o.valorOrcado, 0);
    const totalGasto = filtered.reduce((sum, o) => sum + o.valorGasto, 0);
    const saldoDisponivel = totalOrcado - totalGasto;
    const percentualGasto = totalOrcado > 0 ? (totalGasto / totalOrcado) * 100 : 0;

    return {
      totalOrcado,
      totalGasto,
      saldoDisponivel,
      percentualGasto,
    };
  }, [orcamentos, selectedMes]);

  const getProgressColor = (percent: number) => {
    if (percent < 70) return 'bg-green-500';
    if (percent < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Orçado</h3>
        <p className="text-2xl font-bold mt-2">
          ${stats.totalOrcado.toLocaleString()}
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Gasto: ${stats.totalGasto.toLocaleString()}</span>
            <span>{stats.percentualGasto.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.percentualGasto} 
            className={getProgressColor(stats.percentualGasto)}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Total Gasto</h3>
        <p className="text-2xl font-bold mt-2">
          ${stats.totalGasto.toLocaleString()}
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Orçado: ${stats.totalOrcado.toLocaleString()}</span>
            <span>{stats.percentualGasto.toFixed(1)}%</span>
          </div>
          <Progress 
            value={stats.percentualGasto} 
            className={getProgressColor(stats.percentualGasto)}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Saldo Disponível</h3>
        <p className="text-2xl font-bold mt-2">
          ${stats.saldoDisponivel.toLocaleString()}
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Restante</span>
            <span>{((stats.totalOrcado - stats.totalGasto) / stats.totalOrcado * 100).toFixed(1)}%</span>
          </div>
          <Progress 
            value={((stats.totalOrcado - stats.totalGasto) / stats.totalOrcado * 100)} 
            className={getProgressColor(stats.percentualGasto)}
          />
        </div>
      </Card>
    </div>
  );
} 