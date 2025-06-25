"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Search, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
}

export default function ProdutoManager() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    estoque: "",
  })

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:8080/produtos")
      if (response.ok) {
        const data = await response.json()
        setProdutos(data)
      }
    } catch (error) {
      toast.error("Erro ao carregar produtos")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingProduto
        ? `http://localhost:8080/produtos/${editingProduto.id}`
        : "http://localhost:8080/produtos"

      const method = editingProduto ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: formData.nome,
          preco: Number.parseFloat(formData.preco),
          estoque: Number.parseInt(formData.estoque),
        }),
      })

      if (response.ok) {
        toast.success(editingProduto ? "Produto atualizado!" : "Produto cadastrado!")
        setIsDialogOpen(false)
        setEditingProduto(null)
        setFormData({ nome: "", preco: "", estoque: "" })
        fetchProdutos()
      } else {
        toast.error("Erro ao salvar produto")
      }
    } catch (error) {
      toast.error("Erro ao salvar produto")
    }
  }

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto)
    setFormData({
      nome: produto.nome,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString(),
    })
    setIsDialogOpen(true)
  }

  const getEstoqueStatus = (estoque: number) => {
    if (estoque <= 5) return { label: "Baixo", variant: "destructive" as const }
    if (estoque <= 20) return { label: "Normal", variant: "default" as const }
    return { label: "Alto", variant: "secondary" as const }
  }

  const filteredProdutos = produtos.filter((produto) => produto.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Produtos</CardTitle>
          <CardDescription>Cadastre e gerencie os produtos do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingProduto(null)
                    setFormData({ nome: "", preco: "", estoque: "" })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingProduto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
                  <DialogDescription>Preencha os dados do produto</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco">Preço</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estoque">Quantidade em Estoque</Label>
                    <Input
                      id="estoque"
                      type="number"
                      value={formData.estoque}
                      onChange={(e) => setFormData({ ...formData, estoque: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">{editingProduto ? "Atualizar" : "Cadastrar"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => {
                const status = getEstoqueStatus(produto.estoque)
                return (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {produto.estoque <= 5 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {produto.estoque}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(produto)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
