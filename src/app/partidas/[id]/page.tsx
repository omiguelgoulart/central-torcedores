import { ExibicaoMapaSetor } from "@/components/partidas/detalhe/ExibicaoMapaSetor";
// import { PartidaHeader } from "@/components/partidas/detalhe/PartidaHeader";

export default function PartidaDetalhePage({ params }: { params: { id: string } }) {
  const partida = {
    id: params.id,
    mandante: "Brasil de Pelotas",
    visitante: "Grêmio",
    data: "15 de Novembro, 20:00",
    local: "Estádio Bento Freitas",
  };

  // aqui você define apenas os valores dinâmicos (preço e disponibilidade)
  const valores = [
    { id: "jk", preco: 50, disponibilidade: 150 },
    { id: "social", preco: 80, disponibilidade: 90 },
    { id: "cativas", preco: 120, disponibilidade: 30 },
    { id: "norte", preco: 40, disponibilidade: 100 },
    { id: "sul", preco: 40, disponibilidade: 100 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* <PartidaHeader partida={partida} /> */}
      <ExibicaoMapaSetor partidaId={partida.id} valores={valores} />
    </div>
  );
}
