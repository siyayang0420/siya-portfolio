# Jeni V1 — Monitoring Pipeline Architecture

Reconstructed from the implementation in `src/modules/jeni-detection/`.
Scope: the detection/monitoring module only.

---

## A. The complete V1 architecture in 9 steps

1. **An HTTP POST opens a run and streams progress back.** `POST /api/scan` starts the
   pipeline and returns a Server-Sent Events stream with a 15-second keepalive so the
   operator watches the run live. A module-level lock refuses a second concurrent run,
   because each run launches roughly eight headless browsers.

2. **Ten collectors execute in sequence.** Each is self-contained behind one interface:
   it decides how to discover URLs, whether it needs a real browser, and how to turn its
   own source into a common `RawCollectedEvent`. Adding a source touches one array.

3. **Discovery never trusts a single channel.** RSS feeds are short and sometimes stale,
   so collectors also walk paginated category archives, sitemaps, and WordPress tag pages.
   The health source reads the current PDF URL off the live page rather than hardcoding it,
   because the filename changes annually.

4. **Fetch escalates only as far as needed.** Plain HTTP where it works (Noms, Scout, RBB).
   Headless Chromium where Cloudflare demands JS execution (Vancouver Is Awesome). Stealth
   Chromium with disk-persisted cookies and simulated mouse and scroll entropy where Akamai
   demands a plausible human (BizBuySell).

5. **Cheap deterministic filters run before anything expensive.** URL-slug relevance scoring
   before fetch; a regex keyword gate on title and description before fetching the body; a
   five-strategy deterministic name extractor before the LLM. Most articles are rejected
   without a single network request past the feed.

6. **The LLM is called narrowly and never decides alone.** For generic media it extracts
   names only — the signal type comes from regex. For richer sources it returns structured
   JSON, which then passes through enum whitelists, confidence clamps, and a deterministic
   validator that can override it.

7. **Entity resolution is a scoring problem, not a lookup.** Google Places Text Search
   returns candidates; each is scored on Jaccard token similarity (after accent, CJK, and
   corporate-suffix normalization), street-number alignment, food-type, and city, behind a
   hard British Columbia geofence. Different sources use different thresholds because they
   carry different evidence.

8. **Failure to resolve is a first-class outcome.** Unresolvable listings and closures become
   explicitly-typed UNKNOWN events with a null restaurant link, preserved for human review,
   rather than a guessed match.

9. **Everything is written idempotently and is re-scannable.** A stable dedup key increments
   a sighting counter rather than duplicating; unresolved events are retried on later runs;
   and a stamped parser version lets an improved extractor go back and repair records it
   wrote badly before.

---

## B. Source-by-source

