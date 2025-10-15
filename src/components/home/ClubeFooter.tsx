import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function ClubeFooter() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">
                BP
              </div>
              <span className="font-bold text-lg">Brasil de Pelotas</span>
            </div>
            <p className="text-sm">Central de Sócio Torcedor oficial do Grêmio Esportivo Brasil.</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Institucional</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="hover:underline transition-colors">
                  Sobre o clube
                </Link>
              </li>
              <li>
                <Link href="/historia" className="hover:underline transition-colors">
                  História
                </Link>
              </li>
              <li>
                <Link href="/diretoria" className="hover:underline transition-colors">
                  Diretoria
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos" className="hover:underline transition-colors">
                  Termos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:underline transition-colors">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link href="/lgpd" className="hover:underline transition-colors">
                  LGPD
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Redes Sociais</h3>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                className="h-10 w-10 rounded-full flex items-center justify-center hover:underline transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="h-10 w-10 rounded-full flex items-center justify-center hover:underline transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="h-10 w-10 rounded-full flex items-center justify-center hover:underline transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://youtube.com"
                className="h-10 w-10 rounded-full flex items-center justify-center hover:underline transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Grêmio Esportivo Brasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
