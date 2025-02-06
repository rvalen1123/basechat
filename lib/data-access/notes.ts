import { and, desc, eq } from "drizzle-orm";

import db from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { requireAuthContext } from "@/lib/server-utils";

async function getCurrentProfile() {
  const { profile } = await requireAuthContext();
  return profile;
}

export async function createNote(title: string, content: string | null) {
  const profile = await getCurrentProfile();

  const [note] = await db
    .insert(notes)
    .values({
      title,
      content,
      profileId: profile.id,
      tenantId: profile.tenantId,
    })
    .returning();

  return note;
}

export async function updateNote(id: string, title: string, content: string | null) {
  const profile = await getCurrentProfile();

  const [note] = await db
    .update(notes)
    .set({
      title,
      content,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(notes.id, id), eq(notes.profileId, profile.id), eq(notes.tenantId, profile.tenantId)))
    .returning();

  return note;
}

export async function getNote(id: string) {
  const profile = await getCurrentProfile();

  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.profileId, profile.id), eq(notes.tenantId, profile.tenantId)));

  return note;
}

export async function getNotes() {
  const profile = await getCurrentProfile();

  return db
    .select()
    .from(notes)
    .where(and(eq(notes.profileId, profile.id), eq(notes.tenantId, profile.tenantId)))
    .orderBy(desc(notes.updatedAt));
}

export async function deleteNote(id: string) {
  const profile = await getCurrentProfile();

  const [note] = await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.profileId, profile.id), eq(notes.tenantId, profile.tenantId)))
    .returning();

  return note;
}
