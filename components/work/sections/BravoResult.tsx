export function BravoResult() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] text-ink">The Outcome</p>
        <h2 className="text-[24px] font-semibold text-ink">
          The system no longer needed as much explaining.
        </h2>
      </div>

      {/* The "support questions became rare" result closes this act, in the
          last paragraph. It was also made here, two paragraphs earlier, which
          spent the finding before the section had finished setting it up. */}
      <p className="text-[16px] text-ink">
        Earlier, “So how much do I actually save?” meant explaining points,
        coupons, thresholds, top-up bonuses, and how they worked together.
      </p>

      <p className="text-[16px] text-ink">
        The new system kept the campaign flexibility, but gave customers one reward to understand. They might earn cashback from a first purchase, a spending milestone, repeat visits, or a happy hour promotion — but the value stayed consistent: $1 cashback = $1.
      </p>

      <p className="text-[16px] text-ink">
        After launch, customer support reported that questions and calls about how savings worked became rare. Marketing also found the model easier to set up and explain across different campaigns.
      </p>
    </div>
  );
}
