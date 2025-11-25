"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003"

type StatusTorcedor = "ATIVO" | "INADIMPLENTE" | "CANCELADO" | "INATIVO"

type TorcedorPerfilResponse = {
  id: string
  matricula: string
  nome: string
  email: string
  telefone: string | null
  cpf: string | null
  dataNascimento: string | null
  genero: string | null
  fotoUrl: string | null
  enderecoLogradouro: string | null
  enderecoNumero: string | null
  enderecoBairro: string | null
  enderecoCidade: string | null
  enderecoUF: string | null
  enderecoCEP: string | null
  statusSocio: StatusTorcedor | null
  inadimplenteDesde: string | null
  criadoEm: string | null
  atualizadoEm: string | null

  // relacionamentos
  assinaturas: unknown[]
  pagamentos: unknown[]
  ingressos: unknown[]
  pedidos: unknown[]
}

// Tipos para a UI
type TorcedorUI = {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  status: StatusTorcedor
  plano: string
  dataCadastro: string | null
  dataNascimento: string | null
  endereco: string
}

type AssinaturaApi = {
  id: string
  status?: string | null
  inicioEm?: string | null
  proximaCobrancaEm?: string | null
  planoNome?: string | null
  plano?: {
    nome?: string | null
  } | null
}

type AssinaturaUI = {
  id: string
  plano: string
  status: string
  inicio: string | null
  proxima: string | null
}

type PagamentoApi = {
  id: string
  valor?: number | null
  valorBruto?: number | null
  status?: string | null
  metodo?: string | null
  billingType?: string | null
  pagoEm?: string | null
  criadoEm?: string | null
}

type PagamentoUI = {
  id: string
  valor: string
  status: string
  data: string | null
  metodo: string
}

type IngressoApi = {
  id: string
  status?: string | null
  dataJogo?: string | null
  jogoNome?: string | null
  setorNome?: string | null
  jogo?: {
    nome?: string | null
    dataJogo?: string | null
  } | null
}

type IngressoUI = {
  id: string
  jogo: string
  data: string | null
  setor: string
  status: string
}

function formatarDataBr(valor: string | null): string {
  if (!valor) return "Não informado"
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return "Não informado"
  return data.toLocaleDateString("pt-BR")
}

function formatarValorBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function badgeStatusVariant(status: StatusTorcedor) {
  if (status === "ATIVO") return "default" as const
  if (status === "INADIMPLENTE") return "destructive" as const
  return "outline" as const
}

