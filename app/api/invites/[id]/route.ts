import { NextRequest } from "next/server";

import { requireAuthContext } from "@/lib/server-utils";
import { deleteInviteById } from "@/lib/service";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const { tenant } = await requireAuthContext();

  if (!tenant?.id) {
    throw new Error("Missing required tenant data");
  }

  await deleteInviteById(tenant.id, params.id);
  return new Response(null, { status: 200 });
}
