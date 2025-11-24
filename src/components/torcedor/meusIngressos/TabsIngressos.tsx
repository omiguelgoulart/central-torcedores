"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AbaIngresso = "PROXIMOS" | "HISTORICO";

interface TabsIngressoProps {
  active: AbaIngresso;
  onChange: (value: AbaIngresso) => void;
}

export function TabsIngresso({ active, onChange }: TabsIngressoProps) {
  return (
    <Tabs
      value={active}
      onValueChange={(v) => onChange(v as AbaIngresso)}
      className="w-full"
    >
      <TabsList className="w-full bg-transparent ">
        <TabsTrigger value="PROXIMOS" className="uppercase py-5 ">
          Em aberto
        </TabsTrigger>

        <TabsTrigger value="HISTORICO" className="uppercase py-5">
          Finalizados
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
