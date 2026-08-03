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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Business side — one differently-shaped campaign per partner */}
        <div className="bg-white rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] text-muted">
              What the business needs
            </span>
            <span className="text-[14px] text-ink">
              A different campaign shape per partner
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
              What the user needs
            </span>
            <span className="text-[14px] text-ink">
              One familiar surface. Zero math.
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
            The same offer card — every restaurant, every visit
          </span>
        </div>
      </div>

      {/* Both sides converge on the same moment */}
      <div className="flex justify-center" aria-hidden="true">
        <span className="w-px h-6 bg-neutral-300" />
      </div>
      <div className="bg-white rounded-xl px-5 py-4 flex flex-col items-center gap-1 text-center">
        <span className="text-[12px] text-muted font-medium">
          The same payment moment
        </span>
        <span className="text-[14px] text-ink">
          Where should the complexity live?
        </span>
      </div>
      <figcaption className="sr-only">
        Each restaurant partner needs a differently shaped campaign, while the
        user needs one familiar offer card. Both sides meet at the same payment
        moment, raising the question of where the complexity should live.
      </figcaption>
    </figure>
  );
}
