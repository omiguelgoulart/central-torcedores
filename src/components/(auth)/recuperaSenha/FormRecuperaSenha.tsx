import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FormRecuperaSenha() {

    return (
        <form className="space-y-4">
            <Label htmlFor="email">E-mail</Label>
            <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="w-full"
            />
            <Button type="submit" className="w-full">
                Enviar instruções
            </Button>
        </form>
    )
}