| Source type | Example sources | Collection method | LLM role | Entity resolution | Final signal |
|---|---|---|---|---|---|
| **Editorial — RSS only** | Vancouver Magazine | `fetch` RSS → cheerio xmlMode → 20 articles/feed → 28-day freshness gate | **Name extraction only** (`extract` tier); signal type comes from the regex gate. Skipped entirely when deterministic extraction clears 0.55 | Name + city string match only; no Places call on this path | `NEWLY_OPENED`, `OPENING_SOON`, `CONFIRMED_CLOSED`, `TEMP_CLOSED`, `LIKELY_CLOSING`, else `NEEDS_REVIEW` @ 0.25 |
| **Editorial — multi-strategy** | Noms Magazine, Scout Magazine | `fetch` + RSS **plus** paginated category/tag archives (Noms `/category/news/`; Scout 5 pages × 2 categories + opening-soon column) | **Full structured extraction** (`extract`), then overridable by a deterministic validator | Places Text Search, `type=restaurant`, minimum 0.30. Enrichment only — a miss lowers confidence but never discards the record | Same set. Noms dedups by article URL, so a re-extraction repairs previously bad rows |
| **Editorial — bot-protected** | Vancouver Is Awesome | **Playwright / Chromium** (Cloudflare). Category pages first, RSS as supplement. URLs relevance-scored before fetch | **Full structured extraction including `article_type`.** One call handles roundups. Prompt encodes former-tenant, main-subject, and per-restaurant-evidence rules | Places at 0.40 to fill a missing address, 0.70 to override an address the article already gave | Same set, plus `MEDIA_MENTION` (skipped — never creates a restaurant) |
| **Health authority** | Vancouver Coastal Health closure PDF | **Playwright** → discover PDF URL from page links → download inside the browser session → `pdf-parse` → line-oriented state machine | **Classifier only** (`classify` tier), and only for names that survive ~15 exclusion and ~70 inclusion regexes | **VCH-specific resolver**: `type=establishment`, name scored separately from address, street number +0.25 / −0.50, CJK + accent + parenthetical normalization, minimum 0.40, capped at 0.87, then five further guards | `RESTAURANT_CLOSED_BY_HEALTH_AUTHORITY` @ ≤0.87, or `HEALTH_CLOSURE_UNKNOWN` @ 0.45, or skipped entirely (non-restaurant, out of region, or already closed) |
| **Listing — bot-protected** | BizBuySell | **Stealth Playwright + Akamai bypass**: disk cookies, one reused page, human mouse and scroll, content-based block detection. 8 index pages × 60 listings, 1.2s throttle | **Card-title classifier only**, invoked only for titles the deterministic rules call ambiguous | Places: explicit name ≥0.50. Generic title falls back to food-keyword + neighbourhood hint at ≥0.65 | `BUSINESS_FOR_SALE`, downgraded to `NEEDS_REVIEW` when Places did not clear the threshold or the city is out of area |
| **Listing — MLS broker** | restaurantbusinessbroker.ca | Plain `browserFetch`. Index → 17 city sub-pages → MRP `<li>` cards. **No detail-page fetch** — MLS confidentiality means detail pages add nothing | **None** — fully deterministic | Name-hint lookup requiring **Jaccard ≥0.40 AND street number within ±3**; otherwise a strict address-only lookup requiring a food-type business at the matching number | `BUSINESS_FOR_SALE` @ ≤0.88, or `BUSINESS_FOR_SALE_UNKNOWN` @ 0.40 |
| **Listing — no street numbers** | findbusinesses4sale.com | Playwright + parse. City from meta tags | **Name extraction plus restaurant/not classification.** A listing is discarded only on the model's `is_restaurant_related: false` | Name-in-city only — **address lookup is structurally impossible** (street-name hints, never numbers). Requires LLM name confidence ≥0.65 to attempt, Jaccard ≥0.40, capped at 0.85 | `BUSINESS_FOR_SALE` @ ≤0.85, or `BUSINESS_FOR_SALE_UNKNOWN` @ 0.40 |
| *(Adjacent — not traced in depth)* | Google Places diff, website checker | Place-ID diff against stored IDs; HTTP liveness check | None | **`placeId` is the primary key** — dedicated upsert with a name + city fallback | `NEWLY_DISCOVERED_FROM_GOOGLE_PLACES` (gated by a freshness scorer), `WEBSITE_DOWN` |

---

## C. Architecture diagram

