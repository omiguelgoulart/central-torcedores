import { Skeleton } from "@/components/ui/skeleton";

export function HomeLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="relative h-[320px] w-full overflow-hidden rounded-b-2xl">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="container mx-auto space-y-14 px-4 pt-12 pb-20">
        <section className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-lg border p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-lg border p-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
