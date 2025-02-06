import { streamResponse } from "./chat-utils";

export async function handleMessage(message: string) {
    return streamResponse("This feature is coming soon. Your message: " + message);
}
