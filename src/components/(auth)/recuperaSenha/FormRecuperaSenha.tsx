   "use client";

   import { useState } from "react";
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import * as z from "zod";
   import { toast } from "sonner";

   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Loader2 } from "lucide-react";

   const API = process.env.NEXT_PUBLIC_API_URL;

   const schema = z.object({
     email: z.string().email("Informe um e-mail válido"),
   });

   type FormData = z.infer<typeof schema>;

   export function FormRecuperaSenha() {
     const [enviado, setEnviado] = useState(false);
     const {
       register,
       handleSubmit,
       formState: { errors, isSubmitting },
     } = useForm<FormData>({ resolver: zodResolver(schema) });

     async function onSubmit(data: FormData) {
       try {
         const res = await fetch(`${API}/auth/recuperar-senha`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email: data.email }),
         });

         if (!res.ok) {
           toast.error("Erro ao enviar instruções. Tente novamente.");
           return;
         }

         setEnviado(true);
         toast.success("Instruções enviadas para o seu e-mail!");
       } catch {
         toast.error("Erro de conexão. Tente novamente.");
       }
     }

     if (enviado) {
       return (
         <p className="text-center text-muted-foreground">
           Verifique sua caixa de entrada. Enviamos as instruções de recuperação.
         </p>
       );
     }

     return (
       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <div>
           <Label htmlFor="email">E-mail</Label>
           <Input
             id="email"
             type="email"
             placeholder="seu@email.com"
             className="w-full"
             {...register("email")}
           />
           {errors.email && (
             <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
           )}
         </div>
         <Button type="submit" className="w-full" disabled={isSubmitting}>
           {isSubmitting ? (
             <>
               <Loader2 className="h-4 w-4 animate-spin mr-2" />
               Enviando...
             </>
           ) : (
             "Enviar instruções"
           )}
         </Button>
       </form>
     );
   }