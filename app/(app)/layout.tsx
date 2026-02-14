import { Navbar } from "@/components/shared/Navbar";
import { MobileNav } from "@/components/shared/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white">
      {/* Ambient glow shapes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-500/[0.07] blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-teal-600/[0.04] blur-[100px]" />
      </div>

      {/* Desktop navbar */}
      <Navbar />

      {/* Main content */}
      <main className="relative mx-auto w-full max-w-7xl px-6 pb-32 pt-8 md:px-8 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
