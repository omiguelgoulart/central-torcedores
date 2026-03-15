import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

  const renderJogoCard = (jogo: Jogo) => (
    <Card
      key={jogo.id}
      className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{jogo.nome}</CardTitle>
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
              <Button size="sm" className="w-full flex-1">
                <Ticket className="mr-1 h-4 w-4" />
                Comprar
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );

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

      <Carousel className="sm:hidden">
        <CarouselContent className="-ml-4">
          {jogos.map((jogo) => (
            <CarouselItem key={jogo.id} className="basis-[82%] pl-4">
              {renderJogoCard(jogo)}
            </CarouselItem>
          ))}
        </CarouselContent>
        {jogos.length > 1 && (
          <>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </>
        )}
      </Carousel>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
        {jogos.map((jogo) => renderJogoCard(jogo))}
      </div>
    </section>
  );
}
