"use client";

// components/layout/NavSheet.tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import { useCallback, useState } from "react";
import { navItems } from "./NavData";
import { NavLinkItem } from "./NavItem";

export function NavSheet() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Abrir navegação">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64">
        <nav className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLinkItem key={item.href} item={item} onClick={close} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
