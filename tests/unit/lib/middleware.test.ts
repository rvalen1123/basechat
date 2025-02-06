import { NextRequest } from "next/server";
import { z } from "zod";

import { APIError } from "@/lib/api-error";
import { ApiContext, ApiHandler, withMiddleware } from "@/lib/middleware";

import { createMockRequest } from "../../helpers";

describe("API Middleware", () => {
  describe("Error Handling", () => {
    it("should handle APIError correctly", async () => {
      const handler = () => {
        throw APIError.badRequest("Invalid input");
      };

      const wrappedHandler = withMiddleware(handler);
      const req = createMockRequest("GET");
      const response = await wrappedHandler(req as NextRequest, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe("BAD_REQUEST");
      expect(data.message).toBe("Invalid input");
    });

    it("should handle validation errors", async () => {
      const schema = z.object({
        name: z.string().min(3),
      });

      const handler: ApiHandler<z.infer<typeof schema>> = (
        req: NextRequest,
        context: ApiContext<z.infer<typeof schema>>,
      ) => {
        return Response.json({ success: true });
      };

      const wrappedHandler = withMiddleware(handler, {
        validation: schema,
      });

      const req = createMockRequest("POST", { name: "ab" });
      const response = await wrappedHandler(req as NextRequest, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe("BAD_REQUEST");
      expect(data.message).toBe("Validation error");
    });
  });

  describe("Rate Limiting", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should enforce rate limits", async () => {
      const handler = () => Response.json({ success: true });
      const wrappedHandler = withMiddleware(handler, { rateLimit: true });

      const req = createMockRequest("GET", undefined, {
        "x-forwarded-for": "127.0.0.1",
      });

      // Make 100 requests (the limit)
      for (let i = 0; i < 100; i++) {
        const response = await wrappedHandler(req as NextRequest, { params: {} });
        expect(response.status).toBe(200);
      }

      // The 101st request should fail
      const response = await wrappedHandler(req as NextRequest, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.code).toBe("TOO_MANY_REQUESTS");
    });

    it("should reset rate limits after window expires", async () => {
      const handler = () => Response.json({ success: true });
      const wrappedHandler = withMiddleware(handler, { rateLimit: true });

      const req = createMockRequest("GET", undefined, {
        "x-forwarded-for": "127.0.0.1",
      });

      // Make 100 requests
      for (let i = 0; i < 100; i++) {
        await wrappedHandler(req as NextRequest, { params: {} });
      }

      // Advance time by 1 minute (rate limit window)
      jest.advanceTimersByTime(60 * 1000);

      // Should be able to make requests again
      const response = await wrappedHandler(req as NextRequest, { params: {} });
      expect(response.status).toBe(200);
    });
  });

  describe("Validation", () => {
    it("should pass valid data to handler", async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const handler = jest.fn((req: NextRequest, context: ApiContext<z.infer<typeof schema>>) => {
        return Response.json({ received: context.data });
      });

      const wrappedHandler = withMiddleware(handler, {
        validation: schema,
      });

      const payload = { name: "Test", age: 25 };
      const req = createMockRequest("POST", payload);
      const response = await wrappedHandler(req as NextRequest, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.received).toEqual(payload);
      expect(handler).toHaveBeenCalledWith(
        expect.any(Request),
        expect.objectContaining({
          data: payload,
        }),
      );
    });

    it("should handle invalid content type", async () => {
      const schema = z.object({
        name: z.string(),
      });

      const handler = jest.fn();
      const wrappedHandler = withMiddleware(handler, {
        validation: schema,
      });

      const req = createMockRequest("POST", undefined, {
        "Content-Type": "text/plain",
      });

      const response = await wrappedHandler(req as NextRequest, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe("BAD_REQUEST");
      expect(data.message).toBe("Unsupported content type");
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
