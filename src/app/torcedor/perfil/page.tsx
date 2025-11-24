"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PerfilPage() {
  const { usuario } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
        <p className="text-zinc-400 text-sm mt-1">Visualize e gerencie seus dados pessoais</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="px-6">
          <CardTitle className="text-white">Dados Pessoais</CardTitle>
          <CardDescription>Informações do seu perfil na plataforma</CardDescription>
        </CardHeader>
        <Separator className="bg-zinc-800" />
        <CardContent className="px-6 pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">Nome Completo</p>
              <p className="text-white font-medium">{usuario?.nome}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">E-mail</p>
              <p className="text-white font-medium">{usuario?.email}</p>
            </div>
            {usuario?.cpf && (
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">CPF</p>
                <p className="text-white font-medium">{usuario.cpf}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide mb-2">ID do Torcedor</p>
              <p className="text-white font-medium">{usuario?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
