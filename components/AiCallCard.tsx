"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EMAIL, useCopyEmail } from "@/components/ui/useCopyEmail";

/**
 * AI Phone Ordering Agent — the playable version of Bravo's
 * phone-ordering agent, built from the Figma "AI Experience" frames.
 *
 * Start ordering → pick from a preset menu → confirm → enter your own number
 * and name → the AI calls you and places the order; you play the restaurant.
 * The call itself runs on voice-server (see voice-server/README.md).
 *
 * Sizes and colours are inline: the dev build skips new arbitrary classes.
 */

const API = process.env.NEXT_PUBLIC_VOICE_SERVER_URL || "http://localhost:3001";
const ASSET = "/work/ai-call";

// Ids must match voice-server/menu.js; the server owns what the AI says.
const MENU = [
  { id: "teen-burger", name: "Teen Burger™", price: 8.49, img: `${ASSET}/teen-burger.png` },
  { id: "mozza-burger", name: "Mozza Burger™", price: 8.49, img: `${ASSET}/mozza-burger.png` },
  { id: "root-beer", name: "A&W Root Beer™", price: 3.86, img: `${ASSET}/root-beer.png` },
];

type Step = "start" | "menu" | "phone" | "call";
type Line = { role: "ai" | "restaurant"; text: string };
type CallState = {
  status: string;
  twilioStatus: string | null;
  outcome: string | null;
  eta: string | null;
  transcript: Line[];
};

const ERRORS: Record<string, string> = {
  calls_disabled: "Calls are paused right now. Try again later.",
  invalid_phone: "That needs to be a Canadian or US number.",
  invalid_name: "Add a first name, letters only.",
  consent_required: "Tick the box to confirm it's your number.",
  line_busy: "Someone else is on a call. Try again in a minute.",
  number_cap: "That number has had its demo calls for today.",
  daily_cap: "Today's demo calls are used up. Try again tomorrow.",
  origin_not_allowed: "Calls can only be started from siyayang.xyz.",
  invalid_items: "The menu changed. Start over and pick your items again.",
  call_failed: "The call couldn't be placed. Check the number and try again.",
};

/** Set once this browser has placed its call; the server's per-number cap is the real limit. */
const USED_KEY = "ai-call-used";
const usedBefore = () => {
  try {
    return localStorage.getItem(USED_KEY) === "1";
  } catch {
    return false;
  }
};

const DONE = new Set(["completed", "failed", "busy", "no-answer", "canceled"]);

/* ── Design tokens from the frames ─────────────────────────────────────── */
const INK = "#202020";
const MUTED = "#737373";
const BLUE = "#4f83f7";
const LIFT = "drop-shadow(0px 4px 8px rgba(0,0,0,0.04)) drop-shadow(0px 0px 0.5px rgba(0,0,0,0.24))";
const SUBTLE = "0px 4px 16px 0px rgba(0,0,0,0.04), 0px 0px 1px 0px rgba(0,0,0,0.24)";
const PILL: CSSProperties = {
  height: 54,
  borderRadius: 100,
  filter: LIFT,
  fontSize: 16,
};
// The site's button hover (components/ui/pill.ts): fills blue, text turns
// white. Colours live in classes, not inline, so :hover can override them.
const PILL_CLASS =
  "cursor-pointer bg-white text-[#202020] transition hover:bg-[#4f83f7] hover:text-white active:bg-[#4f83f7] active:text-white";
/** A disabled pill drops the hover classes outright: `disabled:` variants
 *  aren't emitted by the dev build, so the blue would still show. */
// Disabled: white with a neutral-300 label (it would otherwise inherit the
// page's white text and vanish).
const pill = (enabled: boolean) => (enabled ? PILL_CLASS : "bg-white text-neutral-300 cursor-default");

/** Formats as you type, to the placeholder's (778)-123-1234. A leading
 *  country-code 1 is dropped; the server re-normalises whatever arrives. */
