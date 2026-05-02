import { Router } from "express";
import { db, candidatesTable } from "@workspace/db";
import { CreateCandidateBody, UpdateCandidateBody } from "@workspace/api-zod";
import { eq, and, gte, lte, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const { language, role, minExperience, maxRate, status } = req.query;

  const conditions = [];
  if (language) conditions.push(eq(candidatesTable.language, language as string));
  if (role) conditions.push(sql`lower(${candidatesTable.role}) like ${"%" + (role as string).toLowerCase() + "%"}`);
  if (minExperience) conditions.push(gte(candidatesTable.experienceYears, parseInt(minExperience as string)));
  if (maxRate) conditions.push(lte(candidatesTable.hourlyRate, parseInt(maxRate as string)));
  if (status) conditions.push(eq(candidatesTable.status, status as string));

  const candidates = conditions.length
    ? await db.select().from(candidatesTable).where(and(...conditions))
    : await db.select().from(candidatesTable);

  res.json(candidates.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const parsed = CreateCandidateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [candidate] = await db.insert(candidatesTable).values(parsed.data).returning();
  res.status(201).json({ ...candidate, createdAt: candidate.createdAt.toISOString() });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, id));
  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }
  res.json({ ...candidate, createdAt: candidate.createdAt.toISOString() });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const parsed = UpdateCandidateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(candidatesTable)
    .set(parsed.data)
    .where(eq(candidatesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(candidatesTable).where(eq(candidatesTable.id, id));
  res.status(204).send();
});

export default router;