```
                        POST /api/scan  (SSE stream, 15s keepalive)
                        POST /api/scan/[collector]
                        tsx runRailwayMonitoring.ts  (safe allow-list, one-shot)
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │  runMonitoring()              │
                        │  _activeRun lock · 1 at a time│
                        │  startMonitoringRun() → runId │
                        └───────────────┬───────────────┘
                                        │  10 collectors, sequential
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌───────────────┐             ┌───────────────┐             ┌───────────────┐
│  EDITORIAL    │             │  HEALTH (VCH) │             │   LISTINGS    │
└───────┬───────┘             └───────┬───────┘             └───────┬───────┘
        │                             │                             │
 DISCOVER                       DISCOVER                       DISCOVER
 RSS + category pages           Playwright → read PDF          index → 17 city pages (RBB)
 + sitemap/tags (Noms)          URL off the live page          8 paginated index pages (BBS)
 → relevance score              (never hardcoded)              → card URLs, seen-set dedup
   relevant / maybe / drop
        │                             │                             │
 FETCH                          FETCH                          FETCH
 fetch()    → Noms, Scout       download PDF in browser        browserFetch()   → RBB
 Chromium   → VIA (Cloudflare)  session, then close browser    stealth Chromium → BBS, FB4S
 2× retry, media blocked                                       (Akamai: disk cookies,
                                                                one reused page, human
                                                                mouse+scroll, 200-OK
                                                                block detection)
        │                             │                             │
 EXTRACT                        EXTRACT                        EXTRACT
 cheerio → clean body,          pdf-parse → line state         cheerio → 3 fallback
 paragraphs, headings, bold     machine (3 layouts, region     selector strategies;
                                headers, date-anchored rows)   badge/EBITDA stripping;
                                name = text after last date    "KOKOMO 3270 Edgemont"
                                                               → name + address split
        │                             │                             │
 ── RULES ──────────────────    ── RULES ──────────────────    ── RULES ──────────────────
 keyword gate (HARD, ~50 res)   ~15 exclusion patterns         marketing-copy regex
 → decides the EVENT TYPE       ~70 inclusion patterns         → explicit / generic /
 5-strategy deterministic       → high confidence, no LLM         ambiguous
 name extractor (0.88→0.60)                                    confidential detection
        │  ≥0.55 → SKIP LLM           │  ambiguous only              │  ambiguous only
        ▼                             ▼                             ▼
 ── LLM (Gemini) ───────────────────────────────────────────────────────────────
 llmClient.callLlm(task) · classify=flash-lite · extract=flash
 returns raw string | null → each call site parses + sanitizes its own JSON
 names + structured fields ONLY.  Enum whitelist · confidence clamp · deterministic
 validator may OVERRIDE the model (Noms).  No key → deterministic fallback path.
        │                             │                             │
        └──────────────┬──────────────┴──────────────┬──────────────┘
                       ▼                             ▼
        ┌──────────────────────────────────────────────────────┐
        │  ENTITY RESOLUTION — Google Places Text Search        │
        │  Jaccard(tokens) after NFD accent-fold + CJK strip    │
        │                       + paren-suffix strip            │
        │  BC substring geofence  ·  food-type bonus            │
        │  street number: +0.25 match / −0.50 mismatch (VCH)    │
        │                 hard ±3 reject (RBB)                  │
        │  thresholds: 0.30 generic · 0.40 VCH · 0.50 explicit  │
        │              0.65 generic-title · 0.65 LLM-name (FB4S)│
        └───────────────┬──────────────────────┬────────────────┘
                    RESOLVED                UNRESOLVED
                        │                       │
                        ▼                       ▼
        RESTAURANT_NEWLY_OPENED      RESTAURANT_NEEDS_REVIEW
        RESTAURANT_CONFIRMED_CLOSED  RESTAURANT_BUSINESS_FOR_SALE_UNKNOWN
        RESTAURANT_BUSINESS_FOR_SALE RESTAURANT_HEALTH_CLOSURE_UNKNOWN
        RESTAURANT_CLOSED_BY_        (event row, restaurantId = NULL,
          HEALTH_AUTHORITY            never creates a restaurant)
                        │                       │
                        ▼                       ▼
        ┌───────────────────────────────────────────────────────┐
        │  NORMALIZE → title-case, trim, stamp detectedAt        │
        │  Metro Vancouver city filter                           │
        │  dedupeKey = name|type|source|host+path (query stripped)│
        │    hit  → timesSeen++, lastSeenAt, promote restaurantId │
        │    miss → new event row                                │
        │  Noms: URL-keyed upsert, +0.05 delta to overwrite       │
        │  Places: placeId-keyed upsert                           │
        └───────────────┬───────────────────────────────────────┘
                        ▼
        Postgres: restaurants · events · restaurant_status_history · monitoring_runs
                        │
                        ├── retryNeedsReviewEvents()   (≤20/run, 28d window, in-place update)
                        ├── reprocessStaleNomsEvents() (parser-version tag mismatch)
                        └── contact enrichment (fire-and-forget)
                        │
                        ▼
        Jeni UI: getSignalFeed() → health / opening / risk / sale buckets
                 Unknown For Sale + Unknown Health Closure review sections
                 run log with per-collector stats + skip breakdown
```

---

## D. Five technically meaningful details

### 1. The Akamai bypass, and specifically the counter-intuitive part

Cookie persistence across runs, a single reused page so the `Referer` header stays internal,
and synthetic mouse and scroll entropy are all defensible on their own. The detail that proves
this was debugged against a live adversary is the comment in `bizPlaywright.ts`: blocking
analytics-shaped URLs by glob **kills Akamai's own sensor beacon**, so the challenge never
resolves. You have to let the tracker through in order to get past the bot check.

