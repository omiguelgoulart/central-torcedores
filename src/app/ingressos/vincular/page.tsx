"use client";

import { FormEvent, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003";

type VincularIngressoResponse = {
  mensagem?: string;
  message?: string;
};

export default function VincularIngressoPage() {
  const { token } = useAuth();

  const [codigoIngresso, setCodigoIngresso] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    if (!codigoIngresso.trim()) {
      setErrorMessage("Informe o código do ingresso.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API}/admin/ingresso`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          codigoIngresso: codigoIngresso.trim(),
        }),
      });

      const data = (await response.json()) as VincularIngressoResponse;

      if (!response.ok) {
        const mensagemErro =
          typeof data?.mensagem === "string"
            ? data.mensagem
            : typeof data?.message === "string"
            ? data.message
            : "Não foi possível vincular o ingresso. Tente novamente.";
        setErrorMessage(mensagemErro);
        return;
      }

      const mensagemSucesso =
        typeof data?.mensagem === "string"
          ? data.mensagem
          : typeof data?.message === "string"
          ? data.message
          : "Ingresso vinculado com sucesso!";

      setSuccessMessage(mensagemSucesso);
      setCodigoIngresso("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao se comunicar com o servidor. Tente novamente em instantes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Vincular ingresso</CardTitle>
          <CardDescription>
            Informe o código do ingresso para vincular ao seu cadastro na Central de Torcedores.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {successMessage && (
            <Alert className="border-green-500/70">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigoIngresso">Código do ingresso</Label>
              <Input
                id="codigoIngresso"
                placeholder="Ex.: XAV-123-ABC-456"
                value={codigoIngresso}
                onChange={(event) => setCodigoIngresso(event.target.value)}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Você pode encontrar esse código no QR Code ou no comprovante do ingresso.
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vinculando ingresso...
                </>
              ) : (
                "Vincular ingresso"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
