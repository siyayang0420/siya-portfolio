const PARTNERS = [
  {
    name: 'Restaurant A',
    shape: 'Flat rate, always on',
    pills: [{ w: 72, solid: true }],
  },
  {
    name: 'Restaurant B',
    shape: 'Unlocks past a spend threshold',
    pills: [
      { w: 20, solid: false },
      { w: 44, solid: true },
    ],
  },
  {
    name: 'Restaurant C',
    shape: 'Only during set hours',
    pills: [
      { w: 16, solid: false },
      { w: 16, solid: true },
      { w: 16, solid: false },
    ],
  },
];

export function BravoTwoSides() {
  return (
    <figure className="flex flex-col m-0">
      {/* The question now leads. It used to sit at the bottom, which meant the
          figure showed its answer and then asked what the answer should be —
          asking first turns the two cards below into the reply. */}
      <div className="bg-white rounded-xl px-5 py-4 text-center">
        <span className="text-[16px] font-medium text-ink">
          Where should the complexity live?
        </span>
      </div>
      <div className="flex justify-center" aria-hidden="true">
        <span className="w-px h-6 bg-neutral-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Business side — one differently-shaped campaign per partner */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] text-muted">
              Behind the experience
            </span>
            <span className="text-[14px] font-semibold text-ink">
              Keep the campaign flexibility
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="border border-line rounded-lg px-4 py-3 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[14px] font-medium text-ink">
                    {p.name}
                  </span>
                  <span className="text-[12px] text-muted">{p.shape}</span>
                </div>
                <div
                  className="flex items-center gap-1.5 shrink-0"
                  aria-hidden="true"
                >
                  {p.pills.map((pill, i) => (
                    <span
                      key={i}
                      className={`h-2 rounded-full ${
                        pill.solid ? 'bg-ink' : 'bg-neutral-300'
                      }`}
                      style={{ width: pill.w }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User side — one familiar offer card */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] text-muted">
              Customer-facing
            </span>
            <span className="text-[14px] font-semibold text-ink">
              Keep the reward model consistent
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center py-2">
            <div
              className="w-full max-w-[260px] border border-line rounded-xl p-4 flex flex-col gap-3"
              aria-hidden="true"
            >
              <div className="flex items-center gap-3">
                <span className="size-9 rounded-full bg-ink text-white text-[11px] font-medium flex items-center justify-center shrink-0">
                  %
                </span>
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="h-2 w-3/4 rounded-full bg-neutral-300" />
                  <span className="h-2 w-1/2 rounded-full bg-neutral-200" />
                </div>
              </div>
              <span className="h-2 w-full rounded-full bg-neutral-200" />
            </div>
          </div>
          <span className="text-[12px] text-muted text-center">
            Same reward language
          </span>
        </div>
      </div>

      {/* Both sides converge on the answer */}
      <div className="flex justify-center" aria-hidden="true">
        <span className="w-px h-6 bg-neutral-300" />
      </div>
      <div className="bg-white rounded-xl px-5 py-4 flex flex-col items-center gap-1 text-center">
        <span className="text-[16px] font-medium text-ink">
          Different rules underneath. One consistent reward model for customers.
        </span>
        <span className="text-[14px] text-muted">The same payment moment</span>
      </div>
      <figcaption className="sr-only">
        Asking where the complexity should live: each restaurant partner needs a
        differently shaped campaign, while the user needs one familiar offer
        card. The answer is different rules underneath and one consistent reward
        model for customers, both meeting at the same payment moment.
      </figcaption>
    </figure>
  );
}
