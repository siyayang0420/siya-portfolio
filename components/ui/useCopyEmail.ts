"use client";

import { useEffect, useRef, useState } from "react";

export const EMAIL = "siya.yang.design@gmail.com";

/**
 * Copies the contact address and reports a short-lived `copied` flag so a
 * button can swap its label. Shared by the hero's contact pill and the
 * footer's, so the address and the reset timing live in one place.
 */
export function useCopyEmail(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // navigator.clipboard needs a secure context; fall back to a scratch node.
      const scratch = document.createElement("textarea");
      scratch.value = EMAIL;
      scratch.setAttribute("readonly", "");
      scratch.style.position = "fixed";
      scratch.style.opacity = "0";
      document.body.appendChild(scratch);
      scratch.select();
      document.execCommand("copy");
      document.body.removeChild(scratch);
    }

    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), resetMs);
  };

  return { copied, copy };
}
