import { APIError, ErrorCode, handleAPIError } from "@/lib/api-error";

describe("APIError", () => {
  describe("constructor", () => {
    it("should create an instance with the correct properties", () => {
      const error = new APIError(ErrorCode.BadRequest, "Invalid input", 400, { field: "username" });

      expect(error.code).toBe(ErrorCode.BadRequest);
      expect(error.message).toBe("Invalid input");
      expect(error.status).toBe(400);
      expect(error.data).toEqual({ field: "username" });
      expect(error.name).toBe("APIError");
    });
  });

  describe("static methods", () => {
    it("badRequest should create a 400 error", () => {
      const error = APIError.badRequest("Bad request");
      expect(error.status).toBe(400);
      expect(error.code).toBe(ErrorCode.BadRequest);
    });

    it("unauthorized should create a 401 error", () => {
      const error = APIError.unauthorized("Unauthorized");
      expect(error.status).toBe(401);
      expect(error.code).toBe(ErrorCode.Unauthorized);
    });

    it("forbidden should create a 403 error", () => {
      const error = APIError.forbidden("Forbidden");
      expect(error.status).toBe(403);
      expect(error.code).toBe(ErrorCode.Forbidden);
    });

    it("notFound should create a 404 error", () => {
      const error = APIError.notFound("Not found");
      expect(error.status).toBe(404);
      expect(error.code).toBe(ErrorCode.NotFound);
    });

    it("tooManyRequests should create a 429 error", () => {
      const error = APIError.tooManyRequests("Too many requests");
      expect(error.status).toBe(429);
      expect(error.code).toBe(ErrorCode.TooManyRequests);
    });

    it("internal should create a 500 error", () => {
      const error = APIError.internal("Internal error");
      expect(error.status).toBe(500);
      expect(error.code).toBe(ErrorCode.InternalError);
    });
  });

  describe("handleAPIError", () => {
    it("should handle APIError instances", () => {
      const error = APIError.badRequest("Invalid input", { field: "email" });
      const response = handleAPIError(error);

      expect(response.status).toBe(400);
      expect(response.headers.get("content-type")).toMatch(/application\/json/);
    });

    it("should handle regular Error instances", () => {
      const error = new Error("Something went wrong");
      const response = handleAPIError(error);

      expect(response.status).toBe(500);
      expect(response.headers.get("content-type")).toMatch(/application\/json/);
    });

    it("should handle unknown error types", () => {
      const response = handleAPIError("unexpected error");

      expect(response.status).toBe(500);
      expect(response.headers.get("content-type")).toMatch(/application\/json/);
    });
  });
});
