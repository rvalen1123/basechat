import { AppLocation } from "@/app/(main)/footer";
import Main from "@/app/(main)/main";
import { authOrRedirect } from "@/lib/server-utils";

import Conversation from "./conversation";

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const { session, tenant } = await authOrRedirect();

  if (!session?.user?.name || !tenant?.id || !tenant?.name) {
    throw new Error("Missing required auth data");
  }

  return (
    <Main currentTenantId={tenant.id} name={session.user.name} appLocation={AppLocation.CHAT}>
      <Conversation tenantName={tenant.name} id={params.id} />
    </Main>
  );
}
