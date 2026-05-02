import { Router } from "express";
import { db, matchesTable, candidatesTable, contactsTable } from "@workspace/db";
import { CreateMatchBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const contactId = parseInt(req.query.contactId as string);
  if (isNaN(contactId)) {
    res.status(400).json({ error: "contactId is required" });
    return;
  }

  const matches = await db
    .select({
      id: matchesTable.id,
      contactId: matchesTable.contactId,
      candidateId: matchesTable.candidateId,
      score: matchesTable.score,
      status: matchesTable.status,
      notes: matchesTable.notes,
      createdAt: matchesTable.createdAt,
      candidateName: candidatesTable.name,
      candidateRole: candidatesTable.role,
      candidateSkills: candidatesTable.skills,
      candidateLanguage: candidatesTable.language,
      candidateExperience: candidatesTable.experienceYears,
      candidateRate: candidatesTable.hourlyRate,
      candidateAvailability: candidatesTable.availability,
      candidateStatus: candidatesTable.status,
      candidateBio: candidatesTable.bio,
      candidateLocation: candidatesTable.location,
      candidateCreatedAt: candidatesTable.createdAt,
    })
    .from(matchesTable)
    .leftJoin(candidatesTable, eq(matchesTable.candidateId, candidatesTable.id))
    .where(eq(matchesTable.contactId, contactId));

  res.json(
    matches.map((m) => ({
      id: m.id,
      contactId: m.contactId,
      candidateId: m.candidateId,
      score: m.score,
      status: m.status,
      notes: m.notes,
      createdAt: m.createdAt.toISOString(),
      candidate: {
        id: m.candidateId,
        name: m.candidateName ?? "",
        role: m.candidateRole ?? "",
        skills: m.candidateSkills ?? [],
        language: m.candidateLanguage ?? "",
        experienceYears: m.candidateExperience ?? 0,
        hourlyRate: m.candidateRate ?? 0,
        availability: m.candidateAvailability ?? "",
        status: m.candidateStatus ?? "",
        bio: m.candidateBio,
        location: m.candidateLocation,
        createdAt: m.candidateCreatedAt?.toISOString() ?? "",
      },
    }))
  );
});

router.post("/", async (req, res) => {
  const parsed = CreateMatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [match] = await db.insert(matchesTable).values(parsed.data).returning();
  res.status(201).json({ ...match, createdAt: match.createdAt.toISOString() });
});

export default router;
