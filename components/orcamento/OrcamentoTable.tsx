import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Orcamento } from '@/lib/contexts/orcamento-context';
import { format } from 'date-fns';
import * as LucideIcons from "lucide-react";

interface OrcamentoTableProps {
  orcamentos: Orcamento[];
  onEdit: (orcamentoId: string) => void;
  onDelete: (id: string) => void;
}

type SortField = 'categoria' | 'valorOrcado' | 'valorGasto' | 'percentual';
type SortOrder = 'asc' | 'desc';

export function OrcamentoTable({ orcamentos, onEdit, onDelete }: OrcamentoTableProps) {
  const [sortField, setSortField] = React.useState<SortField>('categoria');
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc');

  const sortedOrcamentos = React.useMemo(() => {
    return [...orcamentos].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'categoria':
          comparison = a.categoria.localeCompare(b.categoria);
          break;
        case 'valorOrcado':
          comparison = a.valorOrcado - b.valorOrcado;
          break;
        case 'valorGasto':
          comparison = a.valorGasto - b.valorGasto;
          break;
        case 'percentual':
          const percentA = (a.valorGasto / a.valorOrcado) * 100;
          const percentB = (b.valorGasto / b.valorOrcado) * 100;
          comparison = percentA - percentB;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [orcamentos, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent < 70) return 'bg-green-500';
    if (percent < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const IconComponent = LucideIcons[orcamento.icon as keyof typeof LucideIcons];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('categoria')}
            >
              Categoria
              {sortField === 'categoria' && (
                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('valorOrcado')}
            >
              Orçado
              {sortField === 'valorOrcado' && (
                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('valorGasto')}
            >
              Gasto
              {sortField === 'valorGasto' && (
                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('percentual')}
            >
              Progresso
              {sortField === 'percentual' && (
                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrcamentos.map((orcamento) => {
            const percentual = (orcamento.valorGasto / orcamento.valorOrcado) * 100;
            
            return (
              <TableRow key={orcamento.id}>
                <TableCell className="font-medium">
                  {orcamento.categoria.charAt(0).toUpperCase() + orcamento.categoria.slice(1)}
                </TableCell>
                <TableCell>${orcamento.valorOrcado.toLocaleString()}</TableCell>
                <TableCell>${orcamento.valorGasto.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{percentual.toFixed(1)}%</span>
                      <span>
                        ${(orcamento.valorOrcado - orcamento.valorGasto).toLocaleString()}
                      </span>
                    </div>
                    <Progress 
                      value={percentual} 
                      className={getProgressColor(percentual)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(orcamento.id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(orcamento.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Excluir
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 