"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AjudaSuporteCard() {
  return (
    <Card>
      <CardHeader className="px-6">
        <CardTitle>Ainda precisa de ajuda?</CardTitle>
        <CardDescription>
          Se não encontrou sua resposta no FAQ, fale direto com o suporte.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-6 pt-6 text-sm text-zinc-300">
        <div className="space-y-1">
          <p>
            • Para problemas com pagamento ou associação, inclua{" "}
            <span className="font-semibold">seu CPF</span> e{" "}
            <span className="font-semibold">e-mail de cadastro</span>.
          </p>
          <p>
            • Para dúvidas sobre ingressos, informe o{" "}
            <span className="font-semibold">jogo</span> e a{" "}
            <span className="font-semibold">forma de pagamento</span>.
          </p>
          <p className="text-xs text-zinc-500">
            Atendimento em horário comercial, em dias úteis.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-zinc-400">
            <p className="font-semibold text-zinc-300">
              Canais de atendimento
            </p>
            <p>E-mail: suporte@clubedotorcedor.com</p>
            <p>Área logada: opção &quot;Abrir chamado&quot;</p>
          </div>

          <Button className="">
            Abrir chamado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
