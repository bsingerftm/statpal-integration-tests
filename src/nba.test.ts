import { describe, it, expect, afterEach } from "vitest";
import { rateLimitDelay } from "./helpers.js";
import {
  getNbaLivescores,
  getNbaSeasonSchedule,
  getNbaStandings,
  getNbaOdds,
} from "./helpers.js";

afterEach(() => rateLimitDelay());

describe("NBA — Live Scores", () => {
  it("should return livescores with correct structure", async () => {
    const res = await getNbaLivescores();
    expect(res.status, `nba/livescores: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `nba/livescores: Expected "livescores" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("livescores");
    expect(
      data.livescores,
      `nba/livescores: Expected "livescores.sport" property\n  Actual livescores keys: ${JSON.stringify(Object.keys(data.livescores || {}))}`,
    ).toHaveProperty("sport");
  });
});

describe("NBA — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getNbaSeasonSchedule();
    expect(res.status, `nba/season-schedule: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `nba/season-schedule: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});

describe("NBA — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getNbaStandings();
    expect(res.status, `nba/standings: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `nba/standings: Expected "standings" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("standings");
  });
});

describe("NBA — Odds", () => {
  it("should return odds data", async () => {
    const res = await getNbaOdds();
    expect(res.status, `nba/odds: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `nba/odds: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});
