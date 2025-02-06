import { notFound } from "next/navigation";

import { getNote } from "@/lib/data-access/notes";
import { authOrRedirect } from "@/lib/server-utils";

import Main from "../../layout";
import { AppLocation } from "../../types";

import { NoteClient } from "./note-client";

export default async function NotePage({ params }: { params: { id: string } }) {
  // Get auth data and assert it exists
  const { session, tenant } = await authOrRedirect();

  if (!session?.user?.name || !tenant?.id) {
    throw new Error("Missing required auth data");
  }

  // Fetch note data
  const note = await getNote(params.id);

  if (!note) {
    notFound();
  }

  return (
    <Main currentTenantId={tenant.id} name={session.user.name} appLocation={AppLocation.NOTES}>
      <div className="py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base/7 font-semibold text-white">Note Details</h1>
              <p className="mt-2 text-sm text-gray-400">View and edit note information.</p>
            </div>
          </div>
          <div className="mt-8">
            <NoteClient noteId={note.id} initialData={note} />
          </div>
        </div>
      </div>
    </Main>
  );
}
