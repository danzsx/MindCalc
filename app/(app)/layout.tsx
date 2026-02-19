import { Navbar } from "@/components/shared/Navbar";
import { MobileNav } from "@/components/shared/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: "#080f1e" /* Deep Navy */ }}
    >
      {/* ── Atmospheric background layer ── */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Blue Harbor radial glow — top right */}
        <div
          className="absolute -top-[20%] -right-[15%] w-[65%] h-[65%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(55, 112, 191, 0.10) 0%, transparent 70%)",
          }}
        />
        {/* Deep Navy shadow — bottom left */}
        <div
          className="absolute -bottom-[20%] -left-[15%] w-[55%] h-[55%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(13, 29, 58, 0.6) 0%, transparent 70%)",
          }}
        />
        {/* Noise texture — adds depth without color */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.022]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="numetria-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#numetria-noise)" />
        </svg>
      </div>

      {/* Desktop navbar */}
      <Navbar />

      {/* Main content */}
      <main className="relative mx-auto w-full max-w-7xl px-4 pb-32 pt-6 md:px-8 md:pb-12 md:pt-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
