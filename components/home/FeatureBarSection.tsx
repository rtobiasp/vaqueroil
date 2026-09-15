import { Wrench, CircuitBoard, Toolbox, LifeBuoy } from "lucide-react";
import StaggerGroup from "@/components/animations/StaggerGroup";

export default function FeatureBarSection() {
  return (
    <section className="grid w-full grid-cols-1 gap-y-8 bg-felt bg-surface-mid px-5 py-10 text-text-inverse sm:grid-cols-2 sm:px-8 lg:min-h-[25vh] lg:grid-cols-4 lg:px-16 lg:py-8">
      <h2 className="sr-only">Qué hacemos en el taller</h2>
      <StaggerGroup className="contents" stagger={0.1}>
        <div
          data-stagger
          className="flex flex-col items-center justify-center gap-3 px-5 sm:border-r sm:border-text-inverse/15 lg:gap-0 lg:border-r-2 lg:border-current"
        >
          <Wrench className="h-10 w-10 lg:h-12 lg:w-12" aria-hidden="true" />
          <p className="text-center text-base sm:text-lg lg:text-xl">
            Reparación y mantenimiento
          </p>
        </div>
        <div
          data-stagger
          className="flex flex-col items-center justify-center gap-3 border-t border-text-inverse/15 px-5 pt-8 sm:border-t-0 sm:border-r sm:border-text-inverse/15 sm:pt-0 lg:gap-0 lg:border-r-2 lg:border-current"
        >
          <CircuitBoard
            className="h-10 w-10 lg:h-12 lg:w-12"
            aria-hidden="true"
          />
          <p className="text-center text-base sm:text-lg lg:text-xl">
            Diagnosis electrónica avanzada
          </p>
        </div>
        <div
          data-stagger
          className="flex flex-col items-center justify-center gap-3 border-t border-text-inverse/15 px-5 pt-8 sm:border-t sm:border-text-inverse/15 sm:pt-8 lg:gap-0 lg:border-t-0 lg:border-r-2 lg:border-current lg:pt-0"
        >
          <Toolbox className="h-10 w-10 lg:h-12 lg:w-12" aria-hidden="true" />
          <p className="text-center text-base sm:text-lg lg:text-xl">
            Pre-ITV y emisiones
          </p>
        </div>
        <div
          data-stagger
          className="flex flex-col items-center justify-center gap-3 border-t border-text-inverse/15 px-5 pt-8 sm:border-t sm:border-text-inverse/15 sm:pt-8 lg:gap-0 lg:border-t-0 lg:pt-0"
        >
          <LifeBuoy className="h-10 w-10 lg:h-12 lg:w-12" aria-hidden="true" />
          <p className="text-center text-base sm:text-lg lg:text-xl">
            Neumáticos y frenos
          </p>
        </div>
      </StaggerGroup>
    </section>
  );
}
