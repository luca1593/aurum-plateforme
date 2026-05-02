import { Router } from "express";
import { db, pipelineLeadsTable, contactsTable } from "@workspace/db";
import { CreatePipelineLeadBody, UpdatePipelineLeadBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const STAGE_LABELS: Record<string, string> = {
  new: "New Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal Sent",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const ALL_STAGES = ["new", "contacted", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"];

const router = Router();

router.get("/", async (_req, res) => {
  const leads = await db
    .select({
      id: pipelineLeadsTable.id,
      contactId: pipelineLeadsTable.contactId,
      stage: pipelineLeadsTable.stage,
      notes: pipelineLeadsTable.notes,
      value: pipelineLeadsTable.value,
      createdAt: pipelineLeadsTable.createdAt,
      updatedAt: pipelineLeadsTable.updatedAt,
      contactName: contactsTable.name,
      contactCompany: contactsTable.company,
      contactEmail: contactsTable.email,
      contactNeed: contactsTable.need,
      contactCreatedAt: contactsTable.createdAt,
    })
    .from(pipelineLeadsTable)
    .leftJoin(contactsTable, eq(pipelineLeadsTable.contactId, contactsTable.id));

  const stageMap: Record<string, typeof leads> = {};
  ALL_STAGES.forEach((s) => (stageMap[s] = []));
  leads.forEach((l) => {
    const stage = l.stage || "new";
    if (!stageMap[stage]) stageMap[stage] = [];
    stageMap[stage].push(l);
  });

  const stages = ALL_STAGES.map((stage) => ({
    stage,
    label: STAGE_LABELS[stage] ?? stage,
    leads: stageMap[stage].map((l) => ({
      id: l.id,
      contactId: l.contactId,
      contact: {
        id: l.contactId,
        name: l.contactName ?? "",
        company: l.contactCompany ?? "",
        email: l.contactEmail ?? "",
        need: l.contactNeed ?? "",
        createdAt: l.contactCreatedAt?.toISOString() ?? "",
      },
      stage: l.stage,
      notes: l.notes,
      value: l.value,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    })),
    totalValue: stageMap[stage].reduce((sum, l) => sum + (l.value ?? 0), 0),
  }));

  res.json({ stages });
});

router.post("/leads", async (req, res) => {
  const parsed = CreatePipelineLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lead] = await db.insert(pipelineLeadsTable).values(parsed.data).returning();
  res.status(201).json({ ...lead, createdAt: lead.createdAt.toISOString(), updatedAt: lead.updatedAt.toISOString() });
});

router.patch("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = UpdatePipelineLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(pipelineLeadsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(pipelineLeadsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Pipeline lead not found" });
    return;
  }

  res.json({ ...updated, createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString() });
});

router.delete("/leads/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(pipelineLeadsTable).where(eq(pipelineLeadsTable.id, id));
  res.status(204).send();
});

export default router;
