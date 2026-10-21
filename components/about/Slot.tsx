import type { CSSProperties } from 'react';

/**
 * A placeholder for an artifact that hasn't been chosen yet: a hairline frame
 * with a mono label saying what belongs there. Swap the whole element for an
 * <Image>, a video or a live component when the real piece is ready; the
 * `ratio` is the only thing the layout depends on.
 */
export function Slot({
  label,
  ratio = '4 / 3',
  tone = 'light',
  className = '',
  style,
}: {
  label: string;
  ratio?: string;
  tone?: 'light' | 'dark';
  className?: string;
  style?: CSSProperties;
}) {
  const dark = tone === 'dark';
  return (
    <div
      className={`relative flex w-full items-end overflow-hidden rounded-xl ${className}`}
      style={{
        aspectRatio: ratio,
        background: dark ? '#111113' : '#ededed',
        boxShadow: dark ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.06), 0 10px 30px -18px rgba(0,0,0,0.25)',
        ...style,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          margin: 14,
          fontSize: 10,
          letterSpacing: '0.16em',
          color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
