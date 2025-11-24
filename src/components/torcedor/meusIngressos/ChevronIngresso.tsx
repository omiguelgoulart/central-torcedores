"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChevronProps {
  currentPage?: number;
  totalPages?: number;
  onChangePage?: (page: number) => void;
}

export function Chevron({
  currentPage = 1,
  totalPages = 1,
  onChangePage,
}: ChevronProps) {
  const handlePrev = () => {
    if (currentPage > 1) onChangePage?.(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChangePage?.(currentPage + 1);
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {/* Botão anterior */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={handlePrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Página atual */}
      <Badge className="px-3 py-1 text-sm font-semibold">
        {currentPage}
      </Badge>

      {/* Botão próximo */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={handleNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
