import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  decimal,
  uuid,
  pgEnum,
  date,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const appointment_status = pgEnum("status", [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

//Usuarios
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: varchar("phone", { length: 256 }),
  },
  (table) => [
    uniqueIndex("users_email_lower_unique").on(sql`lower(${table.email})`),
  ],
);

//Servicios disponibles
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price").notNull(),
});

//Vehiculo
export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  licensePlate: text("license_plate").notNull().unique(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
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
  status: appointment_status("status").default("PENDING").notNull(),
  notes: text("notes"),
  user: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  service: uuid("service_id")
    .references(() => services.id)
    .notNull(),
  vehicle: uuid("vehicle_id")
    .references(() => vehicles.id)
    .notNull(),
});
