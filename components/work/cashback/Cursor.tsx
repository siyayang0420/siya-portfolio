/**
 * The chunky 3D pointer from the Figma flow, inlined rather than linked.
 *
 * Figma's exported asset URLs expire after a week, so the polygon and its two
 * inner shadows (dark from the top-right, white from the bottom-left — that
 * pairing is what makes it read as extruded) live here as markup.
 *
 * Positioning contract: the artwork's apex sits at the top-centre of the box,
 * and the -30° rotation uses `transform-origin: 50% 0`, which is that exact
 * point. So the apex is a fixed anchor — place the box at `left: tipX - w/2,
 * top: tipY` and the pointer tip lands on (tipX, tipY) whatever the rotation.
 */

/** Natural aspect of the artwork, used to derive height from width. */
export const CURSOR_RATIO = 136.454 / 135.278;

export default function Cursor({ width = 132 }: { width?: number }) {
  return (
    <svg
      width={width}
      height={width * CURSOR_RATIO}
      viewBox="0 0 135.278 136.454"
      fill="none"
      aria-hidden
      style={{ display: "block", transform: "rotate(-30deg)", transformOrigin: "50% 0" }}
    >
      <g filter="url(#cashback-cursor-bevel)">
        <path
          d="M54.1915 8.3544C59.6963 -2.78482 75.5817 -2.78479 81.0865 8.35443L133.666 114.75C139.951 127.468 126.704 140.997 113.857 134.98L74.0008 116.314C69.9697 114.427 65.3083 114.427 61.2772 116.314L21.4214 134.98C8.5744 140.997 -4.67291 127.468 1.61208 114.75L54.1915 8.3544Z"
          fill="#565656"
        />
      </g>
      <defs>
        <filter
          id="cashback-cursor-bevel"
          x="-3"
          y="-12"
          width="152.278"
          height="152.454"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="14" dy="-12" />
          <feGaussianBlur stdDeviation="15.55" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0" />
          <feBlend mode="normal" in2="shape" result="innerDark" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-3" dy="4" />
          <feGaussianBlur stdDeviation="5.2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
          <feBlend mode="normal" in2="innerDark" />
        </filter>
      </defs>
    </svg>
  );
}
