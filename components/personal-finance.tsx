"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Download, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { PersonalTransaction } from "@/types"

const personalCategories = {
  receita: ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"],
  despesa: ["Alimentação", "Transporte", "Moradia", "Saúde", "Educação", "Lazer", "Compras", "Contas", "Outros"],
}

const initialPersonalTransactions: PersonalTransaction[] = [
  {
    id: 1,
    description: "Salário Janeiro",
    amount: 5000,
    type: "receita",
    date: "2024-01-01",
    category: "Salário",
  },
  {
    id: 2,
    description: "Supermercado",
    amount: -350,
    type: "despesa",
    date: "2024-01-02",
    category: "Alimentação",
  },
  {
    id: 3,
    description: "Freelance Design",
    amount: 1200,
    type: "receita",
    date: "2024-01-03",
    category: "Freelance",
  },
  {
    id: 4,
    description: "Aluguel",
    amount: -1500,
    type: "despesa",
    date: "2024-01-05",
    category: "Moradia",
  },
  {
    id: 5,
    description: "Uber",
    amount: -45,
    type: "despesa",
    date: "2024-01-06",
    category: "Transporte",
  },
  {
    id: 6,
    description: "Cinema",
    amount: -60,
    type: "despesa",
    date: "2024-01-07",
    category: "Lazer",
  },
  {
    id: 7,
    description: "Dividendos",
    amount: 280,
    type: "receita",
    date: "2024-01-08",
    category: "Investimentos",
  },
  {
    id: 8,
    description: "Conta de Luz",
    amount: -120,
    type: "despesa",
    date: "2024-01-10",
    category: "Contas",
  },
]

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#ec4899"]

export function PersonalFinance() {
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("30")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<PersonalTransaction | null>(null)
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: 0,
    type: "receita" as "receita" | "despesa",
    date: new Date().toISOString().split("T")[0],
    category: personalCategories.receita[0],
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("personal-transactions")
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    } else {
      setTransactions(initialPersonalTransactions)
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("personal-transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalReceitas = transactions.filter((t) => t.type === "receita").reduce((sum, t) => sum + t.amount, 0)
  const totalDespesas = Math.abs(transactions.filter((t) => t.type === "despesa").reduce((sum, t) => sum + t.amount, 0))
  const saldoAtual = totalReceitas - totalDespesas

  // Dados para gráfico de pizza (despesas por categoria)
  const expensesByCategory = transactions
    .filter((t) => t.type === "despesa")
    .reduce(
      (acc, transaction) => {
        const category = transaction.category
        acc[category] = (acc[category] || 0) + Math.abs(transaction.amount)
        return acc
      },
      {} as Record<string, number>,
    )

  const pieData = Object.entries(expensesByCategory).map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: COLORS[index % COLORS.length],
  }))

  // Dados para gráfico de barras (receitas vs despesas por mês)
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString("pt-BR", { month: "short" })
      if (!acc[month]) {
        acc[month] = { month, receitas: 0, despesas: 0 }
      }
      if (transaction.type === "receita") {
        acc[month].receitas += transaction.amount
      } else {
        acc[month].despesas += Math.abs(transaction.amount)
      }
      return acc
    },
    {} as Record<string, { month: string; receitas: number; despesas: number }>,
  )

  const barData = Object.values(monthlyData)

  const addTransaction = (transaction: Omit<PersonalTransaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
      amount: transaction.type === "despesa" ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
    }
    setTransactions([...transactions, newTransaction])
  }

  const updateTransaction = (id: number, updates: Partial<PersonalTransaction>) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              amount:
                updates.type === "despesa"
                  ? -Math.abs(updates.amount || t.amount)
                  : Math.abs(updates.amount || t.amount),
            }
          : t,
      ),
    )
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const handleAddTransaction = () => {
    if (newTransaction.description.trim() && newTransaction.amount !== 0) {
      addTransaction(newTransaction)
      setNewTransaction({
        description: "",
        amount: 0,
        type: "receita",
        date: new Date().toISOString().split("T")[0],
        category: personalCategories.receita[0],
      })
      setIsAddOpen(false)
    }
  }

  const handleEditTransaction = () => {
    if (editingTransaction && editingTransaction.description.trim() && editingTransaction.amount !== 0) {
      updateTransaction(editingTransaction.id, editingTransaction)
      setIsEditOpen(false)
      setEditingTransaction(null)
    }
  }

  const handleDeleteTransaction = (transaction: PersonalTransaction) => {
    if (confirm(`Tem certeza que deseja excluir a transação "${transaction.description}"?`)) {
      deleteTransaction(transaction.id)
    }
  }

  const handleTypeChange = (type: "receita" | "despesa") => {
    setNewTransaction({
      ...newTransaction,
      type,
      category: personalCategories[type][0],
    })
  }

  const handleEditTypeChange = (type: "receita" | "despesa") => {
    if (editingTransaction) {
      setEditingTransaction({
        ...editingTransaction,
        type,
        category: personalCategories[type][0],
      })
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Finance Personal Preview</h1>
            <p className="text-sm text-muted-foreground">Controle financeiro pessoal simplificado</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Transação Pessoal</DialogTitle>
                <DialogDescription>Registre uma nova receita ou despesa pessoal</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="Descrição da transação"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={Math.abs(newTransaction.amount)}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={newTransaction.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={newTransaction.category}
                      onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {personalCategories[newTransaction.type].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTransaction}>Adicionar Transação</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Cards de Resumo Financeiro */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {totalReceitas.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">+8.2% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ {totalDespesas.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">+2.1% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${saldoAtual > 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {saldoAtual.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">{saldoAtual > 0 ? "Saldo positivo" : "Saldo negativo"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Poupança</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalReceitas > 0 ? ((saldoAtual / totalReceitas) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Percentual poupado do total de receitas</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfico de Pizza - Despesas por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle>Despesas por Categoria</CardTitle>
              <CardDescription>Distribuição dos seus gastos por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={pieData.reduce((acc, item, index) => {
                  acc[item.name] = {
                    label: item.name,
                    color: COLORS[index % COLORS.length],
                  }
                  return acc
                }, {} as any)}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Receitas vs Despesas */}
          <Card>
            <CardHeader>
              <CardTitle>Receitas vs Despesas</CardTitle>
              <CardDescription>Comparação mensal entre receitas e despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  receitas: {
                    label: "Receitas",
                    color: "#10b981",
                  },
                  despesas: {
                    label: "Despesas",
                    color: "#ef4444",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="receitas" fill="#10b981" />
                    <Bar dataKey="despesas" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Transações */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transações Pessoais</CardTitle>
                <CardDescription>Histórico completo das suas movimentações financeiras</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px]"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {[...personalCategories.receita, ...personalCategories.despesa].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString("pt-BR")}</TableCell>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingTransaction({
                              ...transaction,
                              amount: Math.abs(transaction.amount),
                            })
                            setIsEditOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTransaction(transaction)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Dialog para editar transação */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transação Pessoal</DialogTitle>
            <DialogDescription>Atualize os dados da transação</DialogDescription>
          </DialogHeader>
          {editingTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Input
                  id="edit-description"
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-amount">Valor (R$)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    value={editingTransaction.amount}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Tipo</Label>
                  <Select value={editingTransaction.type} onValueChange={handleEditTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Data</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingTransaction.date}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select
                    value={editingTransaction.category}
                    onValueChange={(value) => setEditingTransaction({ ...editingTransaction, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {personalCategories[editingTransaction.type].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditTransaction}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
