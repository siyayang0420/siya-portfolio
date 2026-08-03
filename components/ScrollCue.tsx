"use client";

import React, { forwardRef, useId } from "react";

/**
 * Bravo scroll-down cue.
 *
 * A label + a 22×36 mouse outline that bounces on a 2.2s loop while a darker
 * stroke sweeps down the outline and a wheel dot rides up and down inside it.
 * The whole thing is a <button>, so it doubles as a click affordance.
 *
 * Copied from the `bravo-scroll-cue` skill. Pairs with `scroll-cue.css`,
 * imported once from globals.css.
 */

export type ScrollCueProps = {
  /** Visible caption above the mouse. Rendered uppercase by CSS. */
  label?: string;
  /** Accessible name. Defaults to `label`. */
  ariaLabel?: string;
  /** Element that should scroll on click. Omit to scroll the window. */
  scrollTarget?: React.RefObject<HTMLElement | null> | HTMLElement | null;
  /** Fraction of a viewport height the default click nudges. */
  scrollFraction?: number;
  /** Overrides the built-in scroll behaviour entirely. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
};

export const ScrollCue = forwardRef<HTMLButtonElement, ScrollCueProps>(
  function ScrollCue(
    {
      label = "Scroll down",
      ariaLabel,
      scrollTarget,
      scrollFraction = 0.9,
      onClick,
      className,
      style,
    },
    ref,
  ) {
    // Per-instance clipPath id so two cues on one page don't clip against
    // whichever rect the browser resolved first. useId can contain ':'.
    const clipId = `scroll-cue-sweep-${useId().replace(/:/g, "")}`;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (onClick) {
        onClick(e);
        return;
      }
      const top = window.innerHeight * scrollFraction;
      const el =
        scrollTarget && "current" in scrollTarget
          ? scrollTarget.current
          : scrollTarget ?? null;
      (el ?? window).scrollBy({ top, behavior: "smooth" });
    };

    return (
      <button
        ref={ref}
        type="button"
        className={className ? `scroll-cue ${className}` : "scroll-cue"}
        aria-label={ariaLabel ?? label}
        style={style}
        onClick={handleClick}
      >
        <span className="scroll-cue-label">{label}</span>

        {/* `fill="none"` on the root is load-bearing — the two <rect>s inherit
            it, and without it they paint as solid slabs instead of outlines. */}
        <svg
          className="scroll-cue-mouse"
          width="22"
          height="36"
          viewBox="0 0 22 36"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            {/* Sweep mask — a full-size rect animated vertically. Wherever it
                overlaps the active stroke, that band is revealed. */}
            <clipPath id={clipId}>
              <rect
                className="scroll-cue-sweep"
                x="0"
                y="0"
                width="22"
                height="36"
              />
            </clipPath>
          </defs>

          {/* Base outline — always visible in the track colour. */}
          <rect
            className="scroll-cue-body-base"
            x="1"
            y="1"
            width="20"
            height="34"
            rx="10"
            stroke="#d9d9d9"
            strokeWidth="1.5"
          />

          {/* Active outline — drawn on top and clipped by the sweeping rect. */}
          <rect
            className="scroll-cue-body-active"
            x="1"
            y="1"
            width="20"
            height="34"
            rx="10"
            stroke="#737373"
            strokeWidth="1.5"
            clipPath={`url(#${clipId})`}
          />

          {/* Wheel dot — currentColor picks up --scroll-cue-color. */}
          <circle
            className="scroll-cue-dot"
            cx="11"
            cy="9"
            r="1.6"
            fill="currentColor"
          />
        </svg>
      </button>
    );
  },
);