Paired with that: a hard Akamai block returns **HTTP 200**, not 403. So block detection is
content-based — is `body.main-site-wrapper` present, is the HTML under 10 KB — and a screenshot
is written to disk on every failure for forensics.

### 2. "Wrong match is worse than no match", enforced as a type rather than a slogan

Three event types (`BUSINESS_FOR_SALE_UNKNOWN`, `HEALTH_CLOSURE_UNKNOWN`, `NEEDS_REVIEW`) exist
purely to represent *identified but unidentifiable*, and the pipeline persists them with
`restaurantId = null`, so an unresolved listing can never contaminate the restaurant table.

The threshold that makes this concrete is the broker collector's ±3 street-number tolerance,
documented alongside the actual failure it prevents: a listing at 3270 Edgemont Blvd would
otherwise have resolved to *Bufala Edgemont* at 3280. That is a product decision — a broker's
confidential listing should stay visible but unnamed — enforced at the schema level.

### 3. Cost is designed into the control flow, not bolted on afterwards

LLM calls sit behind three cheaper layers in sequence: URL-slug relevance scoring before fetch,
a ~50-regex keyword gate on title and description before fetching the body, and a five-strategy
deterministic name extractor that short-circuits at 0.55 confidence.

When the model *is* called, the task tier picks the model — `flash-lite` for an 80-token binary
classification, `flash` for structured extraction — and the prompt is told what the signal
already is, so the model only has to find names. The measurable consequence: an article with no
lifecycle keyword costs exactly one RSS parse and nothing else.

### 4. Self-repairing extraction via a stamped parser version

`NOMS_PARSER_VERSION = "3.1"` is written into every event's `evidenceText` as `[v3.1]`.
`getNeedsReprocessNomsEvents()` selects rows whose evidence text *lacks* the current tag, and the
Noms path uniquely dedups by article URL rather than by name — so improving the extractor and
re-running goes back and overwrites the wrong names produced under v3.0.

Combined with the NEEDS_REVIEW retry loop, the system improves retroactively rather than only
going forward. Most scrapers can only ever move forward.

### 5. Entity resolution tuned to real Metro Vancouver naming

The Jaccard scorer takes `max(raw, cleaned)`, where cleaning does three things:

- **Unicode NFD decomposition + combining-mark strip**, so `CAFÉ` matches `CAFE` — the VCH PDF
  carries accents that Google's data does not.
- **CJK range stripping**, so `"Want Want Hot & Spicy House 旺旺麻辣烫"` matches its Latin-only
  Places entry.
- **Parenthetical corporate-suffix removal**, so `"Dolsot (Bibiko Inc)"` scores against `"Dolsot"`.

Then, for the health source only, name and address are scored **separately** — the address goes
into the text query so Google can geolocate the merchant, but it is deliberately excluded from
the name similarity calculation so address tokens cannot inflate the score.

*Runner-up for this slot:* the 20-line comment explaining why the code imports
`pdf-parse/lib/pdf-parse.js` instead of the package itself. `pdf-parse` v1.1.1's `index.js` runs
`let isDebugMode = !module.parent`, which is permanently `true` on Node 14+ where `module.parent`
is deprecated, triggering a self-test that reads a fixture that does not exist outside the package
source. It is also lazy-required inside the function so a require-time failure surfaces at call
time rather than silently unregistering the Next.js route handler as a 404.

---

## Caveats — what not to claim

- **There is no scheduler.** Runs are externally triggered over HTTP. No cron daemon exists
  anywhere in the repo.
- **There is no incremental watermark.** `monitoring_runs` is an audit log; every run re-scans
  the full surface area. A flat 28-day freshness window plus write-time dedup stands in for
  incrementality.
- **Confidence scores are hand-tuned heuristic blends**, not calibrated probabilities.
- **BizBuySell listings carry no date**, so they escape the freshness rule entirely.
- **The Metro Vancouver city list is duplicated across five files** with "keep in sync" comments.
- **Written but unreached by the live pipeline:** `extractBizListingWithLLM`,
  `NomsFullDiscoveryCollector`, `mockCollector`, and the `reason` / `gemini-2.5-pro` tier.
- **The hardest collector to build is excluded from the automated path** — the Railway runner's
  own comments describe BizBuySell as "too flaky for unattended production use."
