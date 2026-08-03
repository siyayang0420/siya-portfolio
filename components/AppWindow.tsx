"use client";

import {
  Blocks,
  Check,
  ExternalLink,
  Globe,
  Puzzle,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";

const sidebarNav = [
  { icon: Search, label: "Search" },
  { icon: Puzzle, label: "Integrations" },
  { icon: Workflow, label: "Workflows" },
  { icon: Sparkles, label: "Skills" },
  { icon: Blocks, label: "Marketplace" },
];

const recent = [
  "Infrastructure migration",
  "Onboarding rewrite",
  "Q3 partner update",
  "Notification spec",
  "Research: pricing tiers",
  "Deployment postmortem",
  "Roadmap refresh",
  "Market trend analysis",
];

const results = [
  { title: "Single sign-on for teams", host: "example.com" },
  { title: "Enterprise SSO overview", host: "docs.example.com" },
  { title: "SAML vs. OIDC in practice", host: "notes.example.dev" },
  { title: "Directory sync, explained", host: "example.io" },
  { title: "Rolling out SSO without downtime", host: "blog.example.com" },
];

/**
 * A stand-in product window: dark chrome, sidebar, and an agent thread mid-task.
 * Tilted slightly so it reads as a screenshot rather than a live UI.
 */
export default function AppWindow() {
  return (
    <div className="[perspective:2200px]">
      <div className="overflow-hidden rounded-t-2xl bg-[#0d0d0f] ring-1 ring-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)] [transform:rotateX(6deg)] [transform-origin:top_center]">
        <div className="flex h-[30rem] text-[13px] sm:h-[34rem]">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 flex-col border-r border-white/8 bg-white/[0.02] p-3 sm:flex">
            <ul className="space-y-0.5">
              {sidebarNav.map((n) => (
                <li key={n.label}>
                  <span className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-white/60">
                    <n.icon className="size-3.5" strokeWidth={1.8} />
                    {n.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-4 border-b border-white/8 px-2.5 pb-2 text-[12px]">
              <span className="border-b-2 border-[#7c6cff] pb-1.5 text-white">
                Chats
              </span>
              <span className="pb-1.5 text-white/40">Messages</span>
              <span className="pb-1.5 text-white/40">Slack</span>
            </div>

            <ul className="mt-3 space-y-2.5 overflow-hidden px-2.5">
              {recent.map((r) => (
                <li key={r} className="truncate text-white/45">
                  {r}
                </li>
              ))}
            </ul>
          </aside>

          {/* Thread */}
          <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-7">
            <div className="ml-auto max-w-md rounded-2xl bg-white/8 px-4 py-3 text-white/85 ring-1 ring-white/10">
              Compare the main SSO providers, note what each one charges, and
              drop a summary in the team channel.
            </div>

            <div className="mt-6 space-y-2.5 text-white/45">
              <p className="flex items-center gap-2">
                <Sparkles className="size-3.5" /> Working on it…
              </p>
              <p className="flex items-center gap-2">
                <Check className="size-3.5 text-white/60" /> Narrowed to five
                providers
              </p>
              <p className="flex items-center gap-2">
                <Globe className="size-3.5" /> Searching the web…
              </p>
            </div>

            <div className="mt-4 max-w-lg rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5 text-white/70">
                <Globe className="size-3.5" />
                <span className="text-white/90">Web search</span>
                <span className="text-white/40">— SSO providers</span>
              </div>
              <ul className="divide-y divide-white/6">
                {results.map((r) => (
                  <li
                    key={r.title}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="size-1.5 rounded-full bg-[#7c6cff]" />
                    <div className="min-w-0">
                      <p className="truncate text-white/85">{r.title}</p>
                      <p className="text-[11px] text-white/35">{r.host}</p>
                    </div>
                    <ExternalLink className="ml-auto size-3 shrink-0 text-white/25" />
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-4 py-2 text-[11px] text-white/35">
                <span>1 of 2</span>
                <span className="font-mono">‹ 1 / 2 ›</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
