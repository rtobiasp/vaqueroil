import HeroLanding from "@/components/HeroLanding";
import { db } from "@/src/db/index";
import { services } from "@/src/db/schema";
import { AppointmentForm } from "./appointment-form";

export const dynamic = "force-dynamic";

export default async function RequestAppointmentQuotePage() {
  const servicios = await db
    .select({ id: services.id, name: services.name })
    .from(services);

  return (
    <main>
      <HeroLanding bg_image="/hero_background.jpg" title="PEDIR CITA" />
      <AppointmentForm services={servicios} />
    </main>
  );
}
