import { describe, it, expect, afterEach } from "vitest";
import {
  rateLimitDelay,
  isValidDate,
  extractDateFields,
  dateMatchesOffset,
  dateWithinDaysOfToday,
  parseDDMMYYYY,
  expectedDateForOffset,
  getNhlLivescores,
  getNhlDaily,
  getNhlOdds,
  getNflLivescores,
  getNflOdds,
  getMlbLivescores,
  getMlbDaily,
  getMlbOdds,
  getNbaLivescores,
  getNbaDaily,
  getNbaOdds,
} from "./helpers.js";

afterEach(() => rateLimitDelay());

/** Format a Date as DD.MM.YYYY for display */
function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

/** Get today's date formatted as DD.MM.YYYY */
function getTodayFormatted(): string {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return formatDateDDMMYYYY(today);
}

/** Calculate days difference between a DD.MM.YYYY date string and today */
function getDaysDifferenceFromToday(dateStr: string): number {
  const parsed = parseDDMMYYYY(dateStr);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const diffMs = parsed.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Asserts all dates are valid calendar dates.
 */
function assertAllDatesValid(data: unknown, label: string) {
  const dates = extractDateFields(data);
  if (dates.length === 0) return;
  for (const d of dates) {
    const valid = isValidDate(d);
    expect(
      valid,
      `${label}: invalid date found
  Actual value: "${d}"
  Expected format: DD.MM.YYYY (valid calendar date)
  Reason: ${/^\d{2}\.\d{2}\.\d{4}$/.test(d) ? "Format matches but date is not a valid calendar date" : `Format does not match DD.MM.YYYY pattern`}`,
    ).toBe(true);
  }
}

/**
 * Asserts all match dates in a daily response are near the expected offset day.
 * Allows +-1 day tolerance to account for timezone differences between the API and UTC.
 * offset: numeric day offset (e.g. 1 for d1, -1 for d-1).
 */
function assertDatesNearOffset(data: unknown, offset: number, label: string) {
  const dates = extractDateFields(data);
  if (dates.length === 0) return;
  const expectedDate = expectedDateForOffset(offset);
  const expectedFormatted = formatDateDDMMYYYY(expectedDate);
  const todayFormatted = getTodayFormatted();

  for (const d of dates) {
    const valid = isValidDate(d);
    expect(
      valid,
      `${label}: invalid date found
  Actual value: "${d}"
  Expected format: DD.MM.YYYY (valid calendar date)`,
    ).toBe(true);

    const matchesExact = dateMatchesOffset(d, offset);
    const matchesMinus1 = dateMatchesOffset(d, offset - 1);
    const matchesPlus1 = dateMatchesOffset(d, offset + 1);
    const actualDiff = getDaysDifferenceFromToday(d);

    expect(
      matchesExact || matchesMinus1 || matchesPlus1,
      `${label}: date outside expected range
  Actual value: "${d}" (${actualDiff > 0 ? "+" : ""}${actualDiff} days from today)
  Expected: "${expectedFormatted}" (${offset > 0 ? "+" : ""}${offset} days from today, ±1 day tolerance)
  Today: "${todayFormatted}"
  Difference from expected: ${Math.abs(actualDiff - offset)} days`,
    ).toBe(true);
  }
}

/**
 * Asserts all match dates in an odds response are within a reasonable window (14 days of today).
 * Odds can include upcoming matches so we allow a wider range.
 */
function assertDatesWithinRange(data: unknown, days: number, label: string) {
  const dates = extractDateFields(data);
  if (dates.length === 0) return;
  const todayFormatted = getTodayFormatted();

  for (const d of dates) {
    const valid = isValidDate(d);
    expect(
      valid,
      `${label}: invalid date found
  Actual value: "${d}"
  Expected format: DD.MM.YYYY (valid calendar date)`,
    ).toBe(true);

    const withinRange = dateWithinDaysOfToday(d, days);
    const actualDiff = getDaysDifferenceFromToday(d);

    expect(
      withinRange,
      `${label}: date outside allowed range
  Actual value: "${d}" (${actualDiff > 0 ? "+" : ""}${actualDiff} days from today)
  Expected: within ±${days} days of today
  Today: "${todayFormatted}"
  Exceeds range by: ${Math.abs(actualDiff) - days} days`,
    ).toBe(true);
  }
}

// --- NHL ---

describe("Date Validation — NHL Livescores", () => {
  it("should have valid dates in livescores", async () => {
    const res = await getNhlLivescores();
    expect(res.status).toBe(200);
    assertAllDatesValid(res.data, "nhl/livescores");
  });
});

describe("Date Validation — NHL Daily", () => {
  it("d1 matches should be for tomorrow", async () => {
    const res = await getNhlDaily("d1");
    expect(res.status).toBe(200);
    assertDatesNearOffset(res.data, 1, "nhl/daily/d1");
  });

  it("d-1 matches should be for yesterday", async () => {
    const res = await getNhlDaily("d-1");
    expect(res.status).toBe(200);
    assertDatesNearOffset(res.data, -1, "nhl/daily/d-1");
  });
});

describe("Date Validation — NHL Odds", () => {
  it("should have dates within 14 days of today", async () => {
    const res = await getNhlOdds();
    expect(res.status).toBe(200);
    assertDatesWithinRange(res.data, 14, "nhl/odds");
  });
});

// --- NFL (no daily endpoint) ---

describe("Date Validation — NFL Livescores", () => {
  it("should have valid dates in livescores", async () => {
    const res = await getNflLivescores();
    expect(res.status).toBe(200);
    assertAllDatesValid(res.data, "nfl/livescores");
  });
});

describe("Date Validation — NFL Odds", () => {
  it("should have dates within 14 days of today", async () => {
    const res = await getNflOdds();
    expect(res.status).toBe(200);
    assertDatesWithinRange(res.data, 14, "nfl/odds");
  });
});

// --- MLB ---

describe("Date Validation — MLB Livescores", () => {
  it("should have valid dates in livescores", async () => {
    const res = await getMlbLivescores();
    expect(res.status).toBe(200);
    assertAllDatesValid(res.data, "mlb/livescores");
  });
});

describe("Date Validation — MLB Daily", () => {
  it("d1 matches should be for tomorrow", async () => {
    const res = await getMlbDaily("d1");
    expect(res.status).toBe(200);
    assertDatesNearOffset(res.data, 1, "mlb/daily/d1");
  });

  it("d-1 matches should be for yesterday", async () => {
    const res = await getMlbDaily("d-1");
    expect(res.status).toBe(200);
    assertDatesNearOffset(res.data, -1, "mlb/daily/d-1");
  });
});

describe("Date Validation — MLB Odds", () => {
  it("should have dates within 14 days of today", async () => {
    const res = await getMlbOdds();
    expect(res.status).toBe(200);
    assertDatesWithinRange(res.data, 14, "mlb/odds");
  });
});

// --- NBA ---

describe("Date Validation — NBA Livescores", () => {
  it("should have valid dates in livescores", async () => {
    const res = await getNbaLivescores();
    expect(res.status).toBe(200);
    assertAllDatesValid(res.data, "nba/livescores");
  });
});

describe("Date Validation — NBA Daily", () => {
  it("d1 matches should be for tomorrow", async () => {
    const res = await getNbaDaily("d1");
    expect(res.status).toBe(200);
    assertDatesNearOffset(res.data, 1, "nba/daily/d1");
  });

  it("d-1 matches should be for yesterday", async () => {
    const res = await getNbaDaily("d-1");
    expect(res.status).toBe(200);
    assertDatesNearOffset(res.data, -1, "nba/daily/d-1");
  });
});

describe("Date Validation — NBA Odds", () => {
  it("should have dates within 14 days of today", async () => {
    const res = await getNbaOdds();
    expect(res.status).toBe(200);
    assertDatesWithinRange(res.data, 14, "nba/odds");
  });
});
