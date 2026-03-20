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
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("livescores");
    expect(data.livescores).toHaveProperty("sport");
  });
});

describe("NHL — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getNhlSeasonSchedule();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});

describe("NHL — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getNhlStandings();
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("standings");
    expect(data.standings).toHaveProperty("sport");
    expect(data.standings).toHaveProperty("tournament");
  });
});

describe("NHL — Odds", () => {
  it("should return odds data", async () => {
    const res = await getNhlOdds();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});
