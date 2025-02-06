export enum ErrorCode {
  BadRequest = "BAD_REQUEST",
  Unauthorized = "UNAUTHORIZED",
  Forbidden = "FORBIDDEN",
  NotFound = "NOT_FOUND",
  TooManyRequests = "TOO_MANY_REQUESTS",
  InternalError = "INTERNAL_ERROR",
}

export class APIError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly status: number = 500,
    public readonly data: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "APIError";
  }

  static badRequest(message: string, data?: Record<string, unknown>) {
    return new APIError(ErrorCode.BadRequest, message, 400, data);
  }

  static unauthorized(message: string, data?: Record<string, unknown>) {
    return new APIError(ErrorCode.Unauthorized, message, 401, data);
  }

  static forbidden(message: string, data?: Record<string, unknown>) {
    return new APIError(ErrorCode.Forbidden, message, 403, data);
  }

  static notFound(message: string, data?: Record<string, unknown>) {
    return new APIError(ErrorCode.NotFound, message, 404, data);
  }

  static tooManyRequests(message: string, data?: Record<string, unknown>) {
    return new APIError(ErrorCode.TooManyRequests, message, 429, data);
  }

  static internal(message: string, data?: Record<string, unknown>) {
    return new APIError(ErrorCode.InternalError, message, 500, data);
  }
}

export function handleAPIError(error: unknown): Response {
  console.error("[API Error]", error);

  if (error instanceof APIError) {
    return Response.json(
      {
        status: "error",
        code: error.code,
        message: error.message,
        data: error.data,
      },
      { status: error.status },
    );
  }

  if (error instanceof Error) {
    return Response.json(
      {
        status: "error",
        code: ErrorCode.InternalError,
        message: "An unexpected error occurred",
        data: { originalError: error.message },
      },
      { status: 500 },
    );
  }

  return Response.json(
    {
      status: "error",
      code: ErrorCode.InternalError,
      message: "An unexpected error occurred",
    },
    { status: 500 },
  );
}
