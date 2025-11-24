"use client";

import { AjudaFaq } from "@/components/torcedor/ajuda/AjudaFaq";
import { AjudaSuporteCard } from "@/components/torcedor/ajuda/AjudaSuporteCard";

type FaqItem = {
  pergunta: string;
  resposta: string;
};

const FAQS: FaqItem[] = [
  {
    pergunta: "Como compro ingressos?",
    resposta:
      'Acesse a seção "Meus Ingressos", escolha o jogo desejado e siga as etapas de compra. Após a confirmação do pagamento, o ingresso fica disponível na sua conta e também é enviado por e-mail.',
  },
  {
    pergunta: "Posso trocar meu plano de sócio?",
    resposta:
      'Sim. Vá em "Minha Associação", selecione o novo plano desejado e confirme a alteração. A troca passa a valer a partir do próximo ciclo de cobrança, conforme as regras do clube.',
  },
  {
    pergunta: "Não estou encontrando meu ingresso, o que faço?",
    resposta:
      "Verifique se o pagamento foi aprovado e se você está logado com o mesmo e-mail usado na compra. Se ainda assim não aparecer, entre em contato com o suporte informando o jogo e a forma de pagamento.",
  },
  {
    pergunta: "Qual é a política de reembolso?",
    resposta:
      "Ingressos não utilizados podem seguir a política de reembolso definida pelo clube e pelo regulamento do jogo. Para planos de sócio, o cancelamento é imediato, mas não há devolução de períodos já utilizados.",
  },
];

export default function AjudaPage() {
  return (
    <div className="space-y-8 p-4">
      <div className="flex gap-2 flex-col items-center">
        <h1 className="text-3xl font-bold text-white">Suporte</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Central do torcedor, tire dúvidas rápidas ou fale com o nosso time.
        </p>
      </div>

      <AjudaFaq faqs={FAQS} />

      <AjudaSuporteCard />
    </div>
  );
}
