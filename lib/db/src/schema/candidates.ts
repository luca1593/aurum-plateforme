import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const candidatesTable = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  skills: text("skills").array().notNull().default([]),
  language: text("language").notNull(),
  experienceYears: integer("experience_years").notNull().default(0),
  hourlyRate: integer("hourly_rate").notNull().default(0),
  availability: text("availability").notNull().default("available"),
  status: text("status").notNull().default("active"),
  bio: text("bio"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Candidate = typeof candidatesTable.$inferSelect;
export type InsertCandidate = typeof candidatesTable.$inferInsert;
