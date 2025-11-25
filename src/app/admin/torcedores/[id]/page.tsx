"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("personal")

  const member = {
    id: params.id,
    nome: "João Silva",
    email: "joao@example.com",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-9999",
    status: "ATIVO",
    plano: "Ouro",
    dataCadastro: "2024-01-15",
    dataNascimento: "1990-05-20",
    endereco: "Rua das Flores, 123 - São Paulo - SP",
  }

  const subscriptions = [{ id: 1, plano: "Ouro", status: "ATIVA", inicio: "2024-01-15", proxima: "2025-01-15" }]

  const payments = [
    { id: 1, valor: "R$ 199,00", status: "Pago", data: "2024-12-15", metodo: "Pix" },
    { id: 2, valor: "R$ 199,00", status: "Pago", data: "2024-11-15", metodo: "Cartão" },
    { id: 3, valor: "R$ 199,00", status: "Pago", data: "2024-10-15", metodo: "Boleto" },
  ]

  const tickets = [
    { id: 1, jogo: "vs Time A", data: "2025-12-10", setor: "Arquibancada Sul", status: "VALIDO" },
    { id: 2, jogo: "vs Time B", data: "2025-12-17", setor: "Cadeira Premium", status: "VALIDO" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{member.nome}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant={member.status === "ATIVO" ? "default" : "destructive"}>{member.status}</Badge>
            <span className="text-sm text-muted-foreground">{member.plano}</span>
          </div>
        </div>
        <Button variant="outline">Editar</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{member.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{member.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{member.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{new Date(member.dataNascimento).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">{new Date(member.dataCadastro).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">{member.endereco}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Assinaturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{sub.plano}</h3>
                      <Badge>{sub.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Início: {new Date(sub.inicio).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Próxima cobrança: {new Date(sub.proxima).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="py-3 font-semibold">{payment.valor}</td>
                        <td className="py-3">{new Date(payment.data).toLocaleDateString("pt-BR")}</td>
                        <td className="py-3 text-muted-foreground">{payment.metodo}</td>
                        <td className="py-3">
                          <Badge>{payment.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Ingressos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{ticket.jogo}</h3>
                      <Badge>{ticket.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Data: {new Date(ticket.data).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-muted-foreground">Setor: {ticket.setor}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Faturas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhuma fatura disponível</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
