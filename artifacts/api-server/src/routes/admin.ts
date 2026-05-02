import { Router } from "express";
import { db, contactsTable, candidatesTable, pipelineLeadsTable, matchesTable } from "@workspace/db";
import { count, gte, eq, sum } from "drizzle-orm";

const router = Router();

router.get("/stats", async (_req, res) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [[totalLeadsRow], [thisWeekRow], [thisMonthRow], [totalCandidatesRow], [activeCandidatesRow], [totalMatchesRow], pipelineValueRow, leadsByStage, recentLeads] =
    await Promise.all([
      db.select({ count: count() }).from(contactsTable),
      db.select({ count: count() }).from(contactsTable).where(gte(contactsTable.createdAt, startOfWeek)),
      db.select({ count: count() }).from(contactsTable).where(gte(contactsTable.createdAt, startOfMonth)),
      db.select({ count: count() }).from(candidatesTable),
      db.select({ count: count() }).from(candidatesTable).where(eq(candidatesTable.status, "active")),
      db.select({ count: count() }).from(matchesTable),
      db.select({ total: sum(pipelineLeadsTable.value) }).from(pipelineLeadsTable),
      db.select({ stage: pipelineLeadsTable.stage, count: count() }).from(pipelineLeadsTable).groupBy(pipelineLeadsTable.stage),
      db.select().from(contactsTable).orderBy(contactsTable.createdAt).limit(5),
    ]);

  const totalLeads = totalLeadsRow.count;
  const closedWon = leadsByStage.find((s) => s.stage === "closed_won")?.count ?? 0;
  const conversionRate = totalLeads > 0 ? Math.round((closedWon / totalLeads) * 100 * 10) / 10 : 0;

  res.json({
    totalLeads,
    thisWeek: thisWeekRow.count,
    thisMonth: thisMonthRow.count,
    totalCandidates: totalCandidatesRow.count,
    activeCandidates: activeCandidatesRow.count,
    totalMatches: totalMatchesRow.count,
    conversionRate,
    pipelineValue: Number(pipelineValueRow[0]?.total ?? 0),
    leadsByStage: leadsByStage.map((s) => ({ stage: s.stage ?? "new", count: s.count })),
    recentLeads: recentLeads.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
  });
});

export default router;
