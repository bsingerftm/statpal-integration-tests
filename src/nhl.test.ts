import { describe, it, expect, afterEach } from "vitest";
import { rateLimitDelay } from "./helpers.js";
import {
  getNhlLivescores,
  getNhlSeasonSchedule,
  getNhlStandings,
  getNhlOdds,
} from "./helpers.js";

afterEach(() => rateLimitDelay());

describe("NHL — Live Scores", () => {
  it("should return livescores with correct structure", async () => {
    const res = await getNhlLivescores();
    expect(res.status, `nhl/livescores: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `nhl/livescores: Expected "livescores" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("livescores");
    expect(
      data.livescores,
      `nhl/livescores: Expected "livescores.sport" property\n  Actual livescores keys: ${JSON.stringify(Object.keys(data.livescores || {}))}`,
    ).toHaveProperty("sport");
  });
});

describe("NHL — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getNhlSeasonSchedule();
    expect(res.status, `nhl/season-schedule: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `nhl/season-schedule: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});

describe("NHL — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getNhlStandings();
    expect(res.status, `nhl/standings: Expected status 200, got ${res.status}`).toBe(200);
    const data = res.data as Record<string, any>;
    expect(
      data,
      `nhl/standings: Expected "standings" property\n  Actual keys: ${JSON.stringify(Object.keys(data))}`,
    ).toHaveProperty("standings");
    expect(
      data.standings,
      `nhl/standings: Expected "standings.sport" property\n  Actual standings keys: ${JSON.stringify(Object.keys(data.standings || {}))}`,
    ).toHaveProperty("sport");
    expect(
      data.standings,
      `nhl/standings: Expected "standings.tournament" property\n  Actual standings keys: ${JSON.stringify(Object.keys(data.standings || {}))}`,
    ).toHaveProperty("tournament");
  });
});

describe("NHL — Odds", () => {
  it("should return odds data", async () => {
    const res = await getNhlOdds();
    expect(res.status, `nhl/odds: Expected status 200, got ${res.status}`).toBe(200);
    expect(res.ok, `nhl/odds: Expected ok=true, got ${res.ok}`).toBe(true);
  });
});
