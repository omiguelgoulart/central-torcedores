import { Suspense } from "react";
import { FormRedefinirSenha } from "@/components/(auth)/novaSenha/FormNovaSenha";

export default function RedefinirSenhaPage() {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Redefinir Senha</h1>
          <p className="text-sm text-muted-foreground">
            Digite sua nova senha abaixo
          </p>
        </div>
        <Suspense
          fallback={
            <p className="text-center text-muted-foreground">Carregando...</p>
          }
        >
          <FormRedefinirSenha />
        </Suspense>
      </div>
    </div>
  );
}
