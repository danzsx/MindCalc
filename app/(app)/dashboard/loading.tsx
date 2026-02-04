import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-[20px] p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-[300px] lg:h-[350px] w-full rounded-lg" />
    </div>
  );
}

function LessonsOverviewSkeleton() {
  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-4 w-48 mb-5" />
      <div className="space-y-2 mb-5">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

function WeakPointsSkeleton() {
  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-14 w-40 rounded-xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Lessons Overview */}
      <LessonsOverviewSkeleton />

      {/* Evolution Chart */}
      <ChartSkeleton />

      {/* Weak Points */}
      <WeakPointsSkeleton />
    </main>
  );
}
