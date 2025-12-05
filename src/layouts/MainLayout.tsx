import Navbar from "../components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
<div 
  className="min-h-screen w-full text-white bg-cover bg-no-repeat bg-top"
  style={{ backgroundImage: "url('/src/assets/galaxy-bg.jpg')" }}
>
      <Navbar />

      {/* Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
