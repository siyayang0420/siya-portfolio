// =============================================================================
// voice-server — the AI phone-ordering agent behind the portfolio's
// "Selected AI Experiences" card. Lifted from bravo-ai-demo; only the calling
// pipeline came across.
//
//   1. POST /api/calls       → Twilio dials the visitor's own phone
//   2. They pick up           → Twilio POSTs /twilio/voice, gets <Stream> TwiML
//   3. Twilio opens WS        → /media-stream carries the call audio
//   4. Backend opens OpenAI   → Realtime agent places the order by voice
//   5. GET /api/calls/:id     → the card polls status, transcript and ETA
//
// Runs separately from the Next.js site (Vercel can't hold the audio socket).
// Locally: `npm start` here plus an ngrok tunnel; in production any always-on
// Node host, with PUBLIC_BASE_URL pointing at it.
// =============================================================================

import express             from 'express';
import http                from 'http';
import { WebSocketServer } from 'ws';

// Must be first: it loads .env and validates it.
import {
    PORT,
    PUBLIC_BASE_URL,
    OPENAI_REALTIME_MODEL,
    ALLOWED_ORIGINS,
    CALLS_ENABLED,
}                                     from './config/env.js';

import callRoutes                     from './routes/callRoutes.js';
import twilioRoutes                   from './routes/twilioRoutes.js';
import healthRoutes                   from './routes/healthRoutes.js';
import { registerMediaStreamHandler } from './websocket/mediaStreamHandler.js';

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// CORS for the portfolio only. Twilio's webhooks don't need it.
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.use(callRoutes);
app.use(twilioRoutes);
app.use(healthRoutes);

const server = http.createServer(app);
const wss    = new WebSocketServer({ server, path: '/media-stream' });
registerMediaStreamHandler(wss);

process.on('uncaughtException',  (err)    => console.error('[process] ❌ uncaughtException:', err));
process.on('unhandledRejection', (reason) => console.error('[process] ❌ unhandledRejection:', reason));

server.listen(PORT, () => {
    console.log('');
    console.log('  📞  voice-server — portfolio AI call demo');
    console.log(`  ➜  http://localhost:${PORT}`);
    console.log(`     public base   : ${PUBLIC_BASE_URL}`);
    console.log(`     openai model  : ${OPENAI_REALTIME_MODEL}`);
    console.log(`     calls enabled : ${CALLS_ENABLED}`);
    console.log(`     origins       : ${ALLOWED_ORIGINS.join(', ')}`);
    console.log('');
});
