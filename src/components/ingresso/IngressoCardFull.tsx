import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ingressoItf } from "@/app/types/ingressoItf";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

interface IngressoCardProps {
  ingresso: ingressoItf;
  isLink?: boolean;
}

const statusConfig = {
  VALIDO: {
    label: "Válido",
    className: "bg-red-600 text-white hover:bg-red-700",
  },
  USADO: {
    label: "Usado",
    className: "bg-gray-500 text-white hover:bg-gray-600",
  },
  CANCELADO: {
    label: "Cancelado",
    className: "bg-red-500 text-white hover:bg-red-600",
  },
  EXPIRADO: {
    label: "Expirado",
    className: "bg-amber-500 text-white hover:bg-amber-600",
  },
  ESTORNADO: {
    label: "Estornado",
    className: "bg-slate-500 text-white hover:bg-slate-600",
  },
};

export function IngressoCard({ ingresso, isLink = false }: IngressoCardProps) {
  const status = statusConfig[ingresso.status];
  const jogo = ingresso.jogo;
  const lote = ingresso.lote;
  const qrSrc =
    ingresso.qrCode?.startsWith("http") ||
    ingresso.qrCode?.startsWith("data:image")
      ? ingresso.qrCode
      : `${API}/ingresso/${ingresso.id}/qrcode.png`;

  const dataFormatada = jogo?.data
    ? new Date(jogo.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Data indisponível";

  const horaFormatada = jogo?.data
    ? new Date(jogo.data).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Hora indisponível";

  return (
    <Card
      className={`overflow-hidden border border-border bg-card ${isLink ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
    >
      <CardHeader className="bg-red-600 text-white pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {jogo?.nome ?? "Jogo indisponível"}
            </CardTitle>
            <CardDescription className="text-red-100">Jogo</CardDescription>
          </div>
          <Badge className={`${status.className} border-0`}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="space-y-3 pb-4 border-b border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Data:</span>
            <span className="font-medium text-foreground">{dataFormatada}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Horário:</span>
            <span className="font-medium text-foreground">{horaFormatada}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Local:</span>
            <span className="font-medium text-foreground">
              {jogo?.local || "Não informado"}
            </span>
          </div>
        </div>

        <div className="space-y-2 pb-4 border-b border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Lote:</span>
            <span className="font-medium text-foreground">
              {lote?.nome || "Não informado"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium text-foreground">
              {lote?.tipo || "Não informado"}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm pb-4 border-b border-border">
          <span className="text-muted-foreground">Valor:</span>
          <span className="font-bold text-red-600">R$ {ingresso.valor}</span>
        </div>

        <div className="flex justify-center">
          <div className="bg-muted p-3 rounded-md">
            <Image
              src={qrSrc || "/placeholder.svg"}
              alt="QR Code do ingresso"
              width={120}
              height={120}
              className="rounded"
              unoptimized
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
