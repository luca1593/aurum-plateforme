import { Router } from "express";
import { db, contactsTable, pipelineLeadsTable, matchesTable, candidatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const STATUS_MESSAGES: Record<string, string> = {
  new: "Your request has been received. Our team will reach out within 24 hours.",
  contacted: "Our team has reviewed your request and will be in touch shortly.",
  qualified: "Your needs have been assessed. We are now identifying the best talent for you.",
  proposal: "We have identified candidates that match your requirements. A proposal is on its way.",
  negotiation: "We are finalizing the terms of engagement with your selected profiles.",
  closed_won: "Congratulations! Your engagement is confirmed. Welcome to Aurum.",
  closed_lost: "Thank you for considering Aurum. We hope to work with you in the future.",
};

router.get("/:contactId", async (req, res) => {
  const contactId = parseInt(req.params.contactId);
  if (isNaN(contactId)) {
    res.status(400).json({ error: "Invalid contactId" });
    return;
  }

  const [contact] = await db.select().from(contactsTable).where(eq(contactsTable.id, contactId));
  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  const [pipelineLead] = await db
    .select()
    .from(pipelineLeadsTable)
    .where(eq(pipelineLeadsTable.contactId, contactId))
    .limit(1);

  const stage = pipelineLead?.stage ?? "new";

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

  res.json({
    contact: { ...contact, createdAt: contact.createdAt.toISOString() },
    pipelineStage: stage,
    statusMessage: STATUS_MESSAGES[stage] ?? STATUS_MESSAGES["new"],
    matches: matches.map((m) => ({
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
    })),
  });
});

export default router;
