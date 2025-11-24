"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-400 text-sm mt-1">Personalize sua experiência na plataforma</p>
      </div>

      {/* Dados Pessoais */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-6">
          <CardTitle className="text-white">Dados Pessoais</CardTitle>
          <CardDescription>Edite suas informações de perfil</CardDescription>
        </CardHeader>
        <Separator className="bg-zinc-800" />
        <CardContent className="px-6 pt-6">
          <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 bg-transparent">
            Editar Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-6">
          <CardTitle className="text-white">Segurança</CardTitle>
          <CardDescription>Gerencie senha e autenticação</CardDescription>
        </CardHeader>
        <Separator className="bg-zinc-800" />
        <CardContent className="px-6 pt-6 space-y-4">
          <Button
            variant="outline"
            className="border-zinc-700 text-white hover:bg-zinc-800 w-full justify-start bg-transparent"
          >
            Alterar Senha
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700 text-white hover:bg-zinc-800 w-full justify-start bg-transparent"
          >
            Autenticação de Dois Fatores
          </Button>
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-6">
          <CardTitle className="text-white">Preferências</CardTitle>
          <CardDescription>Configure suas notificações e preferências</CardDescription>
        </CardHeader>
        <Separator className="bg-zinc-800" />
        <CardContent className="px-6 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Notificações por Email</p>
              <p className="text-sm text-zinc-400">Receba atualizações sobre ingressos</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <Separator className="bg-zinc-800" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Newsletter</p>
              <p className="text-sm text-zinc-400">Fique informado sobre promoções</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
