export async function streamResponse(response: string) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            controller.enqueue(encoder.encode(response));
            controller.close();
        },
    });

    return stream;
}

export function parseStreamedResponse(chunk: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(chunk);
}
