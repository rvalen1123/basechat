import { NextResponse } from "next/server";

interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  message?: string;
  error?: string;
  checks?: Record<string, boolean>;
}

async function fetchHealthCheck(endpoint: string): Promise<HealthCheckResponse> {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/health/${endpoint}`);
    return await response.json();
  } catch (error) {
    return {
      status: "unhealthy",
      message: `Failed to check ${endpoint} health`,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const [dbHealth, authHealth] = await Promise.all([fetchHealthCheck("db"), fetchHealthCheck("auth")]);

  const systemHealth = {
    status: dbHealth.status === "healthy" && authHealth.status === "healthy" ? "healthy" : "unhealthy",
    message: "System health check completed",
    components: {
      database: {
        status: dbHealth.status,
        message: dbHealth.message,
        error: dbHealth.error,
        checks: dbHealth.checks,
      },
      auth: {
        status: authHealth.status,
        message: authHealth.message,
        error: authHealth.error,
        checks: authHealth.checks,
      },
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(systemHealth, {
    status: systemHealth.status === "healthy" ? 200 : 503,
  });
}
