function StatCardSkeleton() {
  return (
    <div className="relative">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6">
        <div className="h-12 w-12 rounded-2xl bg-white/10 animate-pulse mb-4" />
        <div className="h-10 w-20 rounded-lg bg-white/10 animate-pulse mb-2" />
        <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

function BentoCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-2xl bg-white/10 animate-pulse" />
        <div>
          <div className="h-7 w-40 rounded-lg bg-white/10 animate-pulse mb-2" />
          <div className="h-4 w-52 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="h-16 w-full rounded-2xl bg-white/5 animate-pulse mb-6" />
      <div className="h-12 w-full rounded-2xl bg-white/10 animate-pulse" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-2xl bg-white/10 animate-pulse" />
        <div className="h-6 w-32 rounded-lg bg-white/10 animate-pulse" />
      </div>
      <div className="h-[280px] w-full rounded-2xl bg-white/5 animate-pulse" />
    </div>
  );
}

function WeakPointsSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-11 w-11 rounded-2xl bg-white/10 animate-pulse" />
        <div>
          <div className="h-6 w-40 rounded-lg bg-white/10 animate-pulse mb-2" />
          <div className="h-4 w-52 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-12 rounded bg-white/10 animate-pulse" />
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="flex flex-col gap-12">
      {/* Hero */}
      <div>
        <div className="h-16 md:h-20 w-72 rounded-2xl bg-white/10 animate-pulse mb-4" />
        <div className="h-6 w-80 rounded-lg bg-white/5 animate-pulse" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Bento Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <BentoCardSkeleton className="lg:col-span-2" />
        <BentoCardSkeleton />
      </div>

      {/* Chart + Weak Points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-1">
          <WeakPointsSkeleton />
        </div>
      </div>
    </main>
  );
}
