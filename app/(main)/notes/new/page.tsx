"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { NoteEditor } from "../components/note-editor";

export default function NewNotePage() {
  const router = useRouter();

  const handleSave = async (title: string, content: string) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const data = await response.json();
      router.push(`/notes/${data.id}`);
      toast.success("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  return <NoteEditor onSave={handleSave} autoFocus />;
}
