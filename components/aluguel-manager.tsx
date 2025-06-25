"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"

interface Cliente {
  id: number
  nome: string
  cpf: string
}

interface Funcionario {
  id: number
  nome: string
  cargo: string
}

interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
}

interface ItemAluguel {
  produto: Produto
  quantidade: number
}

interface Aluguel {
  id: number
  dataAluguel: string
  dataInicio: string
  dataTermino: string
  cliente: Cliente
  funcionario: Funcionario
  itensAlugados: ItemAluguel[]
  valorTotal: number
  formaPagamento: string
}

export default function AluguelManager() {
  const [alugueis, setAlugueis] = useState<Aluguel[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    clienteId: "",
    funcionarioId: "",
    dataInicio: "",
    dataTermino: "",
    formaPagamento: "DINHEIRO",
    itens: [] as { produtoId: string; quantidade: string }[],
  })

  useEffect(() => {
    fetchAlugueis()
    fetchClientes()
    fetchFuncionarios()
    fetchProdutos()
  }, [])

  const fetchAlugueis = async () => {
    try {
      const response = await fetch("http://localhost:8080/alugueis")
      if (response.ok) {
        const data = await response.json()
        setAlugueis(data)
      }
    } catch (error) {
      toast.error("Erro ao carregar aluguéis")
    }
  }

  const fetchClientes = async () => {
    try {
      const response = await fetch("http://localhost:8080/clientes")
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      }
    } catch (error) {
      console.error("Erro ao carregar clientes")
    }
  }

  const fetchFuncionarios = async () => {
    try {
      const response = await fetch("http://localhost:8080/funcionarios")
      if (response.ok) {
        const data = await response.json()
        setFuncionarios(data)
      }
    } catch (error) {
      console.error("Erro ao carregar funcionários")
    }
  }

  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:8080/produtos")
      if (response.ok) {
        const data = await response.json()
        setProdutos(data)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const cliente = clientes.find((c) => c.id.toString() === formData.clienteId)
      const funcionario = funcionarios.find((f) => f.id.toString() === formData.funcionarioId)

      const itensAlugados = formData.itens.map((item) => {
        const produto = produtos.find((p) => p.id.toString() === item.produtoId)
        return {
          produto: produto,
          quantidade: Number.parseInt(item.quantidade),
        }
      })

      const payload = {
        cliente,
        funcionario,
        itensAlugados,
        formaPagamento: formData.formaPagamento,
        dataInicio: formData.dataInicio,
        dataTermino: formData.dataTermino,
      }

      const response = await fetch("http://localhost:8080/alugueis/com-produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success("Aluguel registrado com sucesso!")
        setIsDialogOpen(false)
        setFormData({
          clienteId: "",
          funcionarioId: "",
          dataInicio: "",
          dataTermino: "",
          formaPagamento: "DINHEIRO",
          itens: [],
        })
        fetchAlugueis()
      } else {
        toast.error("Erro ao registrar aluguel")
      }
    } catch (error) {
      toast.error("Erro ao registrar aluguel")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este aluguel?")) {
      try {
        const response = await fetch(`http://localhost:8080/alugueis/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Aluguel excluído!")
          fetchAlugueis()
        } else {
          toast.error("Erro ao excluir aluguel")
        }
      } catch (error) {
        toast.error("Erro ao excluir aluguel")
      }
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      itens: [...formData.itens, { produtoId: "", quantidade: "1" }],
    })
  }

  const removeItem = (index: number) => {
    const newItens = formData.itens.filter((_, i) => i !== index)
    setFormData({ ...formData, itens: newItens })
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItens = [...formData.itens]
    newItens[index] = { ...newItens[index], [field]: value }
    setFormData({ ...formData, itens: newItens })
  }

  const filteredAlugueis = alugueis.filter(
    (aluguel) =>
      aluguel.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluguel.funcionario?.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Aluguéis</CardTitle>
          <CardDescription>Registre e gerencie os aluguéis do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente ou funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setFormData({
                      clienteId: "",
                      funcionarioId: "",
                      dataInicio: "",
                      dataTermino: "",
                      formaPagamento: "DINHEIRO",
                      itens: [],
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Aluguel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Novo Aluguel</DialogTitle>
                  <DialogDescription>Preencha os dados do aluguel</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cliente">Cliente</Label>
                      <Select
                        value={formData.clienteId}
                        onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id.toString()}>
                              {cliente.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="funcionario">Funcionário</Label>
                      <Select
                        value={formData.funcionarioId}
                        onValueChange={(value) => setFormData({ ...formData, funcionarioId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o funcionário" />
                        </SelectTrigger>
                        <SelectContent>
                          {funcionarios.map((funcionario) => (
                            <SelectItem key={funcionario.id} value={funcionario.id.toString()}>
                              {funcionario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dataInicio">Data de Início</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                        value={formData.dataInicio}
                        onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataTermino">Data de Término</Label>
                      <Input
                        id="dataTermino"
                        type="date"
                        value={formData.dataTermino}
                        onChange={(e) => setFormData({ ...formData, dataTermino: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                    <Select
                      value={formData.formaPagamento}
                      onValueChange={(value) => setFormData({ ...formData, formaPagamento: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                        <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                        <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Produtos</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Item
                      </Button>
                    </div>

                    {formData.itens.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Select
                            value={item.produtoId}
                            onValueChange={(value) => updateItem(index, "produtoId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {produtos.map((produto) => (
                                <SelectItem key={produto.id} value={produto.id.toString()}>
                                  {produto.nome} - R$ {produto.preco.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Qtd"
                            value={item.quantidade}
                            onChange={(e) => updateItem(index, "quantidade", e.target.value)}
                            min="1"
                          />
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Registrar Aluguel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Término</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlugueis.map((aluguel) => (
                <TableRow key={aluguel.id}>
                  <TableCell className="font-medium">{aluguel.cliente?.nome || "N/A"}</TableCell>
                  <TableCell>{aluguel.funcionario?.nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(aluguel.dataInicio).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(aluguel.dataTermino).toLocaleDateString("pt-BR")}
                    </div>
                  </TableCell>
                  <TableCell>R$ {aluguel.valorTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{aluguel.formaPagamento}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(aluguel.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
