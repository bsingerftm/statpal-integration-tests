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
    expect(res.status, `mlb/livescores: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `mlb/livescores: Expected "livescores" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("livescores");
    expect(
      data.livescores,
      `mlb/livescores: Expected "livescores.sport" property\n  Actual livescores keys: ${JSON.stringify(Object.keys(data.livescores || {}))}`,
    ).toHaveProperty("sport");
  });
});

describe("MLB — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getMlbSeasonSchedule();
    expect(res.status, `mlb/season-schedule: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `mlb/season-schedule: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});

describe("MLB — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getMlbStandings();
    expect(res.status, `mlb/standings: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `mlb/standings: Expected "standings" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("standings");
  });
});

describe("MLB — Odds", () => {
  it("should return odds data", async () => {
    const res = await getMlbOdds();
    expect(res.status, `mlb/odds: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `mlb/odds: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});