function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d[0] === "1") d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length <= 3) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 3)})-${d.slice(3)}`;
  return `(${d.slice(0, 3)})-${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function AiCallCard() {
  const [step, setStep] = useState<Step>("start");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  // Out of attempts: shown in place of the call form.
  const [limited, setLimited] = useState(false);
  useEffect(() => setLimited(usedBefore()), []);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [call, setCall] = useState<CallState | null>(null);
  const [callId, setCallId] = useState<string | null>(null);

  // Wake a sleeping free-tier host while the visitor is still choosing.
  // placeCall waits on this, so an early "Call me" says "Waking up the line…".
  const [awake, setAwake] = useState(false);
  const wake = useRef<Promise<void> | null>(null);
  useEffect(() => {
    wake.current = fetch(`${API}/health`).then(
      () => setAwake(true),
      () => setAwake(true),
    );
  }, []);

  // Poll the call until it's over.
  useEffect(() => {
    if (!callId) return;
    let stop = false;
    const tick = async () => {
      try {
        const r = await fetch(`${API}/api/calls/${callId}`);
        const d = await r.json();
        if (stop || !d.ok) return;
        setCall(d);
        if (d.outcome || DONE.has(d.twilioStatus)) stop = true;
      } catch {
        /* transient; try again next tick */
      }
      if (!stop) setTimeout(tick, 1500);
    };
    tick();
    return () => {
      stop = true;
    };
  }, [callId]);

  const transcriptRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [call?.transcript.length, call?.outcome, call?.twilioStatus]); // the closing status line too

  const picked = MENU.filter((m) => cart[m.id]);
  const count = picked.reduce((n, m) => n + cart[m.id], 0);
  const total = picked.reduce((t, m) => t + m.price * cart[m.id], 0);
  const add = (id: string) => setCart((c) => ({ ...c, [id]: Math.min((c[id] ?? 0) + 1, 5) }));
  const less = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] ?? 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  const drop = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      if (!Object.keys(next).length) setStep("menu");
      return next;
    });

  async function placeCall() {
    setError(null);
    setSending(true);
    try {
      await wake.current;
      const r = await fetch(`${API}/api/calls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name,
          consent,
          items: picked.map((m) => ({ id: m.id, quantity: cart[m.id] })),
        }),
      });
      const d = await r.json();
      if (!d.ok) throw new Error(d.error);
      setCallId(d.callId);
      try {
        localStorage.setItem(USED_KEY, "1");
      } catch {
        /* private mode: the server's cap still applies */
      }
      setCall(null);
      setStep("call");
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "number_cap") setLimited(true);
      else setError(ERRORS[code] ?? "Couldn't start the call. Try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  // TEMP-DEV: plays a scripted call through the real call screen without
  // touching voice-server, so the interaction can be reviewed with no phone
  // call. Only rendered in development; delete this block and its button
  // once the UI is signed off.
  const simTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  function simulateCall() {
    simTimers.current.forEach(clearTimeout);
    const who = name.trim() || "Alex";
    const item = picked.map((m) => `${cart[m.id]} ${m.name.replace("™", "")}`).join(" and ") || "1 Teen Burger";
    const script: Line[] = [
      { role: "ai", text: `Hi there! This is ${who}’s AI assistant, calling from Siya’s portfolio demo to place a pickup order. Would you prefer English or French?` },
      { role: "restaurant", text: "English is fine." },
      { role: "ai", text: "Great. Are you able to take a pickup order right now?" },
      { role: "restaurant", text: "Yes, go ahead." },
      { role: "ai", text: `Perfect. I'd like ${item}. About how long until it's ready for pickup?` },
      { role: "restaurant", text: "About 20 minutes." },
      { role: "ai", text: `Great, thank you. The customer's number is ${phone || "778-123-1234"}... and they'll come by to pick it up.` },
      { role: "restaurant", text: "Okay, thank you." },
      { role: "ai", text: "Perfect, that's everything. Thank you so much... have a good one!" },
    ];
    const base: CallState = { status: "calling", twilioStatus: null, outcome: null, eta: null, transcript: [] };
    const at = (ms: number, next: Partial<CallState>) =>
      simTimers.current.push(setTimeout(() => setCall((c) => ({ ...(c ?? base), ...next })), ms));
    setError(null);
    setCallId(null);
    setCall(null);
    setStep("call");
    at(2500, { twilioStatus: "ringing" });
    at(6000, { twilioStatus: "in-progress", status: "connected" });
    script.forEach((_, i) => at(7000 + i * 2200, { transcript: script.slice(0, i + 1) }));
    const end = 7000 + script.length * 2200;
    at(end, { outcome: "order_completed", eta: "20 minutes" });
    at(end + 500, { twilioStatus: "completed", status: "completed" });
  }
  useEffect(() => () => simTimers.current.forEach(clearTimeout), []);

  function reset() {
    simTimers.current.forEach(clearTimeout);
    setStep("start");
    setCart({});
    setCallId(null);
    setCall(null);
    setError(null);
    setConsent(false);
    setLimited(usedBefore());
  }

  return (
    <article
      className="relative flex flex-col items-stretch overflow-hidden bg-white md:flex-row md:items-center md:justify-between"
      style={{ borderRadius: 37, boxShadow: SUBTLE, padding: "clamp(10px, 2.6vw, 20px)", gap: 20, minHeight: 570 }}
    >
      {/* Left column: what this is. */}
      <div className="flex flex-1 flex-col font-display md:pl-7" style={{ gap: 12, color: INK, maxWidth: 640 }}>
        {/* Matches PER_NUMBER_DAILY_CAP=1 on voice-server — keep the two in step. */}
        <p className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: "0.14em", color: MUTED }}>
          Live experiment · 1 call per visitor
        </p>
        {/* Wide enough to sit on one line when there's room; balanced if it
            has to wrap, so it never leaves "you?" alone on line two. */}
        <h3 style={{ fontSize: 24, fontWeight: 600, lineHeight: "normal", textWrap: "balance" }}>Can an interface make the phone call for you?</h3>
        <p style={{ fontSize: 16, fontWeight: 400, lineHeight: "normal", maxWidth: 483 }}>
          Place a pickup order, then play the restaurant. The AI agent will call your phone, place the order with you,
          and bring the conversation back to the screen in real time.
        </p>
      </div>

      {/* Right panel: the chat. */}
      <div
        className="relative w-full shrink-0 overflow-hidden font-display"
        // 530 tall as designed; on a phone it grows rather than clipping the form.
        // During the call it's held at 530 so a long transcript scrolls
        // inside it instead of stretching the card.
        style={{ ...(step === "call" ? { height: 530 } : { minHeight: 530 }), maxWidth: 565, borderRadius: 32, background: "#f8f8f8" }}
      >
        {/* The blue glow at the top of every frame. */}
        <div aria-hidden className="pointer-events-none absolute" style={{ left: 0, right: 0, top: -271, height: 396 }}>
          <div className="absolute" style={{ inset: "-75.76% -53.1%" }}>
            <img alt="" src={`${ASSET}/glow.svg`} className="block size-full" style={{ maxWidth: "none" }} />
          </div>
        </div>

        {step !== "start" && (
          <button
            type="button"
            onClick={reset}
            aria-label="Start over"
            className="absolute z-10 flex cursor-pointer items-center justify-center bg-white transition hover:opacity-80"
            style={{ top: 20, right: 20, width: 41, height: 41, borderRadius: 12 }}
          >
            <img alt="" src={`${ASSET}/rotate-cw.svg`} width={20} height={20} />
          </button>
        )}

        <div className="relative flex flex-col" style={{ padding: "clamp(12px, 2.6vw, 20px)", ...(step === "call" ? { height: "100%" } : { minHeight: 530 }) }}>
          {step === "start" && (
            <div className="mt-auto flex flex-col items-start" style={{ gap: 24 }}>
              <Bubble from="ai">Hi! Want to order pickup from A&amp;W?</Bubble>
              <button type="button" onClick={() => setStep("menu")} className={`w-full ${PILL_CLASS}`} style={PILL}>
                Start ordering
              </button>
            </div>
          )}

          {step === "menu" && (
            <div className="mt-auto flex flex-col items-start" style={{ gap: 24 }}>
              <Bubble from="ai">What would you like to order?</Bubble>
              <div className="flex w-full flex-col" style={{ gap: 12 }}>
                <Sheet gap={16}>
                  {MENU.map((m) => (
                    <div key={m.id} className="flex items-center justify-between" style={{ gap: 12 }}>
                      <Item item={m} />
                      {cart[m.id] ? (
                        <div className="flex shrink-0 items-center justify-between" style={{ width: 87 }}>
                          <IconButton src="minus" label={`One less ${m.name}`} onClick={() => less(m.id)} />
                          <span style={{ fontSize: 16, fontWeight: 500, color: "#000" }}>{cart[m.id]}</span>
                          <IconButton src="plus" label={`One more ${m.name}`} onClick={() => add(m.id)} />
                        </div>
                      ) : (
                        <IconButton src="plus" label={`Add ${m.name}`} onClick={() => add(m.id)} />
                      )}
                    </div>
                  ))}
                </Sheet>
                <div className="flex items-center justify-between" style={{ gap: 16 }}>
                  {count > 0 && (
                    <span
                      className="flex shrink-0 items-center justify-center bg-white"
                      style={{ height: 54, borderRadius: 100, paddingInline: 12.5, fontSize: 16, color: INK }}
                    >
                      {count} {count === 1 ? "item" : "items"} • ${total.toFixed(2)}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={!count}
                    onClick={() => setStep("phone")}
                    className={`flex-1 ${pill(count > 0)}`}
                    style={{ ...PILL, fontWeight: 500 }}
                  >
                    Confirm order
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "phone" && (
            // Anchored to the bottom like the other steps; the 61px floor keeps
            // a long order clear of the reset button.
            <div className="flex flex-col" style={{ marginTop: "auto", paddingTop: 61, gap: 12 }}>
              {limited ? (
                <UsedUp phone={phone} />
              ) : (
              <>
              <Sheet gap={24}>
                {picked.map((m) => (
                  <div key={m.id} className="flex items-center justify-between" style={{ gap: 12 }}>
                    <Item item={m} qty={cart[m.id]} />
                    <button
                      type="button"
                      onClick={() => drop(m.id)}
                      className="shrink-0 cursor-pointer transition hover:opacity-70"
                      style={{ fontSize: 16, fontWeight: 500, color: MUTED }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex flex-col" style={{ gap: 12 }}>
                  <div style={{ fontSize: 14 }}>
                    <p style={{ color: INK }}>Now, play the restaurant.</p>
                    <p style={{ color: MUTED }}>Enter your number and the agent will call you to place the order you just created.</p>
                  </div>
                  <div className="flex" style={{ gap: 12 }}>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-label="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(778)-123-1234"
                      className="min-w-0 outline-none"
                      style={{ ...FIELD, flex: "299 1 0" }}
                    />
                    <input
                      type="text"
                      autoComplete="given-name"
                      aria-label="Your first name"
                      maxLength={20}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex"
                      className="min-w-0 outline-none"
                      style={{ ...FIELD, flex: "182 1 0" }}
                    />
                  </div>
                  <label className="flex cursor-pointer items-center" style={{ gap: 6, fontSize: 12, color: MUTED }}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className="flex shrink-0 items-center justify-center"
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: 4,
                        background: consent ? BLUE : "#fff",
                        boxShadow: consent ? "none" : "inset 0 0 0 1px #d9d9d9",
                      }}
                    >
                      {consent && <img alt="" src={`${ASSET}/check.svg`} width={13} height={13} />}
                    </span>
                    This is my number, and I agree to get one call from an AI agent for this demo
                  </label>
                  {error && <p style={{ fontSize: 12, color: "#d64545" }}>{error}</p>}
                </div>
              </Sheet>
              <button
                type="button"
                disabled={!phone || !name.trim() || !consent || sending}
                onClick={placeCall}
                className={`w-full ${pill(!!phone && !!name.trim() && consent && !sending)}`}
                style={{ ...PILL, fontWeight: 500 }}
              >
                {sending ? (awake ? "Calling…" : "Waking up the line…") : "Call me"}
              </button>
              </>
              )}
              {/* TEMP-DEV: see simulateCall(). Neither button renders outside development. */}
              {process.env.NODE_ENV === "development" && (
                <div className="flex justify-center" style={{ gap: 16 }}>
                  {!limited && (
                    <button type="button" onClick={simulateCall} className="underline underline-offset-4 transition hover:opacity-70" style={{ fontSize: 13, color: MUTED }}>
                      Simulate call
                    </button>
                  )}
                  <button type="button" onClick={() => setLimited((l) => !l)} className="underline underline-offset-4 transition hover:opacity-70" style={{ fontSize: 13, color: MUTED }}>
                    {limited ? "Back to the form" : "Simulate limit reached"}
                  </button>
                  <span style={{ fontSize: 13, color: "#b0b0b0" }}>(dev only, no real call)</span>
                </div>
              )}
            </div>
          )}

          {step === "call" && <CallView call={call} transcriptRef={transcriptRef} />}
        </div>

        {/* 4. Celebrate a placed order. Sits over the panel, never blocks it. */}
        {call?.outcome === "order_completed" && <Confetti />}
      </div>
    </article>
  );
}

/* ── Call screen ───────────────────────────────────────────────────────── */

function CallView({
  call,
  transcriptRef,
}: {
  call: CallState | null;
  transcriptRef: React.RefObject<HTMLDivElement | null>;
}) {
  const lines = call?.transcript ?? [];
  const ended = !!call && (!!call.outcome || DONE.has(call.twilioStatus ?? ""));
  // Picked up: Twilio says in-progress, the agent's session is connected, or
  // the conversation has started.
  const live = !ended && (call?.twilioStatus === "in-progress" || call?.status === "connected" || lines.length > 0);

  // [headline, optional second line]
  let status: [string, string?] | null = ["Calling you as the restaurant…"];
  if (call?.twilioStatus === "ringing") status = ["Your phone should be ringing.", "Pick up. You’re the restaurant now."];
  if (live) status = ["Order in progress"];
  if (call?.twilioStatus === "no-answer") status = ["No answer"];
  if (call?.twilioStatus === "busy") status = ["Line busy"];
  if (call?.twilioStatus === "failed") status = ["Call couldn't connect"];
  if (call?.outcome) status = [call.outcome === "order_completed" ? `Order placed${call.eta ? ` · pickup ${call.eta}` : ""}` : "Call ended"];

  const statusLine = status && (
    <div className="flex items-start" style={{ gap: 16 }} aria-live="polite">
      <BlinkDot live={!ended} />
      <div className="flex flex-col" style={{ gap: 4 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: MUTED }}>{status[0]}</p>
        {status[1] && <p style={{ fontSize: 14, color: MUTED }}>{status[1]}</p>}
      </div>
    </div>
  );

  return (
    <div ref={transcriptRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto" style={{ marginTop: 69, gap: 16, paddingBottom: 4, paddingRight: 6, scrollbarWidth: "thin" }}>
      {/* While live the status heads the transcript; once over it closes it. */}
      {!ended && statusLine}
      {lines.map((l, i) => (
        <Bubble key={i} from={l.role === "ai" ? "ai" : "you"}>
          {l.text}
        </Bubble>
      ))}
      {ended && statusLine}
    </div>
  );
}

/* ── Pieces ────────────────────────────────────────────────────────────── */

/** Out of attempts: a friendly nudge to ask for another go instead of an error. */
function UsedUp({ phone }: { phone: string }) {
  const { copied, copy } = useCopyEmail();
  const body = [
    "Hi Siya,",
    "",
    "I tried the AI phone ordering demo on your portfolio and would love another go.",
    `My number: ${phone || "(the number I used)"}`,
  ].join("\n");
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent("Another try at the AI phone ordering demo")}&body=${encodeURIComponent(body)}`;
  return (
    <div className="flex flex-col items-start" style={{ gap: 24 }}>
      <Bubble from="ai">
        That&rsquo;s your one call for this demo. Want another go? Ask Siya and I&rsquo;ll call you again.
      </Bubble>
      <div className="flex w-full flex-col items-center" style={{ gap: 12 }}>
        <a href={href} className={`flex w-full items-center justify-center ${PILL_CLASS}`} style={{ ...PILL, fontWeight: 500 }}>
          Email Siya for another try
        </a>
        {/* mailto needs a mail app; without one (private windows, no handler)
            the click does nothing, so the address can be copied too — the
            same fallback the password gate uses. */}
        <p style={{ fontSize: 12, color: MUTED }}>
          You&rsquo;ll get a reply with a fresh attempt. No mail app?{" "}
          <button type="button" onClick={copy} className="underline underline-offset-4 transition hover:text-[#202020]">
            {copied ? "Email copied!" : "Copy my email"}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? `${EMAIL} copied to clipboard` : ""}
          </span>
        </p>
      </div>
    </div>
  );
}

/** The status dot: breathes in and out while the call is live, settles when it's over. */
function BlinkDot({ live }: { live: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.img
      alt=""
      src={`${ASSET}/status-dot.svg`}
      width={12}
      height={12}
      style={{ marginTop: 4 }}
      initial={false}
      animate={live && !reduced ? { opacity: [1, 0.25, 1] } : { opacity: live ? 1 : 0.4 }}
      transition={live && !reduced ? { duration: 1.6, ease: "easeInOut", repeat: Infinity } : { duration: 0.3 }}
    />
  );
}

// The LottieFiles "Confetti Effects" palette: red, pink, cyan, teal.
const CONFETTI_COLORS = ["#e8393b", "#ff8fbf", "#22d3ee", "#5fb08f"];
type Shape = "square" | "star" | "dot" | "strip";
const SHAPES: Shape[] = ["square", "star", "dot", "strip"];

type Piece = {
  x: number; y: number; vx: number; vy: number;
  size: number; shape: Shape; color: string;
  spin: number; angle: number;   // rotation in the plane
  flip: number; flipSpeed: number; // tumbling end over end
  wobble: number; wobbleSpeed: number; // side-to-side flutter
  life: number;
};

function drawStar(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Two pops of confetti, after the LottieFiles "Confetti Effects" animation.
 * Simulated rather than keyframed, so it moves like paper: each piece is
 * launched up and out, slowed by air drag, pulled down by gravity, and while
 * it falls it flutters side to side and tumbles (squashing as it flips edge-on).
 * One canvas, one rAF loop; stops itself when every piece has faded.
 */
function Confetti() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pieces: Piece[] = [];
    const pop = (ox: number, delayFrames: number) => {
      for (let i = 0; i < 40; i++) {
        const angle = rand(-Math.PI * 0.82, -Math.PI * 0.18); // fan upward
        const speed = rand(11, 21);
        pieces.push({
          x: ox, y: h * 0.8,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          size: rand(5, 9),
          shape: SHAPES[i % SHAPES.length],
          color: CONFETTI_COLORS[(i * 7 + delayFrames) % CONFETTI_COLORS.length],
          angle: rand(0, Math.PI * 2), spin: rand(-0.15, 0.15),
          flip: rand(0, Math.PI * 2), flipSpeed: rand(0.08, 0.22),
          wobble: rand(0, Math.PI * 2), wobbleSpeed: rand(0.05, 0.12),
          life: -delayFrames, // negative = not launched yet
        });
      }
    };
    pop(w * 0.3, 0);
    pop(w * 0.7, 10); // ~0.17s later

    const GRAVITY = 0.28;
    const DRAG = 0.965;          // air resistance on the launch
    const TERMINAL = 3.2;        // paper doesn't fall fast
    const LIFE = 150;            // frames (~2.5s at 60fps)
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // Frame-rate independent: step in 60fps units.
      const k = Math.min((now - last) / 16.67, 3);
      last = now;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of pieces) {
        p.life += k;
        if (p.life < 0) { alive++; continue; }
        if (p.life > LIFE) continue;
        alive++;
        p.vx *= Math.pow(DRAG, k);
        p.vy = Math.min(p.vy * Math.pow(DRAG, k) + GRAVITY * k, TERMINAL);
        p.wobble += p.wobbleSpeed * k;
        p.flip += p.flipSpeed * k;
        p.angle += p.spin * k;
        // Flutter grows as the launch speed bleeds off.
        const sway = Math.sin(p.wobble) * (1.2 - Math.min(Math.abs(p.vy) / 15, 1));
        p.x += (p.vx + sway) * k;
        p.y += p.vy * k;

        const fade = p.life > LIFE - 40 ? (LIFE - p.life) / 40 : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(fade, 0);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(1, Math.cos(p.flip)); // tumbling: squashes flat as it turns edge-on
        const s = p.size;
        if (p.shape === "dot") { ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.fill(); }
        else if (p.shape === "star") drawStar(ctx, s * 0.7);
        else if (p.shape === "strip") ctx.fillRect(-1.5, -s * 0.8, 3, s * 1.6);
        else ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) return null;
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full" />;
}

