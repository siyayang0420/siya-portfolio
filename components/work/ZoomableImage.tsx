'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';
import { PILL } from '@/components/ui/pill';

/**
 * A case-study figure you can open full-screen and zoom.
 *
 * The inline image is a real `<img>` with whatever classes the figure gives
 * it, wrapped in a button so the whole thing is one click target and reads
 * to a screen reader as "View full size". Product screenshots are the
 * evidence in these studies and a 800px column crushes a 3000px table, so
 * every one of them opens.
 *
 * The lightbox is a portal onto <body>: the acts live inside a stacking
 * context with transforms on it, so `fixed` from inside would pin to the
 * act, not the viewport. Scale and pan are one CSS transform on the image
 * — no layout runs while you drag. Zoom anchors on the cursor for the wheel
 * and on the centre for the buttons; at 1× the image is fit-to-screen and
 * pan is disabled, so it can never be dragged out of reach.
 */

const MIN = 1;
const MAX = 4;
const STEP = 1.5;
const ease = [0.16, 1, 0.3, 1] as const;

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

export function ZoomableImage({ className, src, alt, ...img }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View full size: ${alt}`}
        className="block h-full w-full cursor-zoom-in rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f83f7]/40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={className} {...img} />
      </button>
      <Lightbox open={open} src={src} alt={alt} onClose={() => setOpen(false)} />
    </>
  );
}

function Lightbox({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(MIN);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  const moved = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset on every open so a figure never reopens where you left it.
  useEffect(() => {
    if (!open) return;
    setScale(MIN);
    setPan({ x: 0, y: 0 });
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') zoomBy(STEP);
      if (e.key === '-') zoomBy(1 / STEP);
      if (e.key === '0') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const clamp = (s: number) => Math.min(MAX, Math.max(MIN, s));

  /** Scale about a point (viewport-relative to the image centre). */
  const zoomAt = useCallback((factor: number, ox = 0, oy = 0) => {
    setScale((s) => {
      const next = clamp(s * factor);
      const k = next / s;
      setPan((p) =>
        next === MIN ? { x: 0, y: 0 } : { x: ox - (ox - p.x) * k, y: oy - (oy - p.y) * k },
      );
      return next;
    });
  }, []);
  const zoomBy = (factor: number) => zoomAt(factor);
  const reset = () => {
    setScale(MIN);
    setPan({ x: 0, y: 0 });
  };

  // The image's untransformed origin is the viewport centre (flex-centred
  // scrim), so every anchor is measured from there. React registers wheel
  // as passive, so no preventDefault — the page can't scroll anyway while
  // the body is locked.
  const onWheel = (e: ReactWheelEvent) => {
    zoomAt(
      e.deltaY < 0 ? 1.1 : 1 / 1.1,
      e.clientX - window.innerWidth / 2,
      e.clientY - window.innerHeight / 2,
    );
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (scale === MIN) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    moved.current = false;
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
    setPan({ x: drag.current.px + dx, y: drag.current.py + dy });
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  // Click on the scrim closes; click on the image toggles 1× ↔ 2× unless
  // the pointer was dragging.
  const onImageClick = (e: ReactMouseEvent) => {
    e.stopPropagation();
    if (moved.current) return;
    if (scale === MIN) {
      zoomAt(
        2,
        e.clientX - window.innerWidth / 2,
        e.clientY - window.innerHeight / 2,
      );
    } else reset();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f8f8f8]/95 backdrop-blur-sm"
          onClick={onClose}
          onWheel={onWheel}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            {/* Framer owns the entry transform on the wrapper above; the zoom
                transform lives here so the two never fight over one style. */}
            <div
              onClick={onImageClick}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transition: drag.current
                  ? 'none'
                  : 'transform 220ms cubic-bezier(0.16,1,0.3,1)',
                cursor:
                  scale === MIN ? 'zoom-in' : drag.current ? 'grabbing' : 'grab',
              }}
              className="touch-none select-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                className="max-h-[calc(100vh-128px)] max-w-[calc(100vw-48px)] rounded-xl border border-line bg-white shadow-[0_24px_64px_-24px_rgba(0,0,0,0.25)]"
              />
            </div>
          </motion.div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(PILL, 'absolute right-6 top-6 size-11 p-0')}
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>

          <div
            role="group"
            aria-label="Zoom"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              PILL,
              'absolute bottom-6 left-1/2 -translate-x-1/2 gap-0 p-1 hover:bg-white hover:text-black hover:ring-black/[0.06] active:bg-white active:text-black active:ring-black/[0.06]',
            )}
          >
            <ZoomButton label="Zoom out" disabled={scale <= MIN} onClick={() => zoomBy(1 / STEP)}>
              <Minus className="size-4" strokeWidth={1.75} />
            </ZoomButton>
            <button
              type="button"
              onClick={reset}
              aria-label="Reset zoom"
              className="min-w-[52px] rounded-full px-2 py-2 text-[12px] tabular-nums text-muted transition-colors hover:text-ink"
            >
              {Math.round(scale * 100)}%
            </button>
            <ZoomButton label="Zoom in" disabled={scale >= MAX} onClick={() => zoomBy(STEP)}>
              <Plus className="size-4" strokeWidth={1.75} />
            </ZoomButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ZoomButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-[#f0f0f0] disabled:cursor-default disabled:text-[#c4c4c4] disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
