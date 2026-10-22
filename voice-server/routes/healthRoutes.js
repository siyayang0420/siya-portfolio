// =============================================================================
// routes/healthRoutes.js — liveness only.
//
// The portfolio card pings this as soon as it opens so a sleeping free-tier
// host is awake before the visitor asks for a call. Deliberately reveals no
// config, numbers or history.
// =============================================================================

import express from 'express';
import { CALLS_ENABLED } from '../config/env.js';

const router = express.Router();

router.get('/health', (_req, res) => {
    res.json({ ok: true, callsEnabled: CALLS_ENABLED });
});

export default router;
