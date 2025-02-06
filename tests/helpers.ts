import { render as rtlRender } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement } from "react";

// Helper to create a mock Response object
export function createMockResponse(data: any, status = 200): Response {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
  return response;
}

// Helper to create a mock Request object
export function createMockRequest(method = "GET", body?: any, headers = {}): Request {
  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  return new Request("http://localhost:3000/api/test", init);
}

// Helper to render components with common providers if needed
export function render(ui: ReactElement, options = {}) {
  return {
    ...rtlRender(ui, { ...options }),
    user: userEvent.setup(),
  };
}

// Helper to wait for a condition
export function waitFor(condition: () => boolean | Promise<boolean>, timeout = 5000): Promise<void> {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = async () => {
      if (await condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for condition"));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

// Helper to mock the auth context
type TestUser = {
  id: string;
  [key: string]: any;
};

export function mockAuthContext(user: TestUser | null = null) {
  return {
    profile: user ? { id: "test-profile-id", name: "Test User" } : null,
    tenant: user ? { id: "test-tenant-id", name: "Test Tenant" } : null,
    session: user ? { user: { ...user } } : null,
  };
}

// Helper to create test IDs
export function createTestId(componentName: string, elementName: string): string {
  return `${componentName}-${elementName}`;
}

// Helper to mock the fetch function
export function mockFetch(response: any, status = 200) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
    }),
  );
}
