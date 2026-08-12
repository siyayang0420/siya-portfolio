import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Name block across the top of the hero's left rail.
 * Built to the Figma spec (28px name, 16px sub-lines).
 */
export default function Intro() {
  return (
    <div className="flex flex-col gap-2">
      {/* w-fit so the link is only as wide as the name — a full-width anchor
          here would put a large invisible target across the hero. */}
      <Link
        href="/about"
        className="group flex w-fit items-center gap-1 transition-opacity hover:opacity-70"
      >
        <p className="font-display text-[28px] uppercase leading-[1.2] text-white">
          Siya Yang
        </p>
        <ArrowUpRight
          className="size-6 text-white transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.75}
        />
      </Link>
      <div className="text-[16px] leading-[1.2] text-white">
        <p>Product Designer / UI UX Designer</p>
      </div>
    </div>
  );
}
