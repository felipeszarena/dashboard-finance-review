import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Orcamento } from '@/lib/contexts/orcamento-context';

interface AlertaOrcamentoProps {
  orcamento: Orcamento;
}

export function AlertaOrcamento({ orcamento }: AlertaOrcamentoProps) {
  const percentual = (orcamento.valorGasto / orcamento.valorOrcado) * 100;

  if (!orcamento.alertas) {
    return null;
  }

  if (percentual >= 100) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Orçamento Excedido!</AlertTitle>
        <AlertDescription>
          O valor gasto (${orcamento.valorGasto.toLocaleString()}) excedeu o orçamento
          (${orcamento.valorOrcado.toLocaleString()}) em {orcamento.categoria}.
        </AlertDescription>
      </Alert>
    );
  }

  if (percentual >= 80) {
    return (
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Atenção: Orçamento Próximo do Limite</AlertTitle>
        <AlertDescription>
          {orcamento.categoria} atingiu {percentual.toFixed(1)}% do orçamento.
          Restam ${(orcamento.valorOrcado - orcamento.valorGasto).toLocaleString()}.
        </AlertDescription>
      </Alert>
    );
  }

  if (percentual <= 50) {
    return (
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Orçamento Sob Controle</AlertTitle>
        <AlertDescription>
          {orcamento.categoria} está em {percentual.toFixed(1)}% do orçamento.
          Restam ${(orcamento.valorOrcado - orcamento.valorGasto).toLocaleString()}.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
} 