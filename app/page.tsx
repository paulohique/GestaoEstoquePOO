"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Users, Package, UserCheck, FileText, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"
import ClienteManager from "@/components/cliente-manager"
import FuncionarioManager from "@/components/funcionario-manager"
import ProdutoManager from "@/components/produto-manager"
import AluguelManager from "@/components/aluguel-manager"
import RelatorioManager from "@/components/relatorio-manager"

interface DashboardData {
  totalVendas: number
  alugueisAtivos: number
  produtosEstoque: number
  produtosEstoqueBaixo: number
  clientesAtivos: number
  alugueisMes: number
  valorTotalMes: number
}

interface Aluguel {
  id: number
  dataAluguel: string
  cliente: { nome: string } | null
  funcionario: { nome: string }
  valorTotal: number
  formaPagamento: string
  itensAlugados: Array<{
    produto: { nome: string }
    quantidade: number
  }>
}

interface Produto {
  id: number
  nome: string
  estoque: number
  preco: number
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalVendas: 0,
    alugueisAtivos: 0,
    produtosEstoque: 0,
    produtosEstoqueBaixo: 0,
    clientesAtivos: 0,
    alugueisMes: 0,
    valorTotalMes: 0,
  })
  const [recentAlugueis, setRecentAlugueis] = useState<Aluguel[]>([])
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Buscar dados de diferentes endpoints
      const [alugueisRes, clientesRes, produtosRes] = await Promise.all([
        fetch("http://localhost:8080/alugueis"),
        fetch("http://localhost:8080/clientes"),
        fetch("http://localhost:8080/produtos"),
      ])

      const alugueis: Aluguel[] = alugueisRes.ok ? await alugueisRes.json() : []
      const clientes = clientesRes.ok ? await clientesRes.json() : []
      const produtos: Produto[] = produtosRes.ok ? await produtosRes.json() : []

      // Calcular métricas
      const hoje = new Date()
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

      const alugueisDoMes = alugueis.filter((a) => new Date(a.dataAluguel) >= inicioMes)

      const valorTotalMes = alugueisDoMes.reduce((sum, a) => sum + a.valorTotal, 0)
      const produtosBaixoEstoque = produtos.filter((p) => p.estoque <= 5)
      const totalEstoque = produtos.reduce((sum, p) => sum + p.estoque, 0)

      // Aluguéis recentes (últimos 5)
      const alugueisRecentes = alugueis
          .sort((a, b) => new Date(b.dataAluguel).getTime() - new Date(a.dataAluguel).getTime())
          .slice(0, 5)

      setDashboardData({
        totalVendas: alugueis.reduce((sum, a) => sum + a.valorTotal, 0),
        alugueisAtivos: alugueis.length,
        produtosEstoque: totalEstoque,
        produtosEstoqueBaixo: produtosBaixoEstoque.length,
        clientesAtivos: clientes.length,
        alugueisMes: alugueisDoMes.length,
        valorTotalMes,
      })

      setRecentAlugueis(alugueisRecentes)
      setProdutosEstoqueBaixo(produtosBaixoEstoque.slice(0, 5))
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusBadge = (formaPagamento: string) => {
    const colors: { [key: string]: string } = {
      DINHEIRO: "bg-green-100 text-green-800",
      CARTAO_CREDITO: "bg-blue-100 text-blue-800",
      CARTAO_DEBITO: "bg-purple-100 text-purple-800",
      PIX: "bg-orange-100 text-orange-800",
    }
    return colors[formaPagamento] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Gestão de Estoque</h1>
            <p className="text-gray-600">Gerencie seus produtos, clientes, funcionários e aluguéis de forma eficiente</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 lg:w-fit">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="clientes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="funcionarios" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Funcionários
              </TabsTrigger>
              <TabsTrigger value="produtos" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="alugueis" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Aluguéis
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                    <DollarSign className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalVendas)}</div>
                    <p className="text-xs opacity-80">{formatCurrency(dashboardData.valorTotalMes)} este mês</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aluguéis Registrados</CardTitle>
                    <ShoppingCart className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.alugueisAtivos}</div>
                    <p className="text-xs opacity-80">{dashboardData.alugueisMes} novos este mês</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
                    <Package className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.produtosEstoque}</div>
                    <p className="text-xs opacity-80">{dashboardData.produtosEstoqueBaixo} com estoque baixo</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Cadastrados</CardTitle>
                    <Users className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardData.clientesAtivos}</div>
                    <p className="text-xs opacity-80">Total de clientes ativos</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Aluguéis Recentes</CardTitle>
                    <CardDescription>Últimos aluguéis realizados no sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAlugueis.length > 0 ? (
                          recentAlugueis.map((aluguel) => (
                              <div key={aluguel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{aluguel.cliente?.nome || "Cliente não informado"}</p>
                                  <p className="text-sm text-gray-600">
                                    {aluguel.itensAlugados.length > 0
                                        ? `${aluguel.itensAlugados[0].produto.nome} ${aluguel.itensAlugados.length > 1 ? `+${aluguel.itensAlugados.length - 1} itens` : ""}`
                                        : "Sem itens"}
                                  </p>
                                  <p className="text-xs text-gray-500">{formatDate(aluguel.dataAluguel)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatCurrency(aluguel.valorTotal)}</p>
                                  <Badge variant="outline" className={getStatusBadge(aluguel.formaPagamento)}>
                                    {aluguel.formaPagamento.replace("_", " ")}
                                  </Badge>
                                </div>
                              </div>
                          ))
                      ) : (
                          <div className="text-center py-8 text-gray-500">
                            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhum aluguel registrado ainda</p>
                          </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Produtos com Estoque Baixo
                    </CardTitle>
                    <CardDescription>Produtos que precisam de reposição (≤ 5 unidades)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {produtosEstoqueBaixo.length > 0 ? (
                          produtosEstoqueBaixo.map((produto) => (
                              <div
                                  key={produto.id}
                                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-red-900">{produto.nome}</p>
                                  <p className="text-sm text-red-700">Preço: {formatCurrency(produto.preco)}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {produto.estoque} unidades
                                  </Badge>
                                </div>
                              </div>
                          ))
                      ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Todos os produtos têm estoque adequado</p>
                          </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumo Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Mês Atual</CardTitle>
                  <CardDescription>
                    Estatísticas do mês de {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{dashboardData.alugueisMes}</div>
                      <p className="text-sm text-blue-800">Aluguéis este mês</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(dashboardData.valorTotalMes)}
                      </div>
                      <p className="text-sm text-green-800">Faturamento mensal</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboardData.alugueisMes > 0
                            ? formatCurrency(dashboardData.valorTotalMes / dashboardData.alugueisMes)
                            : formatCurrency(0)}
                      </div>
                      <p className="text-sm text-purple-800">Ticket médio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clientes">
              <ClienteManager />
            </TabsContent>

            <TabsContent value="funcionarios">
              <FuncionarioManager />
            </TabsContent>

            <TabsContent value="produtos">
              <ProdutoManager />
            </TabsContent>

            <TabsContent value="alugueis">
              <AluguelManager />
            </TabsContent>

            <TabsContent value="relatorios">
              <RelatorioManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
