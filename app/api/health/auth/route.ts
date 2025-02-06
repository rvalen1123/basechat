import { NextResponse } from "next/server";

import { AUTH_SECRET } from "@/lib/settings";

export async function GET() {
  try {
    // Check if auth secret is configured
    if (!AUTH_SECRET) {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Auth secret is not configured",
          checks: {
            configuration: false,
          },
        },
        { status: 503 },
      );
    }

    // Verify auth secret meets minimum requirements
    if (AUTH_SECRET.length < 32) {
      return NextResponse.json(
        {
          status: "unhealthy",
          message: "Auth secret does not meet minimum length requirement",
          checks: {
            configuration: false,
            secretStrength: false,
          },
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        status: "healthy",
        message: "Auth configuration is valid",
        checks: {
          configuration: true,
          secretStrength: true,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        message: "Auth health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
        checks: {
          configuration: false,
        },
      },
      { status: 503 },
    );
  }
}
