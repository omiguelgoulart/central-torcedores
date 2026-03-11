import { FormCadastro } from "@/components/(auth)/cadastro/FormCadastro";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-sm text-muted-foreground">
            Preencha os campos abaixo para se cadastrar
          </p>
        </div>
        <FormCadastro />
      </div>
    </div>
  );
}
