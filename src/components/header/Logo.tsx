
import Image from "next/image";
import Link from "next/link";

export function LogoBrand() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/brasil-logo.png"
        alt="Logo Brasil de Pelotas"
        width={32}
        height={32}
      />
      <span className="hidden text-lg font-bold sm:inline-block">Brasil de Pelotas</span>
    </Link>
  );
}
