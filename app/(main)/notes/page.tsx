"use client";

import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string | null;
  updatedAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("/api/notes");
        if (!response.ok) {
          throw new Error("Failed to load notes");
        }
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error loading notes:", error);
        toast.error("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }
  return (
    <div className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base/7 font-semibold text-white">Meeting Notes</h1>
            <p className="mt-2 text-sm text-gray-400">Keep track of your meeting notes and important discussions.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/notes/new"
              className="flex items-center gap-x-2 rounded-md bg-primary px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <PlusIcon className="size-5" aria-hidden="true" />
              New Note
            </Link>
          </div>
        </div>

        {notes.length > 0 ? (
          <div className="mt-8 flow-root">
            <ul role="list" className="-mx-4 -my-5 divide-y divide-white/5 sm:-mx-6">
              {notes.map((note) => (
                <li key={note.id} className="px-4 py-5 hover:bg-white/[0.02] sm:px-6">
                  <div className="flex items-center justify-between gap-x-4">
                    <div className="min-w-0">
                      <div className="flex items-start gap-x-3">
                        <p className="text-sm/6 font-semibold leading-6 text-white">{note.title}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-400">
                        <p className="truncate">{note.content || "No content"}</p>
                        <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                          <circle cx={1} cy={1} r={1} />
                        </svg>
                        <p className="whitespace-nowrap">Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-x-4">
                      <a
                        href={`/notes/${note.id}`}
                        className="flex items-center gap-x-1 rounded-md px-2 py-1 text-xs/5 font-medium text-white ring-1 ring-inset ring-white/10 hover:bg-white/5"
                      >
                        <PencilSquareIcon className="size-4" aria-hidden="true" />
                        Edit<span className="sr-only">, {note.title}</span>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-8 flow-root">
            <div className="rounded-lg border border-white/5 bg-gray-900/50 px-6 py-14 text-center">
              <PencilSquareIcon className="mx-auto size-12 text-gray-500" />
              <h3 className="mt-4 text-sm font-semibold text-white">No notes</h3>
              <p className="mt-2 text-sm text-gray-400">Create a new note to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
