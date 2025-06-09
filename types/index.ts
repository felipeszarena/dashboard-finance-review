export interface Company {
  id: number
  name: string
  revenue: number
  expenses: number
  profit: number
  color: string
}

export interface Transaction {
  id: number
  companyId: number
  description: string
  amount: number
  type: "receita" | "despesa"
  date: string
  category: string
}

export interface User {
  id: number
  name: string
  email: string
  avatar: string
}

export interface Budget {
  id: number
  companyId: number
  category: string
  budgeted: number
  spent: number
  month: string
}

export interface AppUser {
  id: number
  name: string
  email: string
  avatar: string
}

export interface PersonalTransaction {
  id: number
  description: string
  amount: number
  type: "receita" | "despesa"
  date: string
  category: string
}

export interface FinancialGoal {
  id: number
  title: string
  description: string
  type: "economia" | "gasto" | "investimento"
  category: string
  targetAmount: number
  currentAmount: number
  deadline: string
  status: "ativa" | "pausada" | "concluida"
  createdAt: string
}
