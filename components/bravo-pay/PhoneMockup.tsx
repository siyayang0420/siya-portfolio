import type { ReactNode } from "react";

const A = "/work/bravo-pay/iphone/";

/*
 * iPhone mockup (Figma node 5794:2375), ported from bravo-landing. Each layer
 * keeps its exact Figma placement as % of the 344 × 708.878 art box, back to
 * front. [left%, top%, width%, height%]
 */
const LAYERS: { src: string; pos: [number, number, number, number]; blend?: "screen" | "multiply" }[] = [
  { src: "frame.svg", pos: [0.814, 0, 98.708, 100] },
  { src: "reflect-top.svg", pos: [4.544, 0.01, 94.685, 7.779], blend: "screen" },
  { src: "bezel.svg", pos: [2.105, 0.626, 96.126, 98.749] },
  { src: "reflect-bot.svg", pos: [4.544, 92.212, 94.685, 7.779], blend: "screen" },
  { src: "btn-right.svg", pos: [99.52, 20.919, 0.478, 10.698] },
  { src: "btn-left1.svg", pos: [0, 20.919, 0.818, 7.193] },
  { src: "btn-left2.svg", pos: [0, 29.935, 0.818, 7.191] },
  { src: "btn-mute.svg", pos: [0, 12.406, 0.818, 3.905] },
  { src: "line-bot.svg", pos: [44.413, 99.822, 11.519, 0.17] },
  { src: "island.svg", pos: [37.494, 2.03, 25.016, 3.515] },
  { src: "cam-outer.svg", pos: [56.302, 3.018, 3.167, 1.537] },
  { src: "cam-lens.png", pos: [56.378, 3.062, 3.188, 1.547] },
  { src: "cam-ring.svg", pos: [56.982, 3.348, 1.807, 0.877] },
  { src: "cam-in1.svg", pos: [57.093, 3.404, 1.584, 0.769] },
  { src: "cam-in2.svg", pos: [57.093, 3.404, 1.584, 0.769], blend: "multiply" },
  { src: "cam-glint.svg", pos: [58.041, 3.851, 0.563, 0.273], blend: "screen" },
];

/* role="img" collapses the fake app chrome to one described image for
   assistive tech, so callers pass an aria-label. */
export default function PhoneMockup({
  children,
  className = "",
  style,
  ...props
}: {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  "aria-label": string;
}) {
  return (
    <div className={`phone-mockup ${className}`.trim()} role="img" style={style} {...props}>
      {children}
      {LAYERS.map(({ src, pos: [l, t, w, h], blend }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          className="phone-mockup__layer"
          src={A + src}
          alt=""
          decoding="async"
          style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%`, mixBlendMode: blend }}
        />
      ))}
    </div>
  );
}
