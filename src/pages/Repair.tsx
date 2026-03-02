import RepairIntro from "../components/Repair/RepairIntro";
import RepairLayout from "../components/Repair/RepairLayout";

export default function Repair() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-no-repeat bg-top"
      style={{ backgroundImage: "url('/src/assets/galaxy-bg.jpg')" }}
    >
      <RepairIntro />
      <RepairLayout />
    </div>
  );
}