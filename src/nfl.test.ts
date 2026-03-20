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
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("livescores");
    expect(data.livescores).toHaveProperty("sport");
  });
});

describe("NFL — Live Plays", () => {
  it("should return live plays data", async () => {
    const res = await getNflLivePlays();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});

describe("NFL — Season Schedule", () => {
  it("should return season schedule", async () => {
    const res = await getNflSeasonSchedule();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});

describe("NFL — Standings", () => {
  it("should return standings with correct structure", async () => {
    const res = await getNflStandings();
    expect(res.status).toBe(200);
    const data = res.data as Record<string, any>;
    expect(data).toHaveProperty("standings");
  });
});

describe("NFL — Odds", () => {
  it("should return odds data", async () => {
    const res = await getNflOdds();
    expect(res.status).toBe(200);
    expect(res.ok).toBe(true);
  });
});
