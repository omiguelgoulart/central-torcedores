// components/layout/LogoBrand.tsx
import Link from "next/link";

export function LogoBrand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* Marca: BP dentro de um círculo (pode trocar por <Image /> depois) */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full border font-bold text-lg">
        BP
      </div>
      <span className="hidden text-lg font-bold sm:inline-block">Brasil de Pelotas</span>
    </Link>
  );
}
