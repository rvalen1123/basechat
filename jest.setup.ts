import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
      getAll: jest.fn(),
    };
  },
  usePathname() {
    return "";
  },
}));

// Mock next-auth
jest.mock("next-auth", () => ({
  auth: jest.fn(() => Promise.resolve({ user: null })),
}));

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("Warning: ReactDOM.render is no longer supported")) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
