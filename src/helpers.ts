import { saveResponse } from "./save-responses.js";

const API_KEY = process.env.STATPAL_API_KEY;

if (!API_KEY) {
  throw new Error("STATPAL_API_KEY environment variable is required");
}

const V1_BASE = "https://statpal.io/api/v1";
const BASE = "https://statpal.io/api";

/** Small delay between requests to respect rate limits */
export async function rateLimitDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ApiResponse<T = unknown> {
  status: number;
  ok: boolean;
  data: T;
}

async function request<T = unknown>(
  url: string,
  params: Record<string, string> = {},
): Promise<ApiResponse<T>> {
  const searchParams = new URLSearchParams({ access_key: API_KEY, ...params });
  const fullUrl = `${url}?${searchParams}`;

  const res = await fetch(fullUrl);
  const contentType = res.headers.get("content-type") ?? "";

  let data: T;
  if (contentType.includes("application/json")) {
    data = (await res.json()) as T;
  } else {
    data = (await res.text()) as unknown as T;
  }

  // Derive a label from the URL path for artifact saving
  const urlPath = new URL(url).pathname.replace(/^\/api\/(v[12]\/)?/, "");
  const paramSuffix = Object.entries(params)
    .filter(([k]) => k !== "access_key")
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const label = paramSuffix ? `${urlPath}?${paramSuffix}` : urlPath;
  saveResponse(label, res.status, data);

  return { status: res.status, ok: res.ok, data };
}

async function requestNoAuth<T = unknown>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  const contentType = res.headers.get("content-type") ?? "";

  let data: T;
  if (contentType.includes("application/json")) {
    data = (await res.json()) as T;
  } else {
    data = (await res.text()) as unknown as T;
  }

  return { status: res.status, ok: res.ok, data };
}

// --- Usage monitoring ---

export function getRequestCount() {
  return request(`${BASE}/user-request-count`);
}

// --- NHL ---

export function getNhlLivescores() {
  return request(`${V1_BASE}/nhl/livescores`);
}

export function getNhlSeasonSchedule() {
  return request(`${V1_BASE}/nhl/season-schedule`);
}

export function getNhlStandings() {
  return request(`${V1_BASE}/nhl/standings`);
}

export function getNhlOdds() {
  return request(`${V1_BASE}/nhl/odds`);
}

export function getNhlDaily(offset: string) {
  return request(`${V1_BASE}/nhl/daily/${offset}`);
}

// --- NFL ---

export function getNflLivescores() {
  return request(`${V1_BASE}/nfl/livescores`);
}

export function getNflLivePlays() {
  return request(`${V1_BASE}/nfl/live-plays`);
}

export function getNflSeasonSchedule() {
  return request(`${V1_BASE}/nfl/season-schedule`);
}

export function getNflStandings() {
  return request(`${V1_BASE}/nfl/standings`);
}

export function getNflOdds() {
  return request(`${V1_BASE}/nfl/odds`);
}

// --- MLB ---

export function getMlbLivescores() {
  return request(`${V1_BASE}/mlb/livescores`);
}

export function getMlbSeasonSchedule() {
  return request(`${V1_BASE}/mlb/season-schedule`);
}

export function getMlbStandings() {
  return request(`${V1_BASE}/mlb/standings`);
}

export function getMlbOdds() {
  return request(`${V1_BASE}/mlb/odds`);
}

export function getMlbDaily(offset: string) {
  return request(`${V1_BASE}/mlb/daily/${offset}`);
}

// --- NBA ---

export function getNbaLivescores() {
  return request(`${V1_BASE}/nba/livescores`);
}

export function getNbaSeasonSchedule() {
  return request(`${V1_BASE}/nba/season-schedule`);
}

export function getNbaStandings() {
  return request(`${V1_BASE}/nba/standings`);
}

export function getNbaOdds() {
  return request(`${V1_BASE}/nba/odds`);
}

export function getNbaDaily(offset: string) {
  return request(`${V1_BASE}/nba/daily/${offset}`);
}

// --- Date validation helpers ---

/** DD.MM.YYYY format */
const DD_MM_YYYY = /^\d{2}\.\d{2}\.\d{4}$/;

/** Validates a DD.MM.YYYY string is a real calendar date */
export function isValidDate(dateStr: string): boolean {
  if (!DD_MM_YYYY.test(dateStr)) return false;
  const [day, month, year] = dateStr.split(".").map(Number);
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

/**
 * Recursively extract all `date` and `formatted_date` field values from an object.
 */
export function extractDateFields(obj: unknown, keys = ["date", "formatted_date"]): string[] {
  const dates: string[] = [];
  if (obj === null || obj === undefined || typeof obj !== "object") return dates;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      dates.push(...extractDateFields(item, keys));
    }
  } else {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (keys.includes(key) && typeof value === "string" && DD_MM_YYYY.test(value)) {
        dates.push(value);
      }
      if (typeof value === "object" && value !== null) {
        dates.push(...extractDateFields(value, keys));
      }
    }
  }
  return dates;
}

/**
 * Parse a DD.MM.YYYY string into a Date (midnight UTC).
 */
export function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Get the expected UTC date for a daily offset (e.g. "d1" = tomorrow, "d-1" = yesterday).
 */
export function expectedDateForOffset(offset: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset));
}

/**
 * Check if a DD.MM.YYYY date string matches the expected date for the given day offset.
 */
export function dateMatchesOffset(dateStr: string, offset: number): boolean {
  const parsed = parseDDMMYYYY(dateStr);
  const expected = expectedDateForOffset(offset);
  return parsed.getTime() === expected.getTime();
}

/**
 * Check if a DD.MM.YYYY date is within N days of today (inclusive).
 */
export function dateWithinDaysOfToday(dateStr: string, days: number): boolean {
  const parsed = parseDDMMYYYY(dateStr);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const diffMs = Math.abs(parsed.getTime() - today.getTime());
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

// --- Auth failure ---

export function getUnauthorizedRequest() {
  return requestNoAuth(`${V1_BASE}/nhl/livescores`);
}

export function getInvalidKeyRequest() {
  const url = `${V1_BASE}/nhl/livescores?access_key=invalid-key-00000000`;
  return requestNoAuth(url);
}
