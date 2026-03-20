import { describe, it, expect } from "vitest";
import {
  getRequestCount,
  getUnauthorizedRequest,
  getInvalidKeyRequest,
} from "./helpers.js";

describe("Authentication", () => {
  it("should return 200 with a valid API key", async () => {
    const res = await getRequestCount();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });

  it("should return 401 with no API key", async () => {
    const res = await getUnauthorizedRequest();
    expect(res.status).toBe(401);
  });

  it("should return 401 with an invalid API key", async () => {
    const res = await getInvalidKeyRequest();
    expect(res.status).toBe(401);
  });
});

describe("Usage Monitoring", () => {
  it("should return request count with expected shape", async () => {
    const res = await getRequestCount();
    expect(res.status).toBe(200);
    const data = res.data as Record<string, unknown>;
    expect(data).toHaveProperty("access_key");
    expect(data).toHaveProperty("current_date");
    expect(data).toHaveProperty("request_count");
    expect(typeof data.request_count).toBe("number");
  });
});
