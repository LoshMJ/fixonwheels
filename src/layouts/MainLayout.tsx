import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
