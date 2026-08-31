/**
 * The night a campaign ended in three places at three different times.
 *
 * The subject of this figure is the *space between* the marks, not the marks
 * themselves — the backend stopped honouring the coupon before the banner
 * advertising it came down, and anyone who paid in between fell through. So
 * the timeline is drawn to make that overlap the object: three ticks on one
 * rule, and a bracket under the first two carrying the label.
 *
 * The consequence runs vertically underneath as a spine, deliberately a
 * different axis from the timeline above it. Horizontal is clock time;
 * vertical is what followed. Reusing one axis for both would flatten cause
 * into chronology.
 *
 * House vocabulary: white card, hairline insets, dashed neutral-300 for
 * anything connective, ink only on the marks and the copy. No colour — the
 * failure is legible from the words.
 */

const EVENTS = [
  { time: '11:55 PM', label: 'Backend coupon turned off' },
  { time: '11:59 PM', label: 'Campaign banner removed' },
  { time: '12:00 AM', label: 'Scheduled campaign end' },
];

const CONSEQUENCE = [
  'Customer transacted during the gap',
  'Coupon not applied',
  'Support contacted the customer',
  'Compensation issued',
];

const DASH = 'border-dashed border-neutral-300';

/**
 * Rail segment for one column of a 3-up grid: runs from its own centre and
 * overhangs 6px, half the 12px gap, so the three meet without arithmetic.
 * Same technique as BravoRewardStack — a gapless grid would not share centres
 * with the gapped one the labels sit in.
 */
const SEGMENT = ['left-1/2 -right-1.5', '-left-1.5 -right-1.5', '-left-1.5 right-1/2'];

export function BravoCampaignGap() {
  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
        <span className="text-[12px] text-muted">Campaign end date</span>

        <div className="flex flex-col">
          {/* Timestamps */}
          <div className="grid grid-cols-3 gap-3">
            {EVENTS.map((e) => (
              <span key={e.time} className="text-center text-[12px] text-ink tabular-nums">
                {e.time}
              </span>
            ))}
          </div>

          {/* The rule, with a tick at each column centre. */}
          <div aria-hidden className="grid grid-cols-3 gap-3 h-6">
            {EVENTS.map((e, i) => (
              <div key={e.time} className="relative">
                <span
                  className={`absolute top-1/2 border-t border-neutral-300 ${SEGMENT[i]}`}
                />
                <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
              </div>
            ))}
          </div>

          {/* Labels */}
          <div className="grid grid-cols-3 gap-3">
            {EVENTS.map((e) => (
              <span key={e.time} className="text-center text-[14px] text-muted">
                {e.label}
              </span>
            ))}
          </div>

          {/* The bracket spans the FIRST TWO ticks only — 11:55 to 11:59 — not
              the whole run. That is the window the label describes: the coupon
              was already off while the banner was still up. Bracketing all
              three would claim a five-minute overlap the timeline doesn't
              show, since the banner came down a minute before midnight. */}
          <div aria-hidden className="grid grid-cols-3 gap-3 h-4 mt-1.5">
            {EVENTS.map((e, i) => (
              <div key={e.time} className="relative">
                {i < 2 && (
                  <>
                    <span
                      className={`absolute bottom-0 border-t ${DASH} ${
                        i === 0 ? 'left-1/2 -right-1.5' : '-left-1.5 right-1/2'
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 h-2 w-0 border-l ${DASH} ${
                        i === 0 ? 'left-1/2' : 'right-1/2'
                      }`}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          {/* Centred across the first two columns so it sits under its own
              bracket rather than under the whole timeline. */}
          <div className="grid grid-cols-3 gap-3">
            <p className="col-span-2 text-center text-[14px] font-medium text-ink">
              4 minutes where the campaign was still visible,<br></br> but the coupon was
              already off
            </p>
          </div>
        </div>

        {/* What followed, on the other axis. */}
        <ol className="flex flex-col border-t border-line pt-4">
          {CONSEQUENCE.map((step, i) => {
            const last = i === CONSEQUENCE.length - 1;
            return (
              <li key={step} className={`relative flex gap-3 ${last ? '' : 'pb-3'}`}>
                {!last && (
                  <span
                    aria-hidden
                    className={`absolute left-[2.5px] top-3 bottom-0 w-0 border-l ${DASH}`}
                  />
                )}
                <span
                  aria-hidden
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                    last ? 'bg-ink' : 'bg-neutral-300'
                  }`}
                />
                <span className={`text-[14px] ${last ? 'font-medium text-ink' : 'text-ink'}`}>
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <figcaption className="text-[12px] text-muted">
        One campaign, but its customer-facing and backend states had to be managed separately.
      </figcaption>
    </figure>
  );
}
