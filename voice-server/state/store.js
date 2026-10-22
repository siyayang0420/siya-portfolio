// =============================================================================
// state/store.js — Shared mutable runtime state
//
// All modules import from this single file so they share the same Map/array
// instances. ES module caching guarantees one instance per process.
//
// NOTE: currentSession is reassigned on every new call, so it lives inside
// the sessionState wrapper object. Use sessionState.current everywhere instead
// of a bare variable — ES module live bindings do not propagate reassignment
// to importers, but property mutation on a shared object is visible to all.
// =============================================================================

// ---------------------------------------------------------------------------
// Order store — single source of truth for all order + call state.
//
// orders:     orderId → order record (created by POST /api/orders)
// callOrders: callSid → order record (linked at Twilio call-create time)
//
// Order record shape:
//   { ...enrichedOrder, orderId, callStatus, callSid, createdAt }
//
// callStatus lifecycle:
//   pending → calling → connected → completed | failed
// ---------------------------------------------------------------------------
export const orders     = new Map();   // orderId → order record
export const callOrders = new Map();   // callSid  → order record

// ---------------------------------------------------------------------------
// Debug event ring buffer — max 500 events, newest last.
// Exposed to the debugger UI via GET /api/debug/current (poll) and
// GET /api/debug/stream (SSE push).
// ---------------------------------------------------------------------------
export const debugEvents = [];

// SSE response objects — one per connected debug client.
export const sseClients  = new Set();

// ---------------------------------------------------------------------------
// Call history ring buffer — ordered newest-first, max 100 records.
// Persists across calls for the lifetime of the process.
// ---------------------------------------------------------------------------
export const callHistory     = [];
export const CALL_HISTORY_MAX = 100;

// ---------------------------------------------------------------------------
// sessionState.current — live snapshot of the active call session.
// Replaced in full at the start of each new call (POST /api/orders/:id/call).
// Set to null when no call is running.
//
// Shape:
//   { orderId, callSid, startTime, order, lang, agentState,
//     callStatus, orderResult, connections, transcript }
// ---------------------------------------------------------------------------
export const sessionState = { current: null };
