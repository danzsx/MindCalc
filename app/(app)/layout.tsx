import { Navbar } from "@/components/shared/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 lg:px-12 py-8 lg:py-12">{children}</main>
    </>
  );
}
