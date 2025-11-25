"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2 } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type TipoSetor = "ARQUIBANCADA" | "CADEIRA" | "CAMAROTE"

type Setor = {
  id: number
  nome: string
  capacidade: number
  tipo: TipoSetor
}

const setoresIniciais: Setor[] = [
  { id: 1, nome: "Arquibancada Sul", capacidade: 5000, tipo: "ARQUIBANCADA" },
  { id: 2, nome: "Arquibancada Norte", capacidade: 5500, tipo: "ARQUIBANCADA" },
  { id: 3, nome: "Cadeira Premium Leste", capacidade: 1000, tipo: "CADEIRA" },
  { id: 4, nome: "Camarote VIP", capacidade: 200, tipo: "CAMAROTE" },
]

export default function PaginaSetoresEstadio() {
  const [setores, setSetores] = useState<Setor[]>(setoresIniciais)
  const [carregando, setCarregando] = useState(false)

  const [termoBusca, setTermoBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<"TODOS" | TipoSetor>("TODOS")

  // estado do dialog
  const [dialogAberto, setDialogAberto] = useState(false)
  const [setorEditando, setSetorEditando] = useState<Setor | null>(null)
  const [formNome, setFormNome] = useState("")
  const [formCapacidade, setFormCapacidade] = useState("")
  const [formTipo, setFormTipo] = useState<TipoSetor>("ARQUIBANCADA")

  // Carrega setores da API admin/setor (mantendo mock como default)
  useEffect(() => {
    async function carregarSetores() {
      try {
        setCarregando(true)
        const resposta = await fetch(`${API}/admin/setor`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!resposta.ok) {
          // se der erro, mantém o mock
          console.error("Falha ao buscar setores da API /admin/setor")
          return
        }

        const dados: Setor[] = await resposta.json()
        if (Array.isArray(dados) && dados.length > 0) {
          setSetores(dados)
        }
      } catch (erro) {
        console.error("Erro ao carregar setores:", erro)
      } finally {
        setCarregando(false)
      }
    }

    carregarSetores()
  }, [])

  const capacidadeTotal = useMemo(
    () => setores.reduce((acc, s) => acc + s.capacidade, 0),
    [setores],
  )

  const capacidadeMedia = useMemo(() => {
    if (!setores.length) return 0
    return Math.round(capacidadeTotal / setores.length)
  }, [setores.length, capacidadeTotal])

  const setoresFiltrados = useMemo(() => {
    return setores.filter((setor) => {
      const bateNome =
        !termoBusca ||
        setor.nome.toLowerCase().includes(termoBusca.toLowerCase())
      const bateTipo =
        filtroTipo === "TODOS" ? true : setor.tipo === filtroTipo

      return bateNome && bateTipo
    })
  }, [setores, termoBusca, filtroTipo])

  function limparFormulario() {
    setFormNome("")
    setFormCapacidade("")
    setFormTipo("ARQUIBANCADA")
    setSetorEditando(null)
  }

  function abrirCriacao() {
    limparFormulario()
    setDialogAberto(true)
  }

  function abrirEdicao(setor: Setor) {
    setSetorEditando(setor)
    setFormNome(setor.nome)
    setFormCapacidade(String(setor.capacidade))
    setFormTipo(setor.tipo)
    setDialogAberto(true)
  }

  function excluirSetor(id: number) {
    setSetores((prev) => prev.filter((s) => s.id !== id))
  }

  function salvarSetor() {
    const capacidadeNumero = Number(formCapacidade)

    if (!formNome.trim()) return
    if (!Number.isFinite(capacidadeNumero) || capacidadeNumero <= 0) return

    if (setorEditando) {
      // editar
      setSetores((prev) =>
        prev.map((s) =>
          s.id === setorEditando.id
            ? {
                ...s,
                nome: formNome.trim(),
                capacidade: capacidadeNumero,
                tipo: formTipo,
              }
            : s,
        ),
      )
    } else {
      // criar
      const proximoId =
        setores.length > 0 ? Math.max(...setores.map((s) => s.id)) + 1 : 1

      const novoSetor: Setor = {
        id: proximoId,
        nome: formNome.trim(),
        capacidade: capacidadeNumero,
        tipo: formTipo,
      }

      setSetores((prev) => [...prev, novoSetor])
    }

    setDialogAberto(false)
    limparFormulario()
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-balance">Setores do Estádio</h1>
          <p className="text-muted-foreground">
            Gerencie capacidade, tipos e distribuição dos setores do estádio.
          </p>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={abrirCriacao}>
              <Plus className="w-4 h-4" />
              Novo Setor
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {setorEditando ? "Editar setor" : "Cadastrar novo setor"}
              </DialogTitle>
              <DialogDescription>
                Defina nome, tipo e capacidade aproximada do setor.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="nome">Nome do setor</Label>
                <Input
                  id="nome"
                  placeholder="Ex.: Arquibancada Sul"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="capacidade">Capacidade</Label>
                  <Input
                    id="capacidade"
                    type="number"
                    min={0}
                    value={formCapacidade}
                    onChange={(e) => setFormCapacidade(e.target.value)}
                    placeholder="Ex.: 5000"
                  />
                </div>

                <div className="space-y-1">
                  <Label>Tipo de setor</Label>
                  <Select
                    value={formTipo}
                    onValueChange={(valor) =>
                      setFormTipo(valor as TipoSetor)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARQUIBANCADA">Arquibancada</SelectItem>
                      <SelectItem value="CADEIRA">Cadeira</SelectItem>
                      <SelectItem value="CAMAROTE">Camarote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={salvarSetor}>
                {setorEditando ? "Salvar alterações" : "Criar setor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card de resumo */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total de setores
              </p>
              <p className="text-2xl font-bold">{setores.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Capacidade total
              </p>
              <p className="text-2xl font-bold">
                {capacidadeTotal.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Média por setor
              </p>
              <p className="text-2xl font-bold">
                {capacidadeMedia.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          {carregando && (
            <p className="mt-4 text-xs text-muted-foreground">
              Carregando setores da API...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="busca" className="text-xs mb-1 block">
                Buscar
              </Label>
              <Input
                id="busca"
                placeholder="Nome do setor..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>

            <div className="w-full md:w-52">
              <Label className="text-xs mb-1 block">Tipo</Label>
              <Select
                value={filtroTipo}
                onValueChange={(valor) =>
                  setFiltroTipo(valor as "TODOS" | TipoSetor)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="ARQUIBANCADA">Arquibancada</SelectItem>
                  <SelectItem value="CADEIRA">Cadeira</SelectItem>
                  <SelectItem value="CAMAROTE">Camarote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de setores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Lista de setores ({setoresFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-muted-foreground text-xs">
                  <th className="text-left py-3 font-medium">Nome</th>
                  <th className="text-left py-3 font-medium">Tipo</th>
                  <th className="text-left py-3 font-medium">Capacidade</th>
                  <th className="text-left py-3 font-medium">% do total</th>
                  <th className="text-left py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {setoresFiltrados.map((setor) => (
                  <tr key={setor.id} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">{setor.nome}</td>
                    <td className="py-3 text-muted-foreground text-xs">
                      {setor.tipo}
                    </td>
                    <td className="py-3 font-semibold">
                      {setor.capacidade.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3">
                      <span className="text-primary font-semibold">
                        {capacidadeTotal
                          ? ((setor.capacidade / capacidadeTotal) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirEdicao(setor)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => excluirSetor(setor.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {setoresFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground text-sm"
                    >
                      Nenhum setor encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
