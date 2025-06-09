import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Categoria } from '@/lib/contexts/orcamento-context';
import { format } from 'date-fns';

interface OrcamentoHeaderProps {
  selectedMes: string;
  onMesChange: (mes: string) => void;
  selectedCategoria: Categoria | 'all';
  onCategoriaChange: (categoria: Categoria | 'all') => void;
  onCreateOrcamento: () => void;
}

export function OrcamentoHeader({
  selectedMes,
  onMesChange,
  selectedCategoria,
  onCategoriaChange,
  onCreateOrcamento,
}: OrcamentoHeaderProps) {
  const meses = React.useMemo(() => {
    const result = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      result.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy'),
      });
    }
    return result;
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Select
          value={selectedMes}
          onValueChange={onMesChange}
          options={meses}
          className="w-full sm:w-40"
        />

        <Select
          value={selectedCategoria}
          onValueChange={onCategoriaChange}
          options={[
            { value: 'all', label: 'Todas Categorias' },
            { value: 'alimentacao', label: 'Alimentação' },
            { value: 'transporte', label: 'Transporte' },
            { value: 'moradia', label: 'Moradia' },
            { value: 'lazer', label: 'Lazer' },
            { value: 'saude', label: 'Saúde' },
            { value: 'educacao', label: 'Educação' },
            { value: 'outros', label: 'Outros' },
          ]}
          className="w-full sm:w-40"
        />
      </div>

      <Button onClick={onCreateOrcamento} className="w-full sm:w-auto">
        <Plus className="w-4 h-4 mr-2" />
        Novo Orçamento
      </Button>
    </div>
  );
} 