import { NextResponse } from "next/server";
import { z } from "zod";

import { createNote, getNotes } from "@/lib/data-access/notes";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().nullable(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = createNoteSchema.parse(json);

    const note = await createNote(body.title, body.content);
    return NextResponse.json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const notes = await getNotes();
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
