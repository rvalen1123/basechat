"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => Promise<void>;
  autoFocus?: boolean;
}

export function NoteEditor({ initialTitle = "", initialContent = "", onSave, autoFocus }: NoteEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout>();

  const debouncedSave = useCallback(
    async (newTitle: string, newContent: string) => {
      if (!onSave) return;
      setIsSaving(true);
      try {
        await onSave(newTitle, newContent);
      } catch (error) {
        console.error("Failed to save note:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [onSave],
  );

  useEffect(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      debouncedSave(title, content);
    }, 1000);

    setSaveTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [title, content, debouncedSave, saveTimeout]);

  return (
    <div className="relative min-h-screen bg-gray-900">
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
        <div className="flex flex-1 gap-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="block w-full border-0 bg-transparent py-1.5 text-white focus:ring-0 sm:text-sm sm:leading-6"
              autoFocus={autoFocus}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {isSaving ? (
            <span className="text-sm text-gray-400">Saving...</span>
          ) : (
            <span className="text-sm text-gray-400">All changes saved</span>
          )}
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <AutosizeTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="block w-full resize-none border-0 bg-transparent py-1.5 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          minHeight={400}
        />
      </div>
    </div>
  );
}
