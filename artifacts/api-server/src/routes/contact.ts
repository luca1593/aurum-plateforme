import { Router } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";
import { count, gte, desc } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, company, email, need } = parsed.data;

  const [contact] = await db
    .insert(contactsTable)
    .values({ name, company, email, need })
    .returning({ id: contactsTable.id });

  res.status(201).json({ id: contact.id, message: "Your request has been received. We will contact you shortly." });
});

router.get("/stats", async (_req, res) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalResult] = await db.select({ count: count() }).from(contactsTable);
  const [weekResult] = await db.select({ count: count() }).from(contactsTable).where(gte(contactsTable.createdAt, startOfWeek));
  const [monthResult] = await db.select({ count: count() }).from(contactsTable).where(gte(contactsTable.createdAt, startOfMonth));

  res.json({
    totalLeads: totalResult.count,
    thisWeek: weekResult.count,
    thisMonth: monthResult.count,
  });
});

router.get("/list", async (_req, res) => {
  const contacts = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  res.json(contacts.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })));
});

export default router;
