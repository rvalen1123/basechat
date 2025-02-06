"use client";

import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  profileId: string;
}

interface NoteClientProps {
  noteId: string;
  initialData: Note;
}

export function NoteClient({ noteId, initialData }: NoteClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<Note>(initialData);
  const [optimisticNote, setOptimisticNote] = useState<Note>(initialData);

  async function updateNote(updates: Partial<Note>) {
    try {
      // Optimistically update the UI
      const updatedOptimisticNote = {
        ...optimisticNote,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setOptimisticNote(updatedOptimisticNote);
      setLoading(true);

      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();
      setNote(updatedNote);
      setOptimisticNote(updatedNote);
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticNote(note);
      setError(err instanceof Error ? err.message : "Failed to update note");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>;
  }

  // Use optimisticNote for rendering to show immediate updates
  return (
    <div className="rounded-lg border border-white/5 bg-gray-900/50 p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">{optimisticNote.title}</h2>
        <div className="text-gray-400">{optimisticNote.content}</div>
        <div className="text-sm text-gray-500">Last updated: {new Date(optimisticNote.updatedAt).toLocaleString()}</div>
      </div>
      {loading && <div className="mt-4 text-sm text-gray-400">Saving changes...</div>}
    </div>
  );
}
