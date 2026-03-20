# StatPal API Integration Tests

Automated integration tests for the [StatPal Sports Data API](https://statpal.io), covering NFL, NBA, NHL, and MLB endpoints.

## What's tested

- **Authentication** — valid key, missing key, invalid key
- **Usage monitoring** — request count endpoint
- **Per-sport endpoint checks** (NHL, NFL, MLB, NBA):
  - Live scores
  - Season schedule
  - Standings
  - Odds
  - Live plays (NFL)
  - Daily games (NHL, MLB, NBA)
- **Date validation** — verifies match dates in daily and odds responses are correct relative to the current date

## Setup

```bash
npm install
cp .env.example .env
# Add your StatPal API key to .env
```

## Run tests

```bash
npm test
```

## GitHub Actions

Tests run **every hour** via GitHub Actions. Each run:

1. Executes the full test suite
2. Saves all API JSON responses as build artifacts (30-day retention)
3. Sends a Slack notification on success or failure

### Required secrets

| Secret | Description |
|--------|-------------|
| `STATPAL_API_KEY` | Your StatPal API key |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL |

## Project structure

```
src/
  helpers.ts              # API client functions and date validation utilities
  save-responses.ts       # Saves JSON responses to disk for artifact upload
  auth.test.ts            # Authentication and usage monitoring tests
  nhl.test.ts             # NHL endpoint tests
  nfl.test.ts             # NFL endpoint tests
  mlb.test.ts             # MLB endpoint tests
  nba.test.ts             # NBA endpoint tests
  date-validation.test.ts # Date correctness tests across all sports
```
