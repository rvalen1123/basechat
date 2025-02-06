// Mock web API objects that aren't available in the test environment
class MockResponse {
  public ok: boolean;
  public status: number;
  public headers: Record<string, string>;
  private body: any;

  constructor(body?: any, init?: ResponseInit) {
    this.status = init?.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = {};
    this.body = body;

    if (init?.headers) {
      const headers = init.headers as Record<string, string>;
      Object.entries(headers).forEach(([key, value]) => {
        this.headers[key.toLowerCase()] = value;
      });
    }
  }

  async json() {
    return this.body ? JSON.parse(JSON.stringify(this.body)) : undefined;
  }

  async text() {
    return this.body ? JSON.stringify(this.body) : "";
  }

  static json(data: any, init?: ResponseInit) {
    return new MockResponse(data, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers || {}),
      },
    });
  }
}

class MockRequest {
  public url: string;
  public method: string;
  public headers: Record<string, string>;
  public body: any;

  constructor(input: string | URL, init?: RequestInit) {
    this.url = input.toString();
    this.method = init?.method || "GET";
    this.headers = {};
    this.body = init?.body;

    if (init?.headers) {
      const headers = init.headers as Record<string, string>;
      Object.entries(headers).forEach(([key, value]) => {
        this.headers[key.toLowerCase()] = value;
      });
    }
  }

  async json() {
    return this.body ? JSON.parse(this.body) : undefined;
  }
}

// Simple mock implementations
const mockFormData = () => {
  const data = new Map<string, string[]>();

  return {
    append: (name: string, value: string) => {
      const values = data.get(name) || [];
      values.push(value);
      data.set(name, values);
    },
    get: (name: string) => {
      const values = data.get(name);
      return values?.[0] || null;
    },
    getAll: (name: string) => data.get(name) || [],
    has: (name: string) => data.has(name),
    delete: (name: string) => data.delete(name),
    set: (name: string, value: string) => {
      data.set(name, [value]);
    },
    entries: () => data.entries(),
  };
};

const mockHeaders = () => {
  const headers = new Map<string, string>();

  return {
    append: (name: string, value: string) => {
      const key = name.toLowerCase();
      const existing = headers.get(key);
      headers.set(key, existing ? `${existing}, ${value}` : value);
    },
    get: (name: string) => headers.get(name.toLowerCase()) || null,
    has: (name: string) => headers.has(name.toLowerCase()),
    set: (name: string, value: string) => headers.set(name.toLowerCase(), value),
    delete: (name: string) => headers.delete(name.toLowerCase()),
    forEach: (callback: (value: string, key: string) => void) => {
      headers.forEach((value, key) => callback(value, key));
    },
  };
};

// Add mocks to global scope
(global as any).Response = MockResponse;
(global as any).Request = MockRequest;
(global as any).FormData = mockFormData;
(global as any).Headers = mockHeaders;
