"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Target, TrendingUp, Calendar, DollarSign, CheckCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { FinancialGoal, PersonalTransaction } from "@/types"

const goalTypes = [
  { value: "economia", label: "Meta de Economia", icon: DollarSign },
  { value: "gasto", label: "Limite de Gasto", icon: TrendingUp },
  { value: "investimento", label: "Meta de Investimento", icon: Target },
]

const goalCategories = [
  "Geral",
  "Emergência",
  "Viagem",
  "Casa",
  "Carro",
  "Educação",
  "Aposentadoria",
  "Investimentos",
  "Alimentação",
  "Lazer",
  "Saúde",
  "Outros",
]

const initialGoals: FinancialGoal[] = [
  {
    id: 1,
    title: "Reserva de Emergência",
    description: "Juntar 6 meses de salário para emergências",
    type: "economia",
    category: "Emergência",
    targetAmount: 30000,
    currentAmount: 18500,
    deadline: "2024-12-31",
    status: "ativa",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    title: "Viagem para Europa",
    description: "Economizar para uma viagem de 15 dias pela Europa",
    type: "economia",
    category: "Viagem",
    targetAmount: 15000,
    currentAmount: 8200,
    deadline: "2024-07-01",
    status: "ativa",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    title: "Controle de Gastos com Lazer",
    description: "Não gastar mais que R$ 800 por mês com entretenimento",
    type: "gasto",
    category: "Lazer",
    targetAmount: 800,
    currentAmount: 650,
    deadline: "2024-01-31",
    status: "ativa",
    createdAt: "2024-01-01",
  },
  {
    id: 4,
    title: "Investimento em Ações",
    description: "Investir R$ 2000 mensais em ações",
    type: "investimento",
    category: "Investimentos",
    targetAmount: 24000,
    currentAmount: 6000,
    deadline: "2024-12-31",
    status: "ativa",
    createdAt: "2024-01-01",
  },
]

