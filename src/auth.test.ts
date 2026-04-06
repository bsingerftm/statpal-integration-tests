import { describe, it, expect } from "vitest";
import {
  getRequestCount,
  getUnauthorizedRequest,
  getInvalidKeyRequest,
} from "./helpers.js";

describe("Authentication", () => {
  it("should return 200 with a valid API key", async () => {
    const res = await getRequestCount();
    expect(res.status, `auth (valid key): Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `auth (valid key): Expected ok=true, got ${res.ok}`).toBe(true);
  });

  it("should return 401 with no API key", async () => {
    const res = await getUnauthorizedRequest();
    expect(
      res.status,
      `auth (no key): Expected status 401, got ${res.status}\n  Response: ${JSON.stringify(res.data)}`,
    ).toBe(401);
  });

  it("should return 401 with an invalid API key", async () => {
    const res = await getInvalidKeyRequest();
    expect(
      res.status,
      `auth (invalid key): Expected status 401, got ${res.status}\n  Response: ${JSON.stringify(res.data)}`,
    ).toBe(401);
  });
});

describe("Usage Monitoring", () => {
  it("should return request count with expected shape", async () => {
    const res = await getRequestCount();
    expect(res.status, `user-request-count: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, unknown>;
    expect(
      data,
      `user-request-count: Expected "access_key" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("access_key");
    expect(
      data,
      `user-request-count: Expected "current_date" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("current_date");
    expect(
      data,
      `user-request-count: Expected "request_count" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("request_count");
    expect(
      typeof data.request_count,
      `user-request-count: Expected "request_count" to be number, got ${typeof data.request_count}\n  Actual value: ${JSON.stringify(data.request_count)}`,
    ).toBe("number");
  });
});
