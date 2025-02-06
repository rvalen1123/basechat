"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { NoteEditor } from "../components/note-editor";

interface Note {
  id: string;
  title: string;
  content: string | null;
}

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNote() {
      try {
        const response = await fetch(`/api/notes/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to load note");
        }
        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error("Error loading note:", error);
        toast.error("Failed to load note");
        router.push("/notes");
      } finally {
        setIsLoading(false);
      }
    }

    loadNote();
  }, [params.id, router]);

  const handleSave = async (title: string, content: string) => {
    try {
      const response = await fetch(`/api/notes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const updatedNote = await response.json();
      setNote(updatedNote);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return <NoteEditor initialTitle={note.title} initialContent={note.content || ""} onSave={handleSave} />;
}
