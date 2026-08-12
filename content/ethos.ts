/**
 * The belief, in one place.
 *
 * Its own module rather than an export from Ethos.tsx: that file is
 * `"use client"`, and importing plain data from a client module into a server
 * component hands back a client-reference proxy, not the array — which fails
 * at render with "BODY.map is not a function". Content has no reason to be
 * bound to a component anyway.
 *
 * Read by the scroll-filled panel on the home page and by the About page.
 */

export const HEADLINE = "I believe every product shapes the people who use it.";

export const BODY = [
  "People rarely use products only for what they say they want. They use them for how those products make them feel about themselves.",
  "The best products don’t just solve problems. They reshape motivation. They make new behaviors feel natural, rewarding, and worth repeating.",
  "That’s why I don’t just ask whether a feature works. I ask:",
  "Who does this encourage people to become?",
];
