import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RESPONSES_DIR = join(process.cwd(), "test-responses");

let initialized = false;

function ensureDir() {
  if (!initialized) {
    mkdirSync(RESPONSES_DIR, { recursive: true });
    initialized = true;
  }
}

/**
 * Saves an API response to disk so it can be uploaded as a build artifact.
 * Filename is sanitized from the label (e.g. "nhl/livescores" → "nhl-livescores.json").
 */
export function saveResponse(label: string, status: number, data: unknown) {
  ensureDir();
  const filename = label.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") + ".json";
  const payload = {
    endpoint: label,
    status,
    timestamp: new Date().toISOString(),
    response: data,
  };
  writeFileSync(join(RESPONSES_DIR, filename), JSON.stringify(payload, null, 2));
}
