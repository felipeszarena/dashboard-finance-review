import React from 'react';
import { Card } from '@/components/ui/card';
import { Orcamento } from '@/lib/contexts/orcamento-context';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OrcamentoChartsProps {
  orcamentos: Orcamento[];
  selectedMes: string;
}

export function OrcamentoCharts({ orcamentos, selectedMes }: OrcamentoChartsProps) {
  const filteredOrcamentos = React.useMemo(() => {
    return orcamentos.filter(o => o.mes === selectedMes);
  }, [orcamentos, selectedMes]);

  const categoryData = React.useMemo(() => {
    const categories = filteredOrcamentos.reduce((acc, o) => {
      acc[o.categoria] = (acc[o.categoria] || 0) + o.valorOrcado;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(categories).map(c => 
        c.charAt(0).toUpperCase() + c.slice(1)
      ),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC249',
        ],
      }],
    };
  }, [filteredOrcamentos]);

  const comparisonData = React.useMemo(() => {
    const labels = filteredOrcamentos.map(o => 
      o.categoria.charAt(0).toUpperCase() + o.categoria.slice(1)
    );
    const orcado = filteredOrcamentos.map(o => o.valorOrcado);
    const gasto = filteredOrcamentos.map(o => o.valorGasto);

    return {
      labels,
      datasets: [
        {
          label: 'Orçado',
          data: orcado,
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Gasto',
          data: gasto,
          backgroundColor: '#FF6384',
        },
      ],
    };
  }, [filteredOrcamentos]);

  const trendData = React.useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(selectedMes);
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7);
    }).reverse();

    const orcado = months.map(month => {
      return orcamentos
        .filter(o => o.mes === month)
        .reduce((sum, o) => sum + o.valorOrcado, 0);
    });

    const gasto = months.map(month => {
      return orcamentos
        .filter(o => o.mes === month)
        .reduce((sum, o) => sum + o.valorGasto, 0);
    });

    return {
      labels: months.map(m => format(new Date(m), 'MMM/yy')),
      datasets: [
        {
          label: 'Orçado',
          data: orcado,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          fill: true,
        },
        {
          label: 'Gasto',
          data: gasto,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          fill: true,
        },
      ],
    };
  }, [orcamentos, selectedMes]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
        <div className="h-64">
          <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Orçado vs Gasto</h3>
        <div className="h-64">
          <Bar
            data={comparisonData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </Card>

      <Card className="p-4 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Tendência dos Últimos 6 Meses</h3>
        <div className="h-64">
          <Line
            data={trendData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </Card>
    </div>
  );
} 