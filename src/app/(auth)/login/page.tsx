import { LoginForm } from "@/components/(auth)/login/FormLogin";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Bem-vindo!</h1>
          <p className="text-sm text-muted-foreground">
            Entre com suas credenciais para acessar sua conta
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
