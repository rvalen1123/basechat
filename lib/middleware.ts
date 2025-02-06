import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { APIError, ErrorCode, handleAPIError } from "./api-error";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export type ApiContext<T = undefined> = {
  params: Record<string, string | string[]>;
  data?: T;
};

export type ApiHandler<T = undefined> = (req: NextRequest, context: ApiContext<T>) => Promise<Response> | Response;

export function withErrorHandling<T>(handler: ApiHandler<T>): ApiHandler<T> {
  return async (req, context) => {
    try {
      const response = await handler(req, context);
      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        return Response.json(
          {
            status: "error",
            code: ErrorCode.BadRequest,
            message: "Validation error",
            data: { errors: error.errors },
          },
          { status: 400 },
        );
      }
      return handleAPIError(error);
    }
  };
}

export function withRateLimit<T>(handler: ApiHandler<T>): ApiHandler<T> {
  return async (req, context) => {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    // Clean up old rate limit entries
    for (const [key, value] of rateLimit.entries()) {
      if (value.timestamp < windowStart) {
        rateLimit.delete(key);
      }
    }

    // Check rate limit
    const currentLimit = rateLimit.get(ip);
    if (currentLimit) {
      if (currentLimit.timestamp < windowStart) {
        // Reset if window has passed
        rateLimit.set(ip, { count: 1, timestamp: now });
      } else if (currentLimit.count >= MAX_REQUESTS) {
        throw APIError.tooManyRequests("Rate limit exceeded");
      } else {
        // Increment counter
        currentLimit.count++;
      }
    } else {
      // First request in window
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    return handler(req, context);
  };
}

export function withValidation<T>(schema: { parse: (data: unknown) => T }) {
  return (handler: ApiHandler<T>): ApiHandler<T> => {
    return async (req, context) => {
      const contentType = req.headers.get("content-type");
      let body: unknown;

      if (contentType?.includes("application/json")) {
        body = await req.json();
      } else if (contentType?.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        body = Object.fromEntries(formData);
      } else {
        throw APIError.badRequest("Unsupported content type");
      }

      const data = schema.parse(body);
      const newContext: ApiContext<T> = {
        ...context,
        data: schema.parse(body),
      };
      return handler(req, newContext);
    };
  };
}

export function withMiddleware<T>(
  handler: ApiHandler<T>,
  options: {
    rateLimit?: boolean;
    validation?: { parse: (data: unknown) => T };
  } = {},
): ApiHandler<T> {
  let wrapped = withErrorHandling(handler);

  if (options.rateLimit) {
    wrapped = withRateLimit(wrapped);
  }

  if (options.validation) {
    wrapped = withValidation(options.validation)(wrapped as any);
  }

  return wrapped;
}
