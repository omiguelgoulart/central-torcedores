"use client";

import { UserAvatar } from "./AvatarUser";
import { LogoBrand } from "./Logo";
// components/layout/Header.tsx
import { NavSheet } from "./NavSheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <NavSheet />
          <LogoBrand />
        </div>

        <UserAvatar />
      </div>
    </header>
  );
}
