"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Company } from "@/types"

interface BudgetProps {
  companies: Company[]
  selectedCompany: string
}

export function Budget({ companies, selectedCompany }: BudgetProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div>
          <h1 className="text-lg font-semibold">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus orçamentos e metas financeiras</p>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Sistema de Orçamento</CardTitle>
            <CardDescription>Em desenvolvimento - Em breve você poderá gerenciar seus orçamentos aqui</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta seção permitirá criar e gerenciar orçamentos por categoria, comparar orçado vs realizado e receber
              alertas automáticos.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
