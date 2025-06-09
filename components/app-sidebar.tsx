"use client"

import { useState } from "react"
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash2,
  UserIcon,
  User,
  Target,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Company, AppUser } from "@/types"

interface AppSidebarProps {
  companies: Company[]
  selectedCompany: string
  setSelectedCompany: (company: string) => void
  currentSection: string
  setCurrentSection: (section: string) => void
  user: AppUser
  setUser: (user: AppUser) => void
  onAddCompany: (company: Omit<Company, "id">) => void
  onUpdateCompany: (id: number, updates: Partial<Company>) => void
  onDeleteCompany: (id: number) => void
}

const colors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
]

export function AppSidebar({
  companies,
  selectedCompany,
  setSelectedCompany,
  currentSection,
  setCurrentSection,
  user,
  setUser,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
}: AppSidebarProps) {
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [newCompany, setNewCompany] = useState({
    name: "",
    revenue: 0,
    expenses: 0,
    profit: 0,
    color: colors[0],
  })
  const [editUser, setEditUser] = useState(user)

  const handleAddCompany = () => {
    if (newCompany.name.trim()) {
      onAddCompany({
        ...newCompany,
        profit: newCompany.revenue - newCompany.expenses,
      })
      setNewCompany({
        name: "",
        revenue: 0,
        expenses: 0,
        profit: 0,
        color: colors[0],
      })
      setIsAddCompanyOpen(false)
    }
  }

  const handleEditCompany = () => {
    if (editingCompany && editingCompany.name.trim()) {
      onUpdateCompany(editingCompany.id, {
        ...editingCompany,
        profit: editingCompany.revenue - editingCompany.expenses,
      })
      setIsEditCompanyOpen(false)
      setEditingCompany(null)
    }
  }

  const handleDeleteCompany = (company: Company) => {
    if (confirm(`Tem certeza que deseja excluir a empresa "${company.name}"?`)) {
      onDeleteCompany(company.id)
    }
  }

  const handleEditUser = () => {
    setUser(editUser)
    setIsEditUserOpen(false)
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "transactions", label: "Transações", icon: DollarSign },
    { id: "personal", label: "Finance Personal", icon: User },
    { id: "goals", label: "Metas Financeiras", icon: Target },
    { id: "budget", label: "Orçamentos", icon: Calendar },
    { id: "reports", label: "Relatórios", icon: Users },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Building2 className="h-6 w-6" />
          <span className="font-semibold">Sistema Financeiro</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between">
            <SidebarGroupLabel>Empresas</SidebarGroupLabel>
            <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Empresa</DialogTitle>
                  <DialogDescription>Preencha os dados da nova empresa</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      placeholder="Digite o nome da empresa"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="revenue">Receita (R$)</Label>
                      <Input
                        id="revenue"
                        type="number"
                        value={newCompany.revenue}
                        onChange={(e) => setNewCompany({ ...newCompany, revenue: Number(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expenses">Despesas (R$)</Label>
                      <Input
                        id="expenses"
                        type="number"
                        value={newCompany.expenses}
                        onChange={(e) => setNewCompany({ ...newCompany, expenses: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Cor da Empresa</Label>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`h-8 w-8 rounded-full border-2 ${
                            newCompany.color === color ? "border-gray-400" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCompany({ ...newCompany, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddCompany}>Adicionar Empresa</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={selectedCompany === "all"} onClick={() => setSelectedCompany("all")}>
                  <Building2 className="h-4 w-4" />
                  <span>Todas as Empresas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {companies.map((company) => (
                <SidebarMenuItem key={company.id}>
                  <div className="flex items-center w-full">
                    <SidebarMenuButton
                      isActive={selectedCompany === company.id.toString()}
                      onClick={() => setSelectedCompany(company.id.toString())}
                      className="flex-1"
                    >
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: company.color }} />
                      <span>{company.name}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCompany(company)
                            setIsEditCompanyOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteCompany(company)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={currentSection === item.id} onClick={() => setCurrentSection(item.id)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <UserIcon className="h-4 w-4" />
                  <span>{user.name}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={() => setIsEditUserOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Dialog para editar empresa */}
      <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>Atualize os dados da empresa</DialogDescription>
          </DialogHeader>
          {editingCompany && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nome da Empresa</Label>
                <Input
                  id="edit-name"
                  value={editingCompany.name}
                  onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-revenue">Receita (R$)</Label>
                  <Input
                    id="edit-revenue"
                    type="number"
                    value={editingCompany.revenue}
                    onChange={(e) => setEditingCompany({ ...editingCompany, revenue: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-expenses">Despesas (R$)</Label>
                  <Input
                    id="edit-expenses"
                    type="number"
                    value={editingCompany.expenses}
                    onChange={(e) => setEditingCompany({ ...editingCompany, expenses: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Cor da Empresa</Label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 ${
                        editingCompany.color === color ? "border-gray-400" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingCompany({ ...editingCompany, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditCompany}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar usuário */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Atualize suas informações pessoais</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditUser}>Salvar Perfil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
