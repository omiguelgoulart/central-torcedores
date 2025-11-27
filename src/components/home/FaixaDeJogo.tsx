import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Ticket } from "lucide-react";
import Link from "next/link";

interface Jogo {
  id: string;
  nome: string;
  data: string;
  local: string;
  descricao: string;
  hasLotes: boolean;
}

interface FaixaDeJogosProps {
  jogos: Jogo[];
}

export function FaixaDeJogos({ jogos }: FaixaDeJogosProps) {
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Próximos jogos</h2>
        </div>

        <Button variant="link" asChild>
          <Link href="/partidas">Ver todos</Link>
        </Button>
      </div>

      {/* Carrossel horizontal no mobile, grid no desktop */}
      <div className=" flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-2 md:grid-cols-3 sm:overflow-visible scrollbar-none">
        {jogos.map((jogo) => (
          <Card
            key={jogo.id}
            className="
              min-w-[80%] sm:min-w-0
              transition-all duration-200
              hover:shadow-md hover:-translate-y-1
              snap-start
            "
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold">
                  {jogo.nome}
                </CardTitle>
                {jogo.hasLotes && <Badge>Disponível</Badge>}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatarData(jogo.data)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{jogo.local}</span>
                </div>

                <p>{jogo.descricao}</p>
              </div>

              <div>
                {jogo.hasLotes && (
                  <Link href={`/partidas?jogoId=${jogo.id}`}>
                  <Button size="sm" className="flex-1 w-full">
                    <Ticket className="h-4 w-4 mr-1" />
                    Comprar
                  </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
