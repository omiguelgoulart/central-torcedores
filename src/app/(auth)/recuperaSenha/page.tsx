import { FormRecuperaSenha } from "@/components/(auth)/recuperaSenha/FormRecuperaSenha";

export default function RecuperaSenhaPage() {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          <p className="text-sm text-muted-foreground">
            Insira seu e-mail para receber as instruções de recuperação
          </p>
        </div>
        <FormRecuperaSenha />
      </div>
    </div>
  );
}
