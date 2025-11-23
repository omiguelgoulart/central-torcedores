"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  HourglassIcon,
} from "lucide-react";
import type { PaymentStatus } from "@/app/types/pagamentoItf";

interface ResultadoPagamentoDialogProps {
  open: boolean;
  status: PaymentStatus | null;
  onClose: () => void;
  onRetry: () => void;
}

export function ResultadoPagamentoDialog({
  open,
  status,
  onClose,
  onRetry,
}: ResultadoPagamentoDialogProps) {
  const obterConfiguracaoStatus = () => {
    switch (status) {
      case "PAID":
      case "APPROVED":
        return {
          icon: <CheckCircle2Icon className="size-12 text-green-600" />,
          title: "Pagamento Aprovado!",
          description: "Seu pagamento foi processado com sucesso.",
        };
      case "PENDING":
        return {
          icon: <HourglassIcon className="size-12 text-blue-600" />,
          title: "Pagamento em análise",
          description:
            "Recebemos seus dados. Estamos confirmando com a operadora/banco.",
        };
      case "DECLINED":
        return {
          icon: <XCircleIcon className="size-12 text-destructive" />,
          title: "Pagamento Recusado",
          description:
            "O pagamento foi recusado. Verifique os dados e tente novamente.",
        };
      case "EXPIRED":
        return {
          icon: <ClockIcon className="size-12 text-orange-600" />,
          title: "Pagamento Expirado",
          description:
            "O tempo para realizar o pagamento expirou. Tente novamente.",
        };
      case "ERROR":
        return {
          icon: <AlertTriangleIcon className="size-12 text-destructive" />,
          title: "Erro no Pagamento",
          description:
            "Ocorreu um erro ao processar o pagamento. Tente novamente.",
        };
      default:
        return {
          icon: <AlertTriangleIcon className="size-12 text-muted-foreground" />,
          title: "Status Desconhecido",
          description:
            "Não foi possível determinar o status do pagamento no momento.",
        };
    }
  };

  const config = obterConfiguracaoStatus();
  const sucesso = status === "PAID" || status === "APPROVED";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {config.icon}
            <DialogTitle className="text-center">{config.title}</DialogTitle>
            <DialogDescription className="text-center">
              {config.description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {!sucesso && (
            <Button onClick={onRetry} className="w-full">
              {status === "PENDING" ? "Atualizar status" : "Tentar novamente"}
            </Button>
          )}
          <Button
            variant={sucesso ? "default" : "outline"}
            onClick={onClose}
            className="w-full"
          >
            {sucesso ? "Concluir" : "Voltar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
