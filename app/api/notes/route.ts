import { NextRequest } from "next/server";
import { z } from "zod";

import { APIError } from "@/lib/api-error";
import { createNote, getNotes } from "@/lib/data-access/notes";
import { ApiContext, withMiddleware } from "@/lib/middleware";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().nullable(),
});

async function handlePost(req: NextRequest, context: ApiContext<z.infer<typeof createNoteSchema>>) {
  if (!context.data) {
    throw APIError.badRequest("Missing request data");
  }

  const note = await createNote(context.data.title, context.data.content);
  if (!note) {
    throw APIError.internal("Failed to create note");
  }

  return Response.json({
    status: "success",
    data: note,
  });
}

async function handleGet(req: NextRequest, context: ApiContext) {
  const notes = await getNotes();
  if (!notes) {
    throw APIError.internal("Failed to fetch notes");
  }

  return Response.json({
    status: "success",
    data: notes,
  });
}

export const POST = withMiddleware(handlePost, {
  rateLimit: true,
  validation: createNoteSchema,
});

export const GET = withMiddleware(handleGet, {
  rateLimit: true,
});
