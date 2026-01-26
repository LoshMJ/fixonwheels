import AuthCard from "../components/auth/AuthCard";
import RegisterForm from "../components/auth/RegisterForm";
import galaxy from "../assets/galaxy-bg.jpg";

export default function Register() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={galaxy}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
     <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-purple-900/30" />


      <div className="relative z-10">
        <AuthCard>
          <RegisterForm />
        </AuthCard>
      </div>
    </section>
  );
}
