"use client";

import { useState, useEffect } from "react";

interface NoteClientProps {
  noteId: string;
}

export function NoteClient({ noteId }: NoteClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    async function loadNote() {
      try {
        setLoading(true);
        // Here you would fetch the note data
        // const response = await fetch(`/api/notes/${noteId}`);
        // const data = await response.json();
        // setNote(data);
        setNote({ id: noteId, title: "Example Note", content: "Note content here..." });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load note");
      } finally {
        setLoading(false);
      }
    }

    loadNote();
  }, [noteId]);

  if (loading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  if (!note) {
    return <div className="text-gray-400">Note not found</div>;
  }

  return (
    <div className="rounded-lg border border-white/5 bg-gray-900/50 p-6">
      <h2 className="text-lg font-semibold text-white">{note.title}</h2>
      <div className="mt-4 text-gray-400">{note.content}</div>
    </div>
  );
}
