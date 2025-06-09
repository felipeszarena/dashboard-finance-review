"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Company, Transaction } from "@/types"

interface ReportsProps {
  companies: Company[]
  transactions: Transaction[]
  selectedCompany: string
}

export function Reports({ companies, transactions, selectedCompany }: ReportsProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div>
          <h1 className="text-lg font-semibold">Relatórios</h1>
          <p className="text-sm text-muted-foreground">Análises detalhadas e relatórios financeiros</p>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Avançados</CardTitle>
            <CardDescription>Em desenvolvimento - Em breve você terá acesso a relatórios completos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta seção incluirá fluxo de caixa projetado, DRE simplificado, gráficos de tendência e comparações ano a
              ano.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
