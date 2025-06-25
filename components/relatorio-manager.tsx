"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, Package, Users } from "lucide-react"
import { toast } from "sonner"

export default function RelatorioManager() {
  const [ano, setAno] = useState(new Date().getFullYear().toString())
  const [clienteId, setClienteId] = useState("")
  const [loading, setLoading] = useState(false)

  const downloadRelatorio = async (tipo: string, params?: any) => {
    setLoading(true)
    try {
      let url = `http://localhost:8080/relatorios/${tipo}`

      if (tipo === "vendas-mes" && params?.ano) {
        url += `/${params.ano}`
      } else if (tipo === "vendas-cliente" && params?.clienteId) {
        url += `/${params.clienteId}`
      }

      const response = await fetch(url)

      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = downloadUrl

        // Define o nome do arquivo baseado no tipo de relatório
        let filename = "relatorio.pdf"
        if (tipo === "vendas-mes") {
          filename = `relatorio-vendas-mes-${params?.ano || new Date().getFullYear()}.pdf`
        } else if (tipo === "vendas-cliente") {
          filename = `relatorio-vendas-cliente-${params?.clienteId}.pdf`
        } else if (tipo === "estoque") {
          filename = `relatorio-estoque-${new Date().toISOString().split("T")[0]}.pdf`
        }

        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(downloadUrl)

        toast.success("Relatório baixado com sucesso!")
      } else {
        toast.error("Erro ao gerar relatório")
      }
    } catch (error) {
      toast.error("Erro ao baixar relatório")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios do Sistema</CardTitle>
          <CardDescription>Gere relatórios detalhados sobre vendas, clientes e estoque</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Relatório de Vendas por Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Vendas por Mês
            </CardTitle>
            <CardDescription>Relatório consolidado de vendas mensais por ano</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ano">Ano</Label>
              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => downloadRelatorio("vendas-mes", { ano })} disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Gerando..." : "Baixar Relatório"}
            </Button>
          </CardContent>
        </Card>

        {/* Relatório de Vendas por Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Vendas por Cliente
            </CardTitle>
            <CardDescription>Histórico detalhado de vendas por cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clienteId">ID do Cliente</Label>
              <Input
                id="clienteId"
                type="number"
                placeholder="Digite o ID do cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => downloadRelatorio("vendas-cliente", { clienteId })}
              disabled={loading || !clienteId}
            >
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Gerando..." : "Baixar Relatório"}
            </Button>
          </CardContent>
        </Card>

        {/* Relatório de Estoque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              Gestão de Estoque
            </CardTitle>
            <CardDescription>Relatório completo do estoque atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              Este relatório inclui todos os produtos, quantidades em estoque, preços de compra e venda.
            </div>
            <Button className="w-full" onClick={() => downloadRelatorio("estoque")} disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Gerando..." : "Baixar Relatório"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre os relatórios */}
      <Card>
        <CardHeader>
          <CardTitle>Informações sobre os Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Vendas por Mês</h4>
              <p className="text-sm text-blue-700">
                Mostra o total de vendas, quantidade de transações e ticket médio por mês do ano selecionado.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Vendas por Cliente</h4>
              <p className="text-sm text-green-700">
                Apresenta o histórico completo de compras de um cliente específico, separado por mês.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Gestão de Estoque</h4>
              <p className="text-sm text-purple-700">
                Lista todos os produtos com suas quantidades, preços e status do estoque (baixo, normal, alto).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
