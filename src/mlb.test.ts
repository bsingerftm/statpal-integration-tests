import { describe, it, expect, afterEach } from "vitest";
import { rateLimitDelay } from "./helpers.js";
import {
  getMlbLivescores,
  getMlbSeasonSchedule,
  getMlbStandings,
  getMlbOdds,
} from "./helpers.js";

afterEach(() => rateLimitDelay());

describe("MLB — Live Scores", () => {
  it("should return livescores with correct structure", async () => {
    const res = await getMlbLivescores();
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("livescores");
    expect(data.livescores).toHaveProperty("sport");
  });
});

describe("MLB — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getMlbSeasonSchedule();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});

describe("MLB — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getMlbStandings();
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("standings");
  });
});

describe("MLB — Odds", () => {
  it("should return odds data", async () => {
    const res = await getMlbOdds();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});