export default function TorcedorDetalhePage({ params }: { params: { id: string } }) {
  const [abaAtiva, setAbaAtiva] = useState("personal")
  const [torcedor, setTorcedor] = useState<TorcedorUI | null>(null)
  const [assinaturas, setAssinaturas] = useState<AssinaturaUI[]>([])
  const [pagamentos, setPagamentos] = useState<PagamentoUI[]>([])
  const [ingressos, setIngressos] = useState<IngressoUI[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregarTorcedor() {
      try {
        setCarregando(true)
        setErro(null)

        // 👇 URL real do backend que você mostrou no print
        const resposta = await fetch(`${API}/usuario/id/${params.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        })

        if (!resposta.ok) {
          setErro("Não foi possível carregar os dados do torcedor.")
          setCarregando(false)
          return
        }

        const dados = (await resposta.json()) as TorcedorPerfilResponse

        // endereço
        const partesEndereco = [
          dados.enderecoLogradouro,
          dados.enderecoNumero ? `nº ${dados.enderecoNumero}` : null,
          dados.enderecoBairro,
          dados.enderecoCidade,
          dados.enderecoUF,
          dados.enderecoCEP ? `CEP ${dados.enderecoCEP}` : null,
        ].filter(Boolean)

        const endereco =
          partesEndereco.length > 0 ? partesEndereco.join(" - ") : "Endereço não informado"

        // status / plano
        const status: StatusTorcedor = dados.statusSocio ?? "ATIVO"

        // se quiser exibir o plano atual, pega da primeira assinatura
        const assinaturasApi = (dados.assinaturas ?? []) as AssinaturaApi[]
        const planoAtual =
          assinaturasApi[0]?.plano?.nome ??
          assinaturasApi[0]?.planoNome ??
          "Sem plano vinculado"

        const torcedorUI: TorcedorUI = {
          id: dados.id,
          nome: dados.nome,
          email: dados.email,
          cpf: dados.cpf ?? "Não informado",
          telefone: dados.telefone ?? "Não informado",
          status,
          plano: planoAtual,
          dataCadastro: dados.criadoEm,
          dataNascimento: dados.dataNascimento,
          endereco,
        }

        setTorcedor(torcedorUI)

        // ---- Assinaturas ----
        const assinaturasUI: AssinaturaUI[] = assinaturasApi.map((a) => ({
          id: a.id,
          plano: a.plano?.nome ?? a.planoNome ?? "Plano sem nome",
          status: a.status ?? "SEM STATUS",
          inicio: a.inicioEm ?? null,
          proxima: a.proximaCobrancaEm ?? null,
        }))
        setAssinaturas(assinaturasUI)

        // ---- Pagamentos ----
        const pagamentosApi = (dados.pagamentos ?? []) as PagamentoApi[]
        const pagamentosUI: PagamentoUI[] = pagamentosApi.map((p) => {
          const valorNumero = p.valor ?? p.valorBruto ?? 0
          const data = p.pagoEm ?? p.criadoEm ?? null
          const metodo = p.metodo ?? p.billingType ?? "Não informado"

          return {
            id: p.id,
            valor: formatarValorBRL(valorNumero),
            status: p.status ?? "SEM STATUS",
            data,
            metodo,
          }
        })
        setPagamentos(pagamentosUI)

        // ---- Ingressos ----
        const ingressosApi = (dados.ingressos ?? []) as IngressoApi[]
        const ingressosUI: IngressoUI[] = ingressosApi.map((ing) => ({
          id: ing.id,
          jogo: ing.jogo?.nome ?? ing.jogoNome ?? "Jogo não informado",
          data: ing.jogo?.dataJogo ?? ing.dataJogo ?? null,
          setor: ing.setorNome ?? "Setor não informado",
          status: ing.status ?? "SEM STATUS",
        }))
        setIngressos(ingressosUI)
      } catch (error) {
        console.error(error)
        setErro("Erro ao carregar dados do torcedor.")
      } finally {
        setCarregando(false)
      }
    }

    carregarTorcedor()
  }, [params.id])

  if (carregando) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted rounded-md animate-pulse" />
        <div className="h-5 w-40 bg-muted rounded-md animate-pulse" />
        <Card>
          <CardHeader>
            <CardTitle>Carregando dados do torcedor...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-muted rounded-md animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!torcedor) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Torcedor</h1>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
        <p className="text-sm text-muted-foreground">
          Nenhuma informação encontrada para este torcedor.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">{torcedor.nome}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Badge variant={badgeStatusVariant(torcedor.status)}>
              {torcedor.status}
            </Badge>
            <span className="text-sm text-muted-foreground">{torcedor.plano}</span>
          </div>
        </div>
        <Button variant="outline">Editar</Button>
      </div>

      <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-5">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
        </TabsList>

        {/* DADOS PESSOAIS */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{torcedor.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matrícula</p>
                  <p className="font-medium">{/* se quiser exibir a matrícula, pega de dados depois */}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{torcedor.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{torcedor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{torcedor.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">
                    {formatarDataBr(torcedor.dataNascimento)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">
                    {formatarDataBr(torcedor.dataCadastro)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">{torcedor.endereco}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSINATURAS */}
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Assinaturas</CardTitle>
            </CardHeader>
            <CardContent>
              {assinaturas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma assinatura encontrada para este torcedor.
                </p>
              ) : (
                <div className="space-y-3">
                  {assinaturas.map((sub) => (
                    <div key={sub.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{sub.plano}</h3>
                        <Badge>{sub.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Início: {formatarDataBr(sub.inicio)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Próxima cobrança: {formatarDataBr(sub.proxima)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAGAMENTOS */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {pagamentos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum pagamento registrado para este torcedor.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-muted-foreground text-xs">
                        <th className="text-left py-3 font-medium">Valor</th>
                        <th className="text-left py-3 font-medium">Data</th>
                        <th className="text-left py-3 font-medium">Método</th>
                        <th className="text-left py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pagamentos.map((payment) => (
                        <tr key={payment.id}>
                          <td className="py-3 font-semibold">{payment.valor}</td>
                          <td className="py-3">
                            {formatarDataBr(payment.data)}
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {payment.metodo}
                          </td>
                          <td className="py-3">
                            <Badge>{payment.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INGRESSOS */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Ingressos</CardTitle>
            </CardHeader>
            <CardContent>
              {ingressos.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum ingresso encontrado para este torcedor.
                </p>
              ) : (
                <div className="space-y-3">
                  {ingressos.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{ticket.jogo}</h3>
                        <Badge>{ticket.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Data: {formatarDataBr(ticket.data)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Setor: {ticket.setor}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FATURAS (ainda sem dados reais) */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nenhuma fatura disponível para este torcedor no momento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
