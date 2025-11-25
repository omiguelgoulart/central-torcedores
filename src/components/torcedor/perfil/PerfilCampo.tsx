"use client";

interface Props {
  label: string;
  valor?: string | null;
}

export function PerfilCampo({ label, valor }: Props) {
  if (!valor) return null;

  return (
    <div>
      <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-white font-medium break-all">{valor}</p>
    </div>
  );
}
