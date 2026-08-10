/**
 * The receipt shape, inlined from Figma.
 *
 * The torn bottom edge is a real path, not a mask — Figma's export URLs expire
 * after a week, so the geometry lives here. The artwork sits inset 9px inside
 * its own viewBox to leave room for the soft drop shadow.
 */

export const BILL_W = 380;
export const BILL_H = 475.222;

export default function Bill() {
  return (
    <svg
      width={BILL_W}
      height={BILL_H}
      viewBox="0 0 380 475.222"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <g filter="url(#cashback-bill-shadow)">
        <path
          d="M9 27C9 17.0589 17.0589 9 27 9H353C362.941 9 371 17.0589 371 27V437.844C371 451.696 356.009 460.357 344.009 453.438L334.741 448.094C329.176 444.886 322.324 444.886 316.759 448.094L289.491 463.816C283.926 467.025 277.074 467.025 271.509 463.816L244.241 448.094C238.676 444.886 231.824 444.886 226.259 448.094L198.991 463.816C193.426 467.025 186.574 467.025 181.009 463.816L153.741 448.094C148.176 444.886 141.324 444.886 135.759 448.094L108.491 463.816C102.926 467.025 96.0737 467.025 90.5092 463.816L63.2408 448.094C57.6763 444.886 50.8237 444.886 45.2592 448.094L35.9908 453.438C23.9908 460.357 9 451.696 9 437.844V27Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="cashback-bill-shadow"
          x="0"
          y="0"
          width="380"
          height="475.222"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology radius="6" operator="erode" in="SourceAlpha" result="eroded" />
          <feOffset />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="shadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="shadow" />
        </filter>
      </defs>
    </svg>
  );
}
