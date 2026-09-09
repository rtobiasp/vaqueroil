import { db } from "@/src/db/index";
import { services } from "@/src/db/schema";
import { AppointmentForm } from "./appointment-form";

export default async function RequestAppointmentQuotePage() {
  const servicios = await db
    .select({ id: services.id, name: services.name })
    .from(services);

  return <AppointmentForm services={servicios} />;
}
