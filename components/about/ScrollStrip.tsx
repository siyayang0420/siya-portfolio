"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sideways photo strip: a vertical mouse wheel scrolls it sideways until it
 * hits an end (then the page takes over again), and it can be dragged.
 */
export function ScrollStrip({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpad already scrolls sideways
      const max = el.scrollWidth - el.clientWidth;
      const atEnd = e.deltaY > 0 ? el.scrollLeft >= max - 1 : el.scrollLeft <= 0;
      if (atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // touch scrolls natively
    const el = e.currentTarget;
    const x0 = e.clientX;
    const left0 = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
    const move = (ev: PointerEvent) => (el.scrollLeft = left0 - (ev.clientX - x0));
    const up = () => {
      el.style.cursor = "";
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onDragStart={(e) => e.preventDefault()}
      className={`cursor-grab select-none ${className}`}
      style={{ scrollbarWidth: "none" }}
    >
      {children}
    </div>
  );
}
