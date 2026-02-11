import { Navbar } from "@/components/shared/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 lg:px-12" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>{children}</main>
    </>
  );
}
