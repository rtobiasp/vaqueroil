import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  uuid,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";

export const appointment_status = pgEnum("status", [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

//Usuarios
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

//Servicios disponibles
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  price: decimal("price").notNull(),
});

//Vehiculo
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  licensePlate: text("license_plate").notNull().unique(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: date("year", { mode: "date" }).notNull(),
  vin: text("vin"),
});

//Reservas
export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  fechaInicio: timestamp("fecha_inicio", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  fechaFin: timestamp("fecha_fin", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  status: appointment_status("status").default("PENDING"),
  notes: text("notes"),
  user: uuid("user_id").references(() => users.id),
  service: uuid("service_id").references(() => services.id),
  vehicle: uuid("vehicle_id").references(() => vehicles.id),
});
