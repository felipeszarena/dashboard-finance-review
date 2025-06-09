import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrcamentoSchema, Orcamento, Categoria } from '@/lib/contexts/orcamento-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { format } from 'date-fns';

interface OrcamentoFormProps {
  orcamento?: Orcamento;
  onSubmit: (data: Omit<Orcamento, 'id' | 'criadoEm'>) => void;
  onCancel: () => void;
}

export function OrcamentoForm({ orcamento, onSubmit, onCancel }: OrcamentoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Omit<Orcamento, 'id' | 'criadoEm'>>({
    resolver: zodResolver(OrcamentoSchema.omit({ id: true, criadoEm: true })),
    defaultValues: orcamento || {
      categoria: 'outros',
      valorOrcado: 0,
      valorGasto: 0,
      mes: format(new Date(), 'yyyy-MM'),
      alertas: true,
    },
  });

  const handleFormSubmit = (data: Omit<Orcamento, 'id' | 'criadoEm'>) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select
            value={watch('categoria')}
            onValueChange={(value: Categoria) => setValue('categoria', value)}
            options={[
              { value: 'alimentacao', label: 'Alimentação' },
              { value: 'transporte', label: 'Transporte' },
              { value: 'moradia', label: 'Moradia' },
              { value: 'lazer', label: 'Lazer' },
              { value: 'saude', label: 'Saúde' },
              { value: 'educacao', label: 'Educação' },
              { value: 'outros', label: 'Outros' },
            ]}
          />
          {errors.categoria && (
            <p className="text-sm text-red-500">{errors.categoria.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mês</label>
          <Input
            type="month"
            {...register('mes')}
            value={watch('mes')}
            onChange={(e) => setValue('mes', e.target.value)}
          />
          {errors.mes && (
            <p className="text-sm text-red-500">{errors.mes.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Valor Orçado</label>
          <Input
            type="number"
            step="0.01"
            {...register('valorOrcado', { valueAsNumber: true })}
          />
          {errors.valorOrcado && (
            <p className="text-sm text-red-500">{errors.valorOrcado.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Valor Gasto</label>
          <Input
            type="number"
            step="0.01"
            {...register('valorGasto', { valueAsNumber: true })}
          />
          {errors.valorGasto && (
            <p className="text-sm text-red-500">{errors.valorGasto.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Alertas</label>
          <Select
            value={watch('alertas') ? 'true' : 'false'}
            onValueChange={(value) => setValue('alertas', value === 'true')}
            options={[
              { value: 'true', label: 'Ativado' },
              { value: 'false', label: 'Desativado' },
            ]}
          />
          {errors.alertas && (
            <p className="text-sm text-red-500">{errors.alertas.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {orcamento ? 'Atualizar' : 'Criar'} Orçamento
        </Button>
      </div>
    </form>
  );
} 