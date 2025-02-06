import { NoteClient } from "@/app/(main)/notes/[id]/note-client";
import { authOrRedirect } from "@/lib/server-utils";

import Main from "../../layout";
import { AppLocation } from "../../types";

/**
 * NOTE:
 * 1. This file is a server component because we declare the function as async.
 * 2. We use the same pattern as the 'ConversationPage' example, making
 *    'params' a Promise type so Next.js 15.1.x won't complain.
 * 3. Usually, for client rendering (useEffect, useState), place
 *    that logic in a separate 'NoteClient' file marked "use client."
 */

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  // Get auth data and assert it exists
  const { session, tenant } = await authOrRedirect();

  if (!session?.user?.name || !tenant?.id) {
    throw new Error("Missing required auth data");
  }

  // Retrieve the route param "id":
  const { id } = await params;

  // Here you can fetch data from a DB, for example:
  // const note = await fetchNoteById(id); // Pseudocode

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
            <NoteClient noteId={id} />
          </div>
        </div>
      </div>
    </Main>
  );
}
