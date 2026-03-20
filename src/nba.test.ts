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
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("livescores");
    expect(data.livescores).toHaveProperty("sport");
  });
});

describe("NBA — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getNbaSeasonSchedule();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});

describe("NBA — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getNbaStandings();
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("standings");
  });
});

describe("NBA — Odds", () => {
  it("should return odds data", async () => {
    const res = await getNbaOdds();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});
