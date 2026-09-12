import { Wrench, CircuitBoard, Toolbox, LifeBuoy } from "lucide-react";

export default function FeatureBarSection() {
  return (
    <section className="grid grid-cols-4 w-full px-16 py-8 min-h-[25vh] text-text-inverse bg-felt bg-surface-mid">
      <div className="flex flex-col justify-center items-center border-r-2 px-5">
        <Wrench width={48} height={"auto"} />
        <p className="text-center text-xl">Reparación y mantenimiento</p>
      </div>
      <div className="flex flex-col justify-center items-center border-r-2 px-5">
        <CircuitBoard width={48} height={"auto"} />
        <p className="text-center text-xl">Diagnosis electrónica avanzada</p>
      </div>
      <div className="flex flex-col justify-center items-center border-r-2 px-5">
        <Toolbox width={48} height={"auto"} />
        <p className="text-center text-xl">Pre-ITV y emisiones</p>
      </div>
      <div className="flex flex-col justify-center items-center px-5">
        <LifeBuoy width={48} height={"auto"} />
        <p className="text-center text-xl">Neumáticos y frenos</p>
      </div>
    </section>
  );
}