const FIELD: CSSProperties = {
  height: 48,
  borderRadius: 8,
  border: "1px solid #d9d9d9",
  paddingLeft: 16,
  fontSize: 14,
  color: INK,
  background: "#fff",
};

/** Agent bubbles sit left in white; the visitor's (as the restaurant) sit right in blue. */
function Bubble({ from, children }: { from: "ai" | "you"; children: ReactNode }) {
  const ai = from === "ai";
  return (
    <p
      style={{
        alignSelf: ai ? "flex-start" : "flex-end",
        maxWidth: ai ? 404 : "80%",
        padding: "12px 16px",
        borderRadius: ai ? "2px 14px 14px 14px" : "14px 14px 2px 14px",
        background: ai ? "#fff" : BLUE,
        color: ai ? "#000" : "#fff",
        filter: LIFT,
        fontSize: 16,
        lineHeight: "normal",
      }}
    >
      {children}
    </p>
  );
}

/** The white rounded sheet that holds menu rows and the call form. */
function Sheet({ gap, children }: { gap: number; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col bg-white" style={{ padding: "clamp(12px, 2vw, 16px)", gap, borderRadius: 20, filter: LIFT }}>
      {children}
    </div>
  );
}

/** Thumbnail, name and price; `qty` adds the blue count badge from the confirm frame. */
function Item({ item, qty }: { item: (typeof MENU)[number]; qty?: number }) {
  return (
    <div className="flex min-w-0 items-center" style={{ gap: 16 }}>
      <span className="relative shrink-0" style={{ width: qty ? 54 : 42, height: 42 }}>
        <Image
          src={item.img}
          alt=""
          width={42}
          height={42}
          sizes="42px"
          className="object-cover"
          style={{ width: 42, height: 42, borderRadius: 8, boxShadow: SUBTLE }}
        />
        {qty ? (
          <span
            className="absolute flex items-center justify-center"
            style={{ left: 30, top: 17, width: 24, height: 24, borderRadius: 12, background: BLUE, color: "#fff", fontSize: 14, fontWeight: 500 }}
          >
            {qty}
          </span>
        ) : null}
      </span>
      <div className="flex min-w-0 flex-col justify-between whitespace-nowrap" style={{ height: 42, fontWeight: 500 }}>
        {/* truncate clips at the line box, which slices descenders ("g");
            the padding grows the paint box, the margin hands the space back. */}
        <span className="truncate" style={{ fontSize: 16, color: INK, paddingBottom: 3, marginBottom: -3 }}>
          {item.name}
        </span>
        <span style={{ fontSize: 14, color: MUTED }}>${item.price.toFixed(2)}</span>
      </div>
    </div>
  );
}

function IconButton({ src, label, onClick }: { src: "plus" | "minus"; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="shrink-0 cursor-pointer transition hover:opacity-80" style={{ width: 24, height: 24 }}>
      <img alt="" src={`${ASSET}/${src}.svg`} width={24} height={24} />
    </button>
  );
}
