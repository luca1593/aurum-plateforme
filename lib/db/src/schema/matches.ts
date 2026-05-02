import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { contactsTable } from "./contacts";
import { candidatesTable } from "./candidates";

export const matchesTable = pgTable("matches", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id")
    .notNull()
    .references(() => contactsTable.id, { onDelete: "cascade" }),
  candidateId: integer("candidate_id")
    .notNull()
    .references(() => candidatesTable.id, { onDelete: "cascade" }),
  score: integer("score").notNull().default(0),
  status: text("status").notNull().default("proposed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Match = typeof matchesTable.$inferSelect;
export type InsertMatch = typeof matchesTable.$inferInsert;
