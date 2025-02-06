import { requireAuthContext } from "@/lib/server-utils";
import { deleteConnection } from "@/lib/service";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { tenant } = await requireAuthContext();

  if (!tenant?.id) {
    throw new Error("Missing required tenant data");
  }

  await deleteConnection(tenant.id, params.id);
  return Response.json({}, { status: 200 });
}
