"use client"

import { useState, useEffect } from "react"
import { Dashboard } from "@/components/dashboard"
import { Transactions } from "@/components/transactions"
import { Budget } from "@/components/budget"
import { Reports } from "@/components/reports"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import type { Company, Transaction, User } from "@/types"
// Adicionar o import do novo componente
import { PersonalFinance } from "@/components/personal-finance"
// Adicionar o import do componente Goals:
import { Goals } from "@/components/goals"

// Dados iniciais
const initialCompanies: Company[] = [
  { id: 1, name: "Tech Solutions", revenue: 125000, expenses: 85000, profit: 40000, color: "#3b82f6" },
  { id: 2, name: "Marketing Pro", revenue: 95000, expenses: 72000, profit: 23000, color: "#10b981" },
  { id: 3, name: "Design Studio", revenue: 78000, expenses: 58000, profit: 20000, color: "#f59e0b" },
]

const initialTransactions: Transaction[] = [
  {
    id: 1,
    companyId: 1,
    description: "Pagamento Cliente ABC",
    amount: 15000,
    type: "receita",
    date: "2024-01-15",
    category: "Vendas",
  },
  {
    id: 2,
    companyId: 2,
    description: "Campanha Google Ads",
    amount: -3500,
    type: "despesa",
    date: "2024-01-14",
    category: "Marketing",
  },
  {
    id: 3,
    companyId: 3,
    description: "Projeto Logo Empresa XYZ",
    amount: 8000,
    type: "receita",
    date: "2024-01-13",
    category: "Design",
  },
  {
    id: 4,
    companyId: 1,
    description: "Salários Equipe",
    amount: -25000,
    type: "despesa",
    date: "2024-01-12",
    category: "Pessoal",
  },
  {
    id: 5,
    companyId: 2,
    description: "Consultoria SEO",
    amount: 12000,
    type: "receita",
    date: "2024-01-11",
    category: "Serviços",
  },
]

const initialUser: User = {
  id: 1,
  name: "João Silva",
  email: "joao@exemplo.com",
  avatar: "",
}

export default function FinancialSystem() {
  const [currentSection, setCurrentSection] = useState("dashboard")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [companies, setCompanies] = useState<Company[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [user, setUser] = useState<User>(initialUser)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCompanies = localStorage.getItem("financial-companies")
    const savedTransactions = localStorage.getItem("financial-transactions")
    const savedUser = localStorage.getItem("financial-user")

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    } else {
      setCompanies(initialCompanies)
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    } else {
      setTransactions(initialTransactions)
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem("financial-companies", JSON.stringify(companies))
    }
  }, [companies])

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("financial-transactions", JSON.stringify(transactions))
    }
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("financial-user", JSON.stringify(user))
  }, [user])

  const addCompany = (company: Omit<Company, "id">) => {
    const newCompany = {
      ...company,
      id: Math.max(...companies.map((c) => c.id), 0) + 1,
    }
    setCompanies([...companies, newCompany])
  }

  const updateCompany = (id: number, updates: Partial<Company>) => {
    setCompanies(companies.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCompany = (id: number) => {
    setCompanies(companies.filter((c) => c.id !== id))
    setTransactions(transactions.filter((t) => t.companyId !== id))
    if (selectedCompany === id.toString()) {
      setSelectedCompany("all")
    }
  }

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map((t) => t.id), 0) + 1,
    }
    setTransactions([...transactions, newTransaction])
  }

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <Dashboard companies={companies} transactions={transactions} selectedCompany={selectedCompany} />
      case "transactions":
        return (
          <Transactions
            companies={companies}
            transactions={transactions}
            selectedCompany={selectedCompany}
            onAddTransaction={addTransaction}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )
      case "budget":
        return <Budget companies={companies} selectedCompany={selectedCompany} />
      case "reports":
        return <Reports companies={companies} transactions={transactions} selectedCompany={selectedCompany} />
      // Adicionar "personal" no switch do renderCurrentSection
      case "personal":
        return <PersonalFinance />
      // No switch do renderCurrentSection, adicionar o case "goals":
      case "goals":
        return <Goals />
      default:
        return <Dashboard companies={companies} transactions={transactions} selectedCompany={selectedCompany} />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        user={user}
        setUser={setUser}
        onAddCompany={addCompany}
        onUpdateCompany={updateCompany}
        onDeleteCompany={deleteCompany}
      />
      <SidebarInset>{renderCurrentSection()}</SidebarInset>
    </SidebarProvider>
  )
}
