"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type FaqItem = {
  pergunta: string;
  resposta: string;
};

interface AjudaFaqProps {
  faqs: FaqItem[];
}

export function AjudaFaq({ faqs }: AjudaFaqProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="gap-2">Perguntas frequentes</CardTitle>
        <CardDescription>
          Confira as dúvidas mais comuns antes de falar com o suporte.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.pergunta}
              value={`item-${index}`}
              className="border-b border-zinc-800 last:border-0"
            >
              <AccordionTrigger className="text-left  hover:text-zinc-200">
                {faq.pergunta}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-zinc-400">
                {faq.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
