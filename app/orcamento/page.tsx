import React from 'react';
import { useOrcamento } from '@/lib/contexts/orcamento-context';
import { OrcamentoHeader } from '@/components/orcamento/OrcamentoHeader';
import { OrcamentoSummary } from '@/components/orcamento/OrcamentoSummary';
import { OrcamentoTable } from '@/components/orcamento/OrcamentoTable';
import { OrcamentoCharts } from '@/components/orcamento/OrcamentoCharts';
import { OrcamentoForm } from '@/components/orcamento/OrcamentoForm';
import { AlertaOrcamento } from '@/components/orcamento/AlertaOrcamento';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Categoria } from '@/lib/contexts/orcamento-context';

export default function OrcamentoPage() {
  const [selectedMes, setSelectedMes] = React.useState(format(new Date(), 'yyyy-MM'));
  const [selectedCategoria, setSelectedCategoria] = React.useState<Categoria | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingOrcamento, setEditingOrcamento] = React.useState<string | null>(null);

  const {
    orcamentos,
    loading,
    error,
    addOrcamento,
    updateOrcamento,
    deleteOrcamento,
  } = useOrcamento();

  const filteredOrcamentos = React.useMemo(() => {
    let filtered = orcamentos || [];
    
    if (selectedMes) {
      filtered = filtered.filter(o => o.mes === selectedMes);
    }
    
    if (selectedCategoria !== 'all') {
      filtered = filtered.filter(o => o.categoria === selectedCategoria);
    }
    
    return filtered;
  }, [orcamentos, selectedMes, selectedCategoria]);

  const handleCreateOrcamento = () => {
    setEditingOrcamento(null);
    setIsFormOpen(true);
  };

  const handleEditOrcamento = (orcamentoId: string) => {
    setEditingOrcamento(orcamentoId);
    setIsFormOpen(true);
  };

  const handleDeleteOrcamento = async (orcamentoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      await deleteOrcamento(orcamentoId);
    }
  };

  const handleSubmitOrcamento = async (data: any) => {
    if (editingOrcamento) {
      await updateOrcamento(editingOrcamento, data);
    } else {
      await addOrcamento(data);
    }
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">Erro: {error}</div>
      </div>
    );
  }

  const orcamentoToEdit = editingOrcamento
    ? orcamentos.find(o => o.id === editingOrcamento)
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <OrcamentoHeader
        selectedMes={selectedMes}
        onMesChange={setSelectedMes}
        selectedCategoria={selectedCategoria}
        onCategoriaChange={setSelectedCategoria}
        onCreateOrcamento={handleCreateOrcamento}
      />

      <div className="space-y-4">
        {filteredOrcamentos.map(orcamento => (
          <AlertaOrcamento key={orcamento.id} orcamento={orcamento} />
        ))}
      </div>

      <div className="grid gap-6 mt-6">
        <OrcamentoSummary
          orcamentos={filteredOrcamentos}
          selectedMes={selectedMes}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrcamentoCharts
            orcamentos={filteredOrcamentos}
            selectedMes={selectedMes}
          />
        </div>

        <OrcamentoTable
          orcamentos={filteredOrcamentos}
          onEdit={handleEditOrcamento}
          onDelete={handleDeleteOrcamento}
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <OrcamentoForm
            orcamento={orcamentoToEdit}
            onSubmit={handleSubmitOrcamento}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 