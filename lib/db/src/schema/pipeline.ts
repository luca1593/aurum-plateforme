import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { contactsTable } from "./contacts";

export const PIPELINE_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const pipelineLeadsTable = pgTable("pipeline_leads", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id")
    .notNull()
    .references(() => contactsTable.id, { onDelete: "cascade" }),
  stage: text("stage").notNull().default("new"),
  notes: text("notes"),
  value: integer("value").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PipelineLead = typeof pipelineLeadsTable.$inferSelect;
export type InsertPipelineLead = typeof pipelineLeadsTable.$inferInsert;
