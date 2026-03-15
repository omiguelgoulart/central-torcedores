"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;
    setCanScrollPrev(viewport.scrollLeft > 0);
    setCanScrollNext(viewport.scrollLeft < maxScrollLeft - 1);
  }, []);

  const scrollPrev = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const step = Math.max(viewport.clientWidth * 0.85, 200);
    viewport.scrollBy({ left: -step, behavior: "smooth" });
  }, []);

  const scrollNext = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const step = Math.max(viewport.clientWidth * 0.85, 200);
    viewport.scrollBy({ left: step, behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateScrollState();

    viewport.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      viewport.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  return (
    <CarouselContext.Provider
      value={{
        viewportRef,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
      }}
    >
      <div
        data-slot="carousel"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { viewportRef } = useCarousel();

  return (
    <div
      ref={viewportRef}
      data-slot="carousel-viewport"
      className="overflow-x-auto scroll-smooth scrollbar-none"
    >
      <div
        data-slot="carousel-content"
        className={cn("flex touch-pan-y snap-x snap-mandatory", className)}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full snap-start", className)}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { canScrollPrev, scrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute top-1/2 left-2 size-8 -translate-y-1/2 rounded-full",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeft />
      <span className="sr-only">Slide anterior</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { canScrollNext, scrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-full",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRight />
      <span className="sr-only">Próximo slide</span>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
};
