import { NextResponse } from "next/server";
import { z } from "zod";

import { deleteNote, getNote, updateNote } from "@/lib/data-access/notes";

const updateNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().nullable(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const note = await getNote(params.id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const json = await request.json();
    const body = updateNoteSchema.parse(json);

    const note = await updateNote(params.id, body.title, body.content);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const note = await deleteNote(params.id);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
