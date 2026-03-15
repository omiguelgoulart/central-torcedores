import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PartidasLoadingSkeleton() {
  return (
    <div className="mt-6">
      <Card className="mx-auto border-none bg-transparent shadow-none">
        <CardHeader>
          <Skeleton className="h-8 w-52" />
          <div className="mt-6 flex justify-center gap-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-6 w-28 self-center" />
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex gap-4 overflow-hidden pb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[85%] flex-shrink-0 space-y-3 rounded-lg border p-4 sm:min-w-[60%] md:min-w-[32%]"
              >
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
