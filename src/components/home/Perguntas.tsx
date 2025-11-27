import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
