import { FeedComunicados } from "@/components/home/FeedComunicado";
import { BeneficiosDestaque } from "@/components/home/BeneficiosDestaque";
import { ClubeFooter } from "@/components/home/ClubeFooter";
import { CounterBar } from "@/components/home/CounterBar";
import { Perguntas } from "@/components/home/Perguntas";
import { FaixaDeJogos } from "@/components/home/FaixaDeJogo";
import { Anuncio } from "@/components/home/Anuncio";
import { ListaNoticias } from "@/components/home/ListaNoticias";
import { PlanosCampanha } from "@/components/home/PlanosCampanha";
import { CarrosselPatrocinadores } from "@/components/home/CarrosselPatrocinadores";
import { Depoimentos } from "@/components/home/Depoimentos";
import { IngressoDisponivel } from "@/components/home/IngressoDisponivel";

// Mock data
const mockData = {
  hero: {
    titulo: "Ingresso liberado: Clássico na Baixada",
    subtitulo: "Garanta já o seu",
    midia: { tipo: "image", url: "/football-stadium-crowd.jpg" },
    acoes: [
      { rotulo: "Comprar ingresso", acao: "buy" },
      { rotulo: "Ver detalhes", acao: "details" },
    ],
  },
  comunicados: [
    {
      id: "a1",
      titulo: "Nota Oficial — Abertura dos Portões",
      resumo: "Portões abrem às 17h. Evite filas.",
      capaUrl: "/stadium-gates.png",
      tags: ["Nota Oficial"],
      fixado: true,
      publicadoEm: "2025-10-08T10:00:00Z",
    },
    {
      id: "a2",
      titulo: "Campanha Sócio Ouro",
      resumo: "Assine o plano Ouro e ganhe prioridade nos ingressos.",
      capaUrl: "/gold-membership-card.jpg",
      tags: ["Campanha"],
      fixado: false,
      publicadoEm: "2025-10-07T14:32:00Z",
    },
  ],
  jogos: [
    {
      id: "j1",
      nome: "Brasil x Grêmio",
      data: "2025-10-15T19:30:00Z",
      local: "Estádio Bento Freitas",
      descricao: "Rodada 10 - Campeonato Gaúcho",
      hasLotes: true,
    },
    {
      id: "j2",
      nome: "Brasil x Internacional",
      data: "2025-10-28T16:00:00Z",
      local: "Estádio Bento Freitas",
      descricao: "Rodada 11 - Campeonato Gaúcho",
      hasLotes: true,
    },
    {
      id: "j3",
      nome: "Brasil x Juventude",
      data: "2025-11-05T20:00:00Z",
      local: "Estádio Bento Freitas",
      descricao: "Rodada 12 - Campeonato Gaúcho",
      hasLotes: false,
    },
  ],
  planos: [
    {
      id: "p1",
      nome: "Arquibancada",
      descricao: "Entrada em jogos selecionados",
      valor: 49.9,
      periodicidade: "MENSAL",
      destaque: false,
      beneficios: [
        "Descontos parceiros",
        "Fila preferencial",
        "Prioridade compra",
      ],
    },
    {
      id: "p2",
      nome: "Ouro",
      descricao: "Vantagens máximas",
      valor: 99.9,
      periodicidade: "MENSAL",
      destaque: true,
      rotuloBadge: "Recomendado",
      beneficios: [
        "Prioridade máxima",
        "Cadeira coberta",
        "Meet & greet (limitado)",
      ],
    },
    {
      id: "p3",
      nome: "Torcedor",
      descricao: "Benefícios básicos",
      valor: 29.9,
      periodicidade: "MENSAL",
      destaque: false,
      beneficios: ["Desconto em produtos", "Newsletter exclusiva"],
    },
  ],
  beneficiosSpotlight: [
    { titulo: "Prioridade de compra", icone: "Timer" },
    { titulo: "Desconto em lojas", icone: "Percent" },
    { titulo: "Área exclusiva", icone: "Shield" },
    { titulo: "Ingresso digital", icone: "QrCode" },
    { titulo: "Eventos VIP", icone: "Trophy" },
    { titulo: "Cashback", icone: "DollarSign" },
  ],
  sponsors: [
    "/generic-sponsor-logo-1.png",
    "/generic-sponsor-logo-2.png",
    "/generic-sponsor-logo-3.png",
    "/sponsor-logo-4.jpg",
  ],
  depoimentos: [
    {
      nome: "Carlos Silva",
      texto: "Virei sócio e comprar ingresso ficou fácil. Recomendo!",
    },
    {
      nome: "Ana Paula",
      texto: "Atendimento rápido e benefícios reais. Vale muito a pena.",
    },
    {
      nome: "Roberto Lima",
      texto: "Os descontos em produtos oficiais compensam a mensalidade.",
    },
  ],
  counters: {
    sociosAtivos: 12450,
    jogosTemporada: 38,
    ingressosVendidos: 185000,
  },
  faqs: [
    {
      pergunta: "Como compro meia-entrada?",
      resposta: "Selecione a opção e apresente documento na entrada.",
    },
    {
      pergunta: "Posso transferir ingresso?",
      resposta: "Em breve. No momento, ingresso é pessoal.",
    },
    {
      pergunta: "Como troco de plano?",
      resposta: "Acesse sua conta e vá em Assinatura > Trocar Plano.",
    },
    {
      pergunta: "Quais formas de pagamento?",
      resposta: "Aceitamos cartão, boleto e PIX.",
    },
    {
      pergunta: "Como falo com o suporte?",
      resposta: "Use o chat no canto inferior direito ou envie email.",
    },
  ],
  noticias: [
    {
      id: "n1",
      titulo: "Pelotas anuncia reforços para a temporada",
      data: "2025-10-05",
      thumb: "/football-players.jpg",
    },
    {
      id: "n2",
      titulo: "Inauguração da nova loja oficial",
      data: "2025-10-03",
      thumb: "/sports-store-interior.png",
    },
    {
      id: "n3",
      titulo: "Campanha de doação de alimentos",
      data: "2025-10-01",
      thumb: "/charity-donation.png",
    },
    {
      id: "n4",
      titulo: "Escolinha de futebol abre inscrições",
      data: "2025-09-28",
      thumb: "/kids-football-training.png",
    },
  ],
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <Anuncio {...mockData.hero} />

        <div className="container mx-auto px-4 space-y-16 py-12">
          <FeedComunicados items={mockData.comunicados} />
          <FaixaDeJogos jogos={mockData.jogos} />
          <IngressoDisponivel jogo={mockData.jogos[0]} />
          <BeneficiosDestaque beneficios={mockData.beneficiosSpotlight} />
          <PlanosCampanha planos={mockData.planos} />
          <ListaNoticias posts={mockData.noticias} />
          <CarrosselPatrocinadores logos={mockData.sponsors} />
          <Depoimentos depoimentos={mockData.depoimentos} />
          <CounterBar {...mockData.counters} />
          <Perguntas perguntas={mockData.faqs} />
        </div>
      </main>

      <ClubeFooter />
    </div>
  );
}
