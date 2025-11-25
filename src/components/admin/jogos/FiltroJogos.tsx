"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  termoBusca: string;
  onChangeBusca: (value: string) => void;
};

export function FiltroJogos ({ termoBusca, onChangeBusca }: Props) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Label htmlFor="busca" className="text-xs mb-1 block">
          Buscar
        </Label>
        <Input
          id="busca"
          placeholder="Nome do jogo, data ou local..."
          value={termoBusca}
          onChange={(e) => onChangeBusca(e.target.value)}
        />
      </div>

      <div className="w-40">
        <Label className="text-xs mb-1 block">Período</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="30">Próximos 30 dias</SelectItem>
            <SelectItem value="90">Próximos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