export function Goals() {
  const [goals, setGoals] = useState<FinancialGoal[]>([])
  const [transactions, setTransactions] = useState<PersonalTransaction[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    type: "economia" as "economia" | "gasto" | "investimento",
    category: goalCategories[0],
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem("financial-goals")
    const savedTransactions = localStorage.getItem("personal-transactions")

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    } else {
      setGoals(initialGoals)
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("financial-goals", JSON.stringify(goals))
    }
  }, [goals])

  // Atualizar progresso das metas baseado nas transações
  useEffect(() => {
    if (transactions.length > 0 && goals.length > 0) {
      const updatedGoals = goals.map((goal) => {
        if (goal.type === "gasto") {
          // Para metas de gasto, calcular gastos do mês atual na categoria
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()

          const monthlyExpenses = transactions
            .filter((t) => {
              const transactionDate = new Date(t.date)
              return (
                t.type === "despesa" &&
                t.category.toLowerCase().includes(goal.category.toLowerCase()) &&
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
              )
            })
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)

          return { ...goal, currentAmount: monthlyExpenses }
        }
        return goal
      })

      setGoals(updatedGoals)
    }
  }, [transactions])

  const addGoal = (goal: Omit<FinancialGoal, "id" | "status" | "createdAt">) => {
    const newGoal = {
      ...goal,
      id: Math.max(...goals.map((g) => g.id), 0) + 1,
      status: "ativa" as const,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setGoals([...goals, newGoal])
  }

  const updateGoal = (id: number, updates: Partial<FinancialGoal>) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)))
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter((g) => g.id !== id))
  }

  const handleAddGoal = () => {
    if (newGoal.title.trim() && newGoal.targetAmount > 0 && newGoal.deadline) {
      addGoal(newGoal)
      setNewGoal({
        title: "",
        description: "",
        type: "economia",
        category: goalCategories[0],
        targetAmount: 0,
        currentAmount: 0,
        deadline: "",
      })
      setIsAddOpen(false)
    }
  }

  const handleEditGoal = () => {
    if (editingGoal && editingGoal.title.trim() && editingGoal.targetAmount > 0) {
      updateGoal(editingGoal.id, editingGoal)
      setIsEditOpen(false)
      setEditingGoal(null)
    }
  }

  const handleDeleteGoal = (goal: FinancialGoal) => {
    if (confirm(`Tem certeza que deseja excluir a meta "${goal.title}"?`)) {
      deleteGoal(goal.id)
    }
  }

  const toggleGoalStatus = (goal: FinancialGoal) => {
    const newStatus = goal.status === "ativa" ? "pausada" : "ativa"
    updateGoal(goal.id, { status: newStatus })
  }

  const getProgressPercentage = (goal: FinancialGoal) => {
    if (goal.type === "gasto") {
      // Para metas de gasto, mostrar quanto foi gasto em relação ao limite
      return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    }
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  const getProgressColor = (goal: FinancialGoal) => {
    const percentage = getProgressPercentage(goal)

    if (goal.type === "gasto") {
      // Para metas de gasto, vermelho quando ultrapassar o limite
      if (percentage >= 100) return "bg-red-500"
      if (percentage >= 80) return "bg-yellow-500"
      return "bg-green-500"
    }

    // Para metas de economia/investimento
    if (percentage >= 100) return "bg-green-500"
    if (percentage >= 75) return "bg-blue-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const getStatusBadge = (goal: FinancialGoal) => {
    const percentage = getProgressPercentage(goal)
    const isOverdue = new Date(goal.deadline) < new Date()

    if (percentage >= 100) {
      return <Badge className="bg-green-500">Concluída</Badge>
    }

    if (goal.status === "pausada") {
      return <Badge variant="secondary">Pausada</Badge>
    }

    if (isOverdue) {
      return <Badge variant="destructive">Atrasada</Badge>
    }

    if (goal.type === "gasto" && percentage >= 80) {
      return <Badge className="bg-yellow-500">Atenção</Badge>
    }

    return <Badge variant="default">Ativa</Badge>
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const activeGoals = goals.filter((g) => g.status === "ativa")
  const completedGoals = goals.filter((g) => getProgressPercentage(g) >= 100)
  const overdueGoals = goals.filter((g) => new Date(g.deadline) < new Date() && getProgressPercentage(g) < 100)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Metas Financeiras</h1>
            <p className="text-sm text-muted-foreground">Defina e acompanhe suas metas de economia e gastos</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription>Defina uma nova meta financeira para acompanhar seu progresso</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ex: Reserva de emergência"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Descreva sua meta..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo de Meta</Label>
                    <Select
                      value={newGoal.type}
                      onValueChange={(value: "economia" | "gasto" | "investimento") =>
                        setNewGoal({ ...newGoal, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {goalTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={newGoal.category}
                      onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {goalCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="targetAmount">{newGoal.type === "gasto" ? "Limite (R$)" : "Meta (R$)"}</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currentAmount">Valor Atual (R$)</Label>
                    <Input
                      id="currentAmount"
                      type="number"
                      value={newGoal.currentAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddGoal}>Criar Meta</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals.length}</div>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <p className="text-xs text-muted-foreground">Alcançadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metas Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueGoals.length}</div>
              <p className="text-xs text-muted-foreground">Precisam atenção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">Criadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Metas */}
        <div className="grid gap-4">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal)
            const daysRemaining = getDaysRemaining(goal)
            const progressColor = getProgressColor(goal)
            const goalTypeIcon = goalTypes.find((t) => t.value === goal.type)?.icon

            return (
              <Card key={goal.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {goalTypeIcon && <goalTypeIcon className="h-5 w-5" />}
                        {goal.title}
                        {getStatusBadge(goal)}
                      </CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleGoalStatus(goal)}
                        title={goal.status === "ativa" ? "Pausar meta" : "Reativar meta"}
                      >
                        {goal.status === "ativa" ? "⏸️" : "▶️"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingGoal(goal)
                          setIsEditOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {goal.type === "gasto" ? "Gasto atual:" : "Progresso:"} R${" "}
                        {goal.currentAmount.toLocaleString("pt-BR")}
                      </span>
                      <span>
                        {goal.type === "gasto" ? "Limite:" : "Meta:"} R$ {goal.targetAmount.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {progressPercentage.toFixed(1)}% {goal.type === "gasto" ? "utilizado" : "concluído"}
                      </span>
                      <span>
                        {daysRemaining > 0
                          ? `${daysRemaining} dias restantes`
                          : daysRemaining === 0
                            ? "Vence hoje"
                            : `${Math.abs(daysRemaining)} dias atrasado`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Categoria:</span>
                      <p className="font-medium">{goal.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <p className="font-medium">{goalTypes.find((t) => t.value === goal.type)?.label}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Prazo:</span>
                      <p className="font-medium">{new Date(goal.deadline).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>

                  {goal.type === "gasto" && progressPercentage >= 80 && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        {progressPercentage >= 100
                          ? "Limite ultrapassado! Revise seus gastos."
                          : "Atenção: Você está próximo do limite de gastos."}
                      </span>
                    </div>
                  )}

                  {progressPercentage >= 100 && goal.type !== "gasto" && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 dark:text-green-200">
                        Parabéns! Você alcançou sua meta!
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {goals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma meta criada</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comece definindo suas metas financeiras para acompanhar seu progresso
              </p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Meta
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Dialog para editar meta */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
            <DialogDescription>Atualize os dados da sua meta financeira</DialogDescription>
          </DialogHeader>
          {editingGoal && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Título da Meta</Label>
                <Input
                  id="edit-title"
                  value={editingGoal.title}
                  onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={editingGoal.description}
                  onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Tipo de Meta</Label>
                  <Select
                    value={editingGoal.type}
                    onValueChange={(value: "economia" | "gasto" | "investimento") =>
                      setEditingGoal({ ...editingGoal, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select
                    value={editingGoal.category}
                    onValueChange={(value) => setEditingGoal({ ...editingGoal, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {goalCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-targetAmount">
                    {editingGoal.type === "gasto" ? "Limite (R$)" : "Meta (R$)"}
                  </Label>
                  <Input
                    id="edit-targetAmount"
                    type="number"
                    value={editingGoal.targetAmount}
                    onChange={(e) => setEditingGoal({ ...editingGoal, targetAmount: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-currentAmount">Valor Atual (R$)</Label>
                  <Input
                    id="edit-currentAmount"
                    type="number"
                    value={editingGoal.currentAmount}
                    onChange={(e) => setEditingGoal({ ...editingGoal, currentAmount: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-deadline">Prazo</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editingGoal.deadline}
                  onChange={(e) => setEditingGoal({ ...editingGoal, deadline: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditGoal}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
