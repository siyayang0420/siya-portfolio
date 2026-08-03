"use client";

import { useEffect, useRef } from "react";

/**
 * A small hand-rolled WebGL gradient. It paints a three-stop vertical wash and
 * folds a set of rippled bands over the top — the silky, brushed look used for
 * the hero backdrop and the accent cards. No libraries, no image assets.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uTop;
uniform vec3  uMid;
uniform vec3  uBottom;
uniform float uRipple;   // strength of the wave banding
uniform float uFreq;     // how tight the bands are
uniform float uSeed;     // decorrelates instances on the same page
uniform vec2  uOrigin;   // where the ripples radiate from, in -1..1 space

out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // gl_FragCoord is bottom-left origin; flip so y = 0 is the top of the page.
  vec2 uv = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uRes;

  // Three-stop vertical wash, top to bottom. The bottom stop starts late so the
  // warm tone stays in the lower third instead of creeping up into the blue.
  vec3 base = mix(uTop, uMid, smoothstep(0.0, 0.62, uv.y));
  base = mix(base, uBottom, smoothstep(0.62, 1.0, uv.y));

  // Aspect-corrected coordinates so the rings stay circular on wide screens.
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y - uOrigin;

  float r = length(p);
  float a = atan(p.y, p.x);
  float t = uTime * 0.06 + uSeed;

  // Concentric rings, warped by a couple of angular harmonics so they read as
  // folded silk rather than a bullseye.
  float warp = sin(a * 2.0 + t * 1.3) * 0.22 + sin(a * 5.0 - t * 0.7) * 0.07;
  float band = sin((r * uFreq + warp * uFreq * 0.5 - t) * 6.2831853);

  band = band * 0.5 + 0.5;
  band = pow(band, 1.7);

  // Fade the banding out toward the very top so the wash stays clean.
  float falloff = smoothstep(-0.15, 0.85, uv.y * 0.6 + 0.4);

  vec3 col = base + (band - 0.45) * uRipple * falloff;

  // Dither: 8-bit gradients band badly without it.
  col += (hash(gl_FragCoord.xy + uSeed) - 0.5) * 0.014;

  outColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export type WaveCanvasProps = {
  /** Top, middle and bottom colours of the vertical wash. */
  colors: [string, string, string];
  /** 0 = flat gradient, ~0.3 = pronounced silk bands. */
  ripple?: number;
  frequency?: number;
  seed?: number;
  /** Ring origin in -1..1 units of viewport height, relative to centre. */
  origin?: [number, number];
  className?: string;
  /** Renders once and stops — cheaper for small decorative cards. */
  still?: boolean;
};

export default function WaveCanvas({
  colors,
  ripple = 0.16,
  frequency = 3.2,
  seed = 0,
  origin = [-0.35, 0.1],
  className,
  still = false,
}: WaveCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  // Depend on primitives, not array identity — callers pass inline literals and
  // re-render on scroll, which would otherwise rebuild the GL context each tick
  // until the browser runs out of them.
  const [topColor, midColor, bottomColor] = colors;
  const [originX, originY] = origin;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    // No WebGL2, or a context that's already dead (GPU reset, driver hiccup) —
    // fall back to a plain CSS gradient. Drawing into a lost context silently
    // no-ops, which would leave a transparent canvas over the page instead.
    if (!gl || gl.isContextLost()) {
      canvas.style.background = `linear-gradient(to bottom, ${topColor}, ${midColor} 55%, ${bottomColor})`;
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");

    gl.uniform3fv(u("uTop"), hexToRgb(topColor));
    gl.uniform3fv(u("uMid"), hexToRgb(midColor));
    gl.uniform3fv(u("uBottom"), hexToRgb(bottomColor));
    gl.uniform1f(u("uRipple"), ripple);
    gl.uniform1f(u("uFreq"), frequency);
    gl.uniform1f(u("uSeed"), seed);
    gl.uniform2f(u("uOrigin"), originX, originY);

    let frame = 0;
    let visible = true;
    const start = performance.now();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    // With no ripple the output is time-invariant, so looping would just redraw
    // an identical frame forever.
    const animated = !still && !reduced && ripple > 0;

    const MAX_EDGE = 2048;

    const resize = () => {
      // Cap at 1.5x — the gradient is soft enough that full DPR is wasted work.
      // Then clamp again, since the stacked mobile hero can be many screens tall.
      const cw = Math.max(1, canvas.clientWidth);
      const ch = Math.max(1, canvas.clientHeight);
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5,
        MAX_EDGE / cw,
        MAX_EDGE / ch,
      );
      const w = Math.max(1, Math.round(cw * dpr));
      const h = Math.max(1, Math.round(ch * dpr));
      const changed = canvas.width !== w || canvas.height !== h;
      if (changed) {
        canvas.width = w;
        canvas.height = h;
      }
      // Viewport and uRes are pushed EVERY call, not just on a size change.
      // On remount the canvas element is reused at the same size, so an
      // early-return here would skip them — and the effect has just built a
      // brand-new program whose uniforms are all still zero. uRes at (0,0)
      // makes the shader divide by zero and paint nothing.
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      return changed;
    };

    const draw = (time: number) => {
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      resize();
      draw((performance.now() - start) / 1000);
    };

    if (animated) {
      frame = requestAnimationFrame(loop);
    } else {
      resize();
      draw(0);
    }

    // Stop burning frames when the canvas scrolls out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const onResize = () => {
      if (resize() && !animated) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      // Deliberately NOT calling WEBGL_lose_context.loseContext() here. It
      // looks like tidy cleanup, but once a canvas has been force-lost, a
      // later getContext() hands back that same dead context instead of a
      // fresh one — so remounting (navigating away and back) left every
      // canvas silently no-op'ing and the page rendered blank. The browser
      // reclaims the context on its own once the canvas is collected.
    };
  }, [
    topColor,
    midColor,
    bottomColor,
    ripple,
    frequency,
    seed,
    originX,
    originY,
    still,
  ]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
