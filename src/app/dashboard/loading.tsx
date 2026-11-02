import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Route-level loading UI shown while the dashboard Server Component re-fetches
// workouts (e.g. when a new date is selected). Placeholder blocks mirror the
// real layout in `page.tsx` so the transition reads clearly.
export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Loading workouts…
          </p>
        </div>

        <div className="bg-muted h-9 w-full animate-pulse rounded-md sm:w-56" />
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col gap-4">
        {[0, 1].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-col gap-2">
              <div className="bg-muted h-5 w-40 animate-pulse rounded" />
              <div className="bg-muted h-4 w-28 animate-pulse rounded" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                <div className="bg-muted h-5 w-12 animate-pulse rounded-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
