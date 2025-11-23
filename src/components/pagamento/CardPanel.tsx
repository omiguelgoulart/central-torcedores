"use client";

import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CardPreview } from "./CardPreview";
import { detectCardBrand } from "@/lib/card-utils";
import {
  formatCardNumber,
  formatExpiry,
  formatCVV,
  formatCPFCNPJ,
  formatPostalCode,
  formatPhone,
} from "@/lib/formatters";

import type {
  CardPaymentData,
  CardType,
  CardBrand,
  PaymentStatus,
} from "@/app/types/pagamentoItf";
import type { PagamentoCriado } from "@/components/pagamento/AbasPagamento";
import { toast } from "sonner";

const cardSchema = z.object({
  cardType: z.enum(["credit", "debit"] as const),
  holderName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  number: z.string().min(19, "Número do cartão inválido"),
  expiryMonth: z.string().regex(/^\d{2}$/, "Mês inválido"),
  expiryYear: z.string().regex(/^\d{2}$/, "Ano inválido"),
  ccv: z
    .string()
    .min(3, "CVV deve ter 3 ou 4 dígitos")
    .max(4, "CVV deve ter 3 ou 4 dígitos"),
  name: z.string().min(3, "Nome completo obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  postalCode: z.string().min(9, "CEP inválido"),
  addressNumber: z.string().min(1, "Número obrigatório"),
  phone: z.string().min(14, "Telefone inválido"),
});

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  helpTextId?: string;
};

function Field({ id, label, error, children, helpTextId }: FieldProps) {
  const describedBy = useMemo(() => {
    const ids: string[] = [];
    if (error) ids.push(`${id}-error`);
    if (helpTextId) ids.push(helpTextId);
    return ids.length ? ids.join(" ") : undefined;
  }, [error, helpTextId, id]);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div aria-describedby={describedBy} className="space-y-1">
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

type MaskedInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  onMask: (value: string) => string;
  setValue: (path: keyof CardPaymentData, value: string) => void;
  name: keyof CardPaymentData;
};

function MaskedInput({
  onMask,
  setValue,
  name,
  ...rest
}: MaskedInputProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const masked = onMask(e.target.value);
      setValue(name, masked);
    },
    [name, onMask, setValue]
  );

  return <Input {...rest} onChange={handleChange} />;
}

function mapStatusToUiStatus(status: string): PaymentStatus {
  const s = status.toUpperCase();

  if (
    ["CONFIRMED", "RECEIVED", "RECEIVED_IN_CASH", "APPROVED", "PAID"].includes(
      s
    )
  ) {
    return "APPROVED";
  }

  if (["PENDING", "AWAITING", "IN_PROCESS"].includes(s)) {
    return "PENDING";
  }

  if (["OVERDUE", "EXPIRED"].includes(s)) {
    return "EXPIRED";
  }

  if (["CANCELLED", "REFUNDED", "DECLINED"].includes(s)) {
    return "DECLINED";
  }

  return "ERROR";
}

interface CardPanelProps {
  customerId: string;
  valor: number;
  descricao: string;
  onPaymentCreated: (ctx: PagamentoCriado) => void;
}

export function CardPanel({ customerId, valor, descricao, onPaymentCreated }: CardPanelProps) {
  const [previewCartao, setPreviewCartao] = useState<{
    holderName: string;
    number: string;
    expiry: string;
  }>({ holderName: "", number: "", expiry: "" });

  const [bandeiraCartao, setBandeiraCartao] = useState<CardBrand>("unknown");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CardPaymentData>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardType: "credit" },
    mode: "onBlur",
  });

  const tipoSelecionado = watch("cardType");

  const aoMudarNumeroCartao = useCallback((valorDigitado: string) => {
      const formatado = formatCardNumber(valorDigitado);
      setValue("number", formatado, { shouldValidate: true });
      setPreviewCartao((prev) => ({ ...prev, number: formatado }));
      setBandeiraCartao(detectCardBrand(formatado));
    },
    [setValue]
  );

  const aoMudarValidade = useCallback((valorDigitado: string) => {
      const formatado = formatExpiry(valorDigitado);
      const [mes, ano] = formatado.split("/");
      setValue("expiryMonth", mes || "", { shouldValidate: true });
      setValue("expiryYear", ano || "", { shouldValidate: true });
      setPreviewCartao((prev) => ({ ...prev, expiry: formatado }));
    },
    [setValue]
  );

  const aoMudarHolder = useCallback((valorDigitado: string) => {
      const upper = valorDigitado.toUpperCase();
      setValue("holderName", upper, { shouldValidate: true });
      setPreviewCartao((prev) => ({ ...prev, holderName: upper }));
    },
    [setValue]
  );

