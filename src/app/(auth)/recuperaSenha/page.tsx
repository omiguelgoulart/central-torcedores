import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormRecuperaSenha } from "@/components/(auth)/recuperaSenha/FormRecuperaSenha"



export default function RecuperaSenhaPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <Card className="w-full max-w-sm sm:max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Recuperar Senha
                    </CardTitle>
                    <CardDescription className="text-center">
                        Insira seu e-mail para receber as instruções de recuperação
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FormRecuperaSenha />
                </CardContent>
            </Card>
        </div>
    )
}