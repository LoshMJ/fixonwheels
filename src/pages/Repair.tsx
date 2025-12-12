import RepairIntro from "../components/Repair/RepairIntro";
import RepairSteps from "../components/Repair/RepairSteps";

export default function Repair() {

  return (
    <div className="w-full min-h-screen overflow-hidden bg-black">


        <RepairIntro />
     
        <RepairSteps />
      
    </div>
  );
}
