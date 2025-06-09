"use client"

import { Building2, DollarSign, TrendingDown, TrendingUp, Bell, Moon, Sun } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Company, Transaction } from "@/types"

interface DashboardProps {
  companies: Company[]
  transactions: Transaction[]
  selectedCompany: string
}

const monthlyData = [
  { month: "Jan", "Tech Solutions": 45000, "Marketing Pro": 32000, "Design Studio": 28000 },
  { month: "Fev", "Tech Solutions": 52000, "Marketing Pro": 38000, "Design Studio": 31000 },
  { month: "Mar", "Tech Solutions": 48000, "Marketing Pro": 35000, "Design Studio": 29000 },
  { month: "Abr", "Tech Solutions": 61000, "Marketing Pro": 42000, "Design Studio": 35000 },
  { month: "Mai", "Tech Solutions": 55000, "Marketing Pro": 39000, "Design Studio": 33000 },
  { month: "Jun", "Tech Solutions": 67000, "Marketing Pro": 45000, "Design Studio": 38000 },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

export function Dashboard({ companies, transactions, selectedCompany }: DashboardProps) {
  const filteredCompanies =
    selectedCompany === "all" ? companies : companies.filter((c) => c.id.toString() === selectedCompany)

  const filteredTransactions =
    selectedCompany === "all"
      ? transactions.slice(0, 5)
      : transactions.filter((t) => t.companyId.toString() === selectedCompany).slice(0, 5)

  const totalRevenue = filteredCompanies.reduce((sum, company) => sum + company.revenue, 0)
  const totalExpenses = filteredCompanies.reduce((sum, company) => sum + company.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses

  const getCompanyName = (companyId: number) => {
    return companies.find((c) => c.id === companyId)?.name || "Empresa não encontrada"
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Dashboard Financeiro</h1>
            <p className="text-sm text-muted-foreground">
              {selectedCompany === "all"
                ? "Visão geral de todas as empresas"
                : `Visão da ${companies.find((c) => c.id.toString() === selectedCompany)?.name}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {totalRevenue.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">+12.5% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ {totalExpenses.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">+3.2% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalProfit > 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {totalProfit.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                Margem de {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredCompanies.length}</div>
              <p className="text-xs text-muted-foreground">
                {selectedCompany === "all" ? "Total de empresas" : "Empresa selecionada"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards das Empresas */}
        <div className="grid gap-4 md:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: company.color }} />
                  {company.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Receita:</span>
                  <span className="font-medium text-green-600">R$ {company.revenue.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Despesas:</span>
                  <span className="font-medium text-red-600">R$ {company.expenses.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-medium">Lucro:</span>
                  <span className={`font-bold ${company.profit > 0 ? "text-green-600" : "text-red-600"}`}>
                    R$ {company.profit.toLocaleString("pt-BR")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de Performance Mensal */}
        {selectedCompany === "all" && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Mensal por Empresa</CardTitle>
              <CardDescription>Comparação de receitas mensais entre as empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  "Tech Solutions": {
                    label: "Tech Solutions",
                    color: "#3b82f6",
                  },
                  "Marketing Pro": {
                    label: "Marketing Pro",
                    color: "#10b981",
                  },
                  "Design Studio": {
                    label: "Design Studio",
                    color: "#f59e0b",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="Tech Solutions" fill="#3b82f6" />
                    <Bar dataKey="Marketing Pro" fill="#10b981" />
                    <Bar dataKey="Design Studio" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Tabela de Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              {selectedCompany === "all"
                ? "Últimas movimentações de todas as empresas"
                : `Últimas movimentações da ${companies.find((c) => c.id.toString() === selectedCompany)?.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{getCompanyName(transaction.companyId)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "receita" ? "default" : "destructive"}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      R$ {Math.abs(transaction.amount).toLocaleString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