const onSubmit = useCallback(
  async (data: CardPaymentData) => {
    const expiryYear4 =
      data.expiryYear.length === 2
        ? `20${data.expiryYear}`
        : data.expiryYear;

    try {
      setLoading(true);

      const tipo =
        data.cardType === "credit" ? "CREDIT_CARD" : "DEBIT_CARD";

      const body = {
        customerId,
        valor,
        descricao,
        tipo,
        cartao: {
          holderName: data.holderName,
          number: data.number.replace(/\s/g, ""),
          expiryMonth: data.expiryMonth,
          expiryYear: expiryYear4,
          ccv: data.ccv,
        },
        portador: {
          name: data.name,
          email: data.email,
          cpfCnpj: data.cpfCnpj,
          postalCode: data.postalCode,
          addressNumber: data.addressNumber,
          phone: data.phone,
        },
      };

      console.log("Enviando pagamento cartão:", body);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/asaas/pagamentos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const resposta = await response.json().catch(() => null);

      if (!response.ok || !resposta) {
        toast.error("Falha ao processar pagamento com cartão");
        onPaymentCreated({
          metodo: "CARTAO",
          statusInicial: "ERROR",
        });
        return;
      }

      const uiStatus = mapStatusToUiStatus(resposta.status ?? "");

      onPaymentCreated({
        metodo: "CARTAO",
        paymentId: resposta.id,
        statusInicial: uiStatus,
      });

      toast.success(
        "Pagamento enviado para processamento. Clique em confirmar para verificar o status."
      );
    } catch (err) {
      toast.error("Falha ao processar pagamento com cartão", {
        description: err instanceof Error ? err.message : String(err),
      });
      onPaymentCreated({
        metodo: "CARTAO",
        statusInicial: "ERROR",
      });
    } finally {
      setLoading(false);
    }
  },
  [customerId, valor, descricao, onPaymentCreated]
);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pré-visualização do cartão */}
      <div className="mb-6">
        <CardPreview
          holderName={previewCartao.holderName}
          number={previewCartao.number}
          expiry={previewCartao.expiry}
          brand={bandeiraCartao}
        />
      </div>

      {/* Tipo de Cartão */}
      <div className="space-y-3">
        <Label>Tipo de Cartão</Label>
        <RadioGroup
          defaultValue="credit"
          onValueChange={(value) =>
            setValue("cardType", value as CardType, {
              shouldValidate: true,
            })
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="cursor-pointer font-normal">
              Crédito
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit" className="cursor-pointer font-normal">
              Débito
            </Label>
          </div>
        </RadioGroup>
        {errors.cardType && (
          <p className="text-sm text-destructive">
            {errors.cardType.message}
          </p>
        )}
      </div>

      {/* Dados do Cartão */}
      <div className="space-y-4">
        <h3 className="font-semibold">Dados do Cartão</h3>

        <Field
          id="holderName"
          label="Nome no Cartão"
          error={errors.holderName?.message}
        >
          <Input
            id="holderName"
            placeholder="NOME COMO ESTÁ NO CARTÃO"
            className="uppercase"
            aria-invalid={!!errors.holderName}
            {...register("holderName")}
            onChange={(e) => aoMudarHolder(e.target.value)}
          />
        </Field>

        <Field
          id="number"
          label="Número do Cartão"
          error={errors.number?.message}
        >
          <Input
            id="number"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            aria-invalid={!!errors.number}
            {...register("number")}
            onChange={(e) => aoMudarNumeroCartao(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
            <Field
            id="expiry"
            label="Validade"
            error={
              errors.expiryMonth || errors.expiryYear
              ? "Validade inválida"
              : undefined
            }
            >
            <Input
              id="expiry"
              placeholder="MM/YYYY"
              maxLength={7}
              aria-invalid={!!errors.expiryMonth || !!errors.expiryYear}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 6); // MM + YYYY
              const mes = digits.slice(0, 2);
              const ano = digits.slice(2); // pode ter 0..4 dígitos
              const formatted = mes + (ano ? `/${ano}` : "");
              setValue("expiryMonth", mes || "", { shouldValidate: true });
              setValue("expiryYear", ano || "", { shouldValidate: true });
              setPreviewCartao((prev) => ({ ...prev, expiry: formatted }));
              }}
            />
            </Field>

          <Field id="ccv" label="CVV" error={errors.ccv?.message}>
            <MaskedInput
              id="ccv"
              placeholder="000"
              maxLength={4}
              aria-invalid={!!errors.ccv}
              onMask={formatCVV}
              setValue={(path, val) =>
                setValue(path, val, { shouldValidate: true })
              }
              {...register("ccv")}
              name="ccv"
            />
          </Field>
        </div>
      </div>

      {/* Dados Pessoais */}
      <div className="space-y-4">
        <h3 className="font-semibold">Dados Pessoais</h3>

        <Field id="name" label="Nome Completo" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="Seu nome completo"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </Field>

        <Field id="email" label="E-mail" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>

        <Field
          id="cpfCnpj"
          label="CPF/CNPJ"
          error={errors.cpfCnpj?.message}
        >
          <MaskedInput
            id="cpfCnpj"
            placeholder="000.000.000-00"
            aria-invalid={!!errors.cpfCnpj}
            onMask={formatCPFCNPJ}
            setValue={(path, val) =>
              setValue(path, val, { shouldValidate: true })
            }
            {...register("cpfCnpj")}
            name="cpfCnpj"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            id="postalCode"
            label="CEP"
            error={errors.postalCode?.message}
          >
            <MaskedInput
              id="postalCode"
              placeholder="00000-000"
              maxLength={9}
              aria-invalid={!!errors.postalCode}
              onMask={formatPostalCode}
              setValue={(path, val) =>
                setValue(path, val, { shouldValidate: true })
              }
              {...register("postalCode")}
              name="postalCode"
            />
          </Field>

          <Field
            id="addressNumber"
            label="Número"
            error={errors.addressNumber?.message}
          >
            <Input
              id="addressNumber"
              placeholder="123"
              aria-invalid={!!errors.addressNumber}
              {...register("addressNumber")}
            />
          </Field>
        </div>

        <Field id="phone" label="Telefone" error={errors.phone?.message}>
          <MaskedInput
            id="phone"
            placeholder="(00) 00000-0000"
            aria-invalid={!!errors.phone}
            onMask={formatPhone}
            setValue={(path, val) =>
              setValue(path, val, { shouldValidate: true })
            }
            {...register("phone")}
            name="phone"
          />
        </Field>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? "Processando..."
          : `Pagar com ${
              tipoSelecionado === "credit" ? "Crédito" : "Débito"
            }`}
      </Button>
    </form>
  );
}
