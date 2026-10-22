// =============================================================================
// config/env.js — Environment validation, constants, and shared Twilio client
//
// This module runs dotenv.config() as a side effect on first import.
// All other modules import their env vars from here — never from process.env
// directly — so there is a single validation point.
// =============================================================================

import dotenv from 'dotenv';
import twilio from 'twilio';

// Locally: voice-server/.env, or the portfolio's own .env.local one level up
// (first file wins per key). On the host, set these in its dashboard.
dotenv.config({ path: ['.env', '../.env.local'], quiet: true });

const REQUIRED_ENV = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'PUBLIC_BASE_URL',
    'OPENAI_API_KEY',
];

for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`[startup] ❌  Missing required env var: ${key}`);
        process.exit(1);
    }
}

export const TWILIO_ACCOUNT_SID    = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN     = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER   = process.env.TWILIO_PHONE_NUMBER;
export const PUBLIC_BASE_URL       = process.env.PUBLIC_BASE_URL;
export const OPENAI_API_KEY        = process.env.OPENAI_API_KEY;

// GA Realtime model. The old 'gpt-4o-realtime-preview-*' snapshots only speak
// the retired beta wire format (rejected with `beta_api_shape_disabled`).
export const OPENAI_REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL
    || 'gpt-realtime';

// Voice for the phone agent. GA options:
//   female-presenting : marin (newest, most natural), coral, shimmer, sage
//   male-presenting   : cedar (newest), ash, echo, verse, ballad
//   neutral           : alloy
// Override with OPENAI_VOICE env var.
export const OPENAI_VOICE = process.env.OPENAI_VOICE || 'marin';

// Language used for the live phone call.
// Supported: 'en' | 'zh_cn' | 'zh_tw'
// Override with CALL_LANGUAGE env var.
export const CALL_LANGUAGE = process.env.CALL_LANGUAGE || 'en';

// 3001, not 3000: the portfolio's own dev server already owns 3000.
export const PORT = process.env.PORT || 3001;

// ── Portfolio demo guardrails ────────────────────────────────────────────────
// Off unless explicitly turned on, so a fresh deploy can't place calls by
// accident. Flip to "false" on the host to stop all calls immediately.
export const CALLS_ENABLED = process.env.CALLS_ENABLED === 'true';

// Browsers allowed to start a call (comma-separated origins).
export const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS
    || 'http://localhost:3000,https://siyayang.xyz,https://www.siyayang.xyz')
    .split(',').map((o) => o.trim()).filter(Boolean);

// Caps, reset daily (server time). Twilio's own timeLimit ends long calls.
export const DAILY_CALL_CAP       = Number(process.env.DAILY_CALL_CAP || 5);
export const PER_NUMBER_DAILY_CAP = Number(process.env.PER_NUMBER_DAILY_CAP || 1);
export const CALL_TIME_LIMIT_S    = Number(process.env.CALL_TIME_LIMIT_S || 150);

// Extra attempts granted by hand (a visitor emails for another try). Comma-
// separated numbers in any format; each listing is one more call per day.
// Re-read on restart.
export const BONUS_NUMBERS = (process.env.BONUS_NUMBERS || '')
    .split(',').map((n) => n.trim()).filter(Boolean);

// Set to "false" only for local tunnels whose URL doesn't match what Twilio
// signs; leave on in production.
export const VALIDATE_TWILIO = process.env.VALIDATE_TWILIO !== 'false';

// WebSocket URL Twilio will connect to for media streaming
export const STREAM_URL = PUBLIC_BASE_URL
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://')
    + '/media-stream';

// Shared Twilio REST client — import this wherever Twilio API calls are needed
export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
