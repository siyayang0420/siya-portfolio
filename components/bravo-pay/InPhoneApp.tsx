"use client";

import { useEffect, useRef, useState } from "react";
import PhoneAiScreen from "./PhoneAiScreen";

const DESIGN_W = 402;

/** Same glass-scaling as bravo-landing's usePhoneScreenScale: the screen is
    authored at 402px and scaled to the phone, so every label stays real text. */
function useScreenScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 0, frameH: 874 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const scale = e.contentRect.width / DESIGN_W;
      if (scale) setBox({ scale, frameH: e.contentRect.height / scale });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, ...box };
}

export type PhoneState = {
  bubble: number;
  thinking: number;
  kb: number; // 1 = keyboard up
  answer: number[];
  micPress: number;
  recording: boolean;
  sendPress: number;
  bubble2: number;
  thinking2: number;
  /** the hero clock, in ms — the pay sheet runs its own steps off it */
  t: number;
};

/**
 * bravo AI inside the phone glass, driven by a timeline the parent owns (on
 * bravo-landing it was page scroll). Every value is 0..1 except `t`.
 */
export default function InPhoneApp(props: PhoneState) {
  const { ref, scale, frameH } = useScreenScale();
  return (
    <div className="ph" ref={ref} style={{ visibility: scale ? undefined : "hidden" }}>
      <PhoneAiScreen scale={scale} frameH={frameH} {...props} />
    </div>
  );
}
