import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#05050a] text-white">
      <Navbar />

      {/* Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
