import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

interface PerguntaFrequente {
  pergunta: string
  resposta: string
}

interface AcordeaoPerguntasProps {
  perguntas: PerguntaFrequente[]
}

export function Perguntas({ perguntas }: AcordeaoPerguntasProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <HelpCircle className="h-6 w-6 text-zinc-700" />
        <h2 className="text-3xl font-bold text-zinc-900">Perguntas Frequentes</h2>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {perguntas.map((item, indice) => (
          <AccordionItem
            key={indice}
            value={`pergunta-${indice}`}
            className="border rounded-lg px-6"
          >
            <AccordionTrigger className="hover:no-underline text-left">
              {item.pergunta}
            </AccordionTrigger>
            <AccordionContent className="text-zinc-700 leading-relaxed">
              {item.resposta}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
