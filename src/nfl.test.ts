import { describe, it, expect, afterEach } from "vitest";
import { rateLimitDelay } from "./helpers.js";
import {
  getNflLivescores,
  getNflLivePlays,
  getNflSeasonSchedule,
  getNflStandings,
  getNflOdds,
} from "./helpers.js";

afterEach(() => rateLimitDelay());

describe("NFL — Live Scores", () => {
  it("should return livescores with correct structure", async () => {
    const res = await getNflLivescores();
    expect(res.status, `nfl/livescores: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `nfl/livescores: Expected "livescores" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("livescores");
    expect(
      data.livescores,
      `nfl/livescores: Expected "livescores.sport" property\n  Actual livescores keys: ${JSON.stringify(Object.keys(data.livescores || {}))}`,
    ).toHaveProperty("sport");
  });
});

describe("NFL — Live Plays", () => {
  it("should return live plays data", async () => {
    const res = await getNflLivePlays();
    expect(res.status, `nfl/live-plays: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `nfl/live-plays: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});

describe("NFL — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getNflSeasonSchedule();
    expect(res.status, `nfl/season-schedule: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `nfl/season-schedule: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});

describe("NFL — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getNflStandings();
    expect(res.status, `nfl/standings: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `nfl/standings: Expected "standings" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("standings");
  });
});

describe("NFL — Odds", () => {
  it("should return odds data", async () => {
    const res = await getNflOdds();
    expect(res.status, `nfl/odds: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `nfl/odds: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});
