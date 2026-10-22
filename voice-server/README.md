# voice-server

The AI phone-ordering agent behind the portfolio's "AI Call Agent" card. The calling pipeline was lifted from `bravo-ai-demo`; nothing else came across.

A visitor picks items, enters **their own** number, and gets a call. The AI places the order, and the visitor plays the restaurant staff.

It runs separately from the Next.js site, because Vercel can't hold the live call-audio socket.

## Run it locally

Use three terminals:

```bash
# 1. this server (port 3001; the portfolio uses 3000)
cd voice-server   # keys from voice-server/.env or the portfolio's .env.local (see .env.example)
npm start

# 2. a public tunnel so Twilio can reach it, then set PUBLIC_BASE_URL in .env to the https URL and restart (1)
ngrok http 3001

# 3. the portfolio
npm run dev
```

The card reads `NEXT_PUBLIC_VOICE_SERVER_URL` from the portfolio's `.env.local`. It defaults to `http://localhost:3001`.

`npm test` checks which phone numbers the demo is allowed to dial.

## Guardrails

| | |
|---|---|
| `CALLS_ENABLED` | Off by default. Set it to `false` on the host to stop every call at once. |
| `ALLOWED_ORIGINS` | Only these sites may start a call. |
| Phone | +1 North American numbers only. Toll-free and premium-rate numbers are refused. |
| Consent | The visitor must tick "this is my number". |
| Line | One call at a time. Other visitors get "line busy". |
| Caps | `PER_NUMBER_DAILY_CAP` (1, which the card's "1 call per visitor" line promises) and `DAILY_CALL_CAP` (5), in memory. |
| Extra tries | When a visitor emails for another go, add their number to `BONUS_NUMBERS` and restart. Each listing gives one more call that day. |
| Length | `CALL_TIME_LIMIT_S` (150). Twilio hangs up after this. |
| Webhooks | Every `/twilio/*` request must carry a valid Twilio signature. |
| Speech | The browser sends menu ids only. Item names come from `menu.js`, so nobody can make the AI read out arbitrary text. |
| Disclosure | The agent opens by saying it's an AI calling from a portfolio demo. |
| Privacy | No SMS. Nothing is written to disk. Transcripts live in memory for the current call only. |

Also, in the Twilio console: Voice → Settings → **Geo permissions**, allow only Canada and the US.

## Deploy

On any always-on Node host, set the root directory to `voice-server`. The start command is `npm start`. Copy the `.env` keys into the host's environment settings, and set `PUBLIC_BASE_URL` to the host's https URL (for example `https://voice.siyayang.xyz`).

On Render's free tier the server sleeps when idle. The card pings `/health` when it opens so the server is awake before the visitor asks for a call.
