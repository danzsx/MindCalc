/* Numetria Dashboard — Loading Skeleton (Glass Intelligence) */

function GlassSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ background: "rgba(141, 194, 255, 0.07)" }}
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(141,194,255,0.08), transparent)",
        }}
      />
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div
      className="relative p-6 rounded-[28px] overflow-hidden"
      style={{
        background: "rgba(13, 29, 58, 0.6)",
        border: "1px solid rgba(141, 194, 255, 0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Icon placeholder */}
      <GlassSkeleton className="w-11 h-11 rounded-2xl mb-5" />
      {/* Value placeholder */}
      <GlassSkeleton className="h-10 w-16 rounded-xl mb-2" />
      {/* Label placeholder */}
      <GlassSkeleton className="h-3 w-24 rounded-full" />
    </div>
  );
}

function BentoCardSkeleton({ className = "", tall = false }: { className?: string; tall?: boolean }) {
  return (
    <div
      className={`relative p-7 rounded-[32px] overflow-hidden flex flex-col gap-5 ${className} ${
        tall ? "min-h-[280px]" : "min-h-[220px]"
      }`}
      style={{
        background: "rgba(13, 29, 58, 0.6)",
        border: "1px solid rgba(141, 194, 255, 0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-4">
        <GlassSkeleton className="w-12 h-12 rounded-2xl shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <GlassSkeleton className="h-5 w-40 rounded-lg" />
          <GlassSkeleton className="h-3 w-52 rounded-full" />
        </div>
      </div>
      <GlassSkeleton className="h-14 w-full rounded-2xl" />
      <GlassSkeleton className="h-12 w-full rounded-2xl mt-auto" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div
      className="relative p-7 rounded-[32px] overflow-hidden"
      style={{
        background: "rgba(13, 29, 58, 0.6)",
        border: "1px solid rgba(141, 194, 255, 0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3 mb-7">
        <GlassSkeleton className="w-10 h-10 rounded-2xl shrink-0" />
        <div className="flex flex-col gap-2">
          <GlassSkeleton className="h-5 w-32 rounded-lg" />
          <GlassSkeleton className="h-3 w-40 rounded-full" />
        </div>
      </div>
      {/* Chart bars */}
      <div className="flex items-end gap-3 h-[220px] px-2">
        {[55, 70, 45, 85, 60, 90, 40, 75, 65, 80].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-lg relative overflow-hidden"
            style={{
              height: `${h}%`,
              background: "rgba(55, 112, 191, 0.08)",
            }}
          >
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(55,112,191,0.05), transparent)",
                animationDelay: `${i * 0.08}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function WeakPointsSkeleton() {
  return (
    <div
      className="relative p-7 rounded-[32px] overflow-hidden"
      style={{
        background: "rgba(13, 29, 58, 0.6)",
        border: "1px solid rgba(141, 194, 255, 0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3 mb-7">
        <GlassSkeleton className="w-10 h-10 rounded-2xl shrink-0" />
        <div className="flex flex-col gap-2">
          <GlassSkeleton className="h-5 w-40 rounded-lg" />
          <GlassSkeleton className="h-3 w-32 rounded-full" />
        </div>
      </div>
      <GlassSkeleton className="h-12 w-full rounded-2xl mb-6" />
      <div className="flex flex-col gap-5">
        {[70, 45, 30].map((w, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between">
              <GlassSkeleton className="h-4 w-28 rounded-lg" />
              <GlassSkeleton className="h-4 w-14 rounded-lg" />
            </div>
            <GlassSkeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div
      className="relative overflow-hidden p-8 md:p-10 rounded-[32px]"
      style={{
        background: "rgba(13, 29, 58, 0.6)",
        border: "1px solid rgba(141, 194, 255, 0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      <GlassSkeleton className="h-4 w-32 rounded-full mb-3" />
      <GlassSkeleton className="h-14 w-72 rounded-2xl mb-3" />
      <GlassSkeleton className="h-5 w-80 rounded-lg" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="flex flex-col gap-8">
      {/* Hero */}
      <HeroSkeleton />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Bento Grid: LessonsOverview (2/3) + TablesCard (1/3) */}
      <div className="grid lg:grid-cols-3 gap-5">
        <BentoCardSkeleton className="lg:col-span-2" tall />
        <BentoCardSkeleton />
      </div>

      {/* Chart + Weak Points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
