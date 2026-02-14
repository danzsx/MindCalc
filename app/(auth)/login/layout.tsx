export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 px-4 py-8 overflow-hidden">
      {/* Ambient glow shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500/[0.06] blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/[0.04] blur-[80px] pointer-events-none" />

      {/* Noise texture */}
      <div className="landing-noise pointer-events-none" />

      {children}
    </div>
  );
}
