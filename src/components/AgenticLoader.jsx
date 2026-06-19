import { useEffect, useState } from "react";

// ─── CSS delay helpers (3×3, step = ms between adjacent cells) ───────────────
const d = (arr, step) => arr.map((v) => v * step);

// All patterns from the reference set:
const DELAYS = {
  // Row 1 — directional waves
  "wave-lr":      (s) => d([0,1,2, 0,1,2, 0,1,2], s),
  "wave-rl":      (s) => d([2,1,0, 2,1,0, 2,1,0], s),
  "wave-tb":      (s) => d([0,0,0, 1,1,1, 2,2,2], s),
  "wave-bt":      (s) => d([2,2,2, 1,1,1, 0,0,0], s),

  // Row 2 — diagonal + apex point waves
  "diagonal-tl":  (s) => d([0,1,2, 1,2,3, 2,3,4], s),
  "diagonal-tr":  (s) => d([2,1,0, 3,2,1, 4,3,2], s),
  "apex-up":      (s) => d([3,2,3, 2,1,2, 1,0,1], s),
  "apex-down":    (s) => d([1,0,1, 2,1,2, 3,2,3], s),

  // Motion
  "rain":         (s) => d([0,4,2, 1,5,3, 2,6,4], s),
  "zigzag":       (s) => d([0,8,6, 1,7,5, 2,8,4], s),
  "snake":        (s) => d([0,1,2, 5,4,3, 6,7,8], s),
  "fade":         (s) => d([0,0,0, 0,0,0, 0,0,0], s),
  "scatter":      (s) => d([0,5,2, 7,3,8, 1,6,4], s),
  "fill":         (s) => d([0,1,2, 3,4,5, 6,7,8], s),
  "surge-up":     (s) => d([2,5,8, 1,4,7, 0,3,6], s),
  "mirror-v":     (s) => d([2,1,0, 0,1,2, 2,1,0], s),

  // Replacements
  "zoom":         (s) => d([4,3,4, 3,0,3, 4,3,4], s),
  "corners":      (s) => d([0,4,0, 4,8,4, 0,4,0], s),
  "rows-alt":     (s) => d([0,0,0, 2,2,2, 0,0,0], s),
  "cols-alt":     (s) => d([0,2,0, 0,2,0, 0,2,0], s),
  "spiral-in":    (s) => d([0,1,2, 7,8,3, 6,5,4], s),
  "spiral-out":   (s) => d([8,7,6, 1,0,5, 2,3,4], s),
  "cross-h":      (s) => d([2,0,2, 2,0,2, 2,0,2], s),
  "cross-v":      (s) => d([2,2,2, 0,0,0, 2,2,2], s),
  "stagger":      (s) => d([0,2,4, 1,3,5, 2,4,6], s),
};

// ─── CSS animation factory ────────────────────────────────────────────────────
function css(id, label, duration, step, opts = {}) {
  return {
    kind: "css",
    id,
    label,
    cols: opts.cols ?? 3,
    cellSize: opts.cellSize ?? 8,
    duration,
    minOpacity: opts.minOpacity ?? 0.06,
    maxOpacity: opts.maxOpacity ?? 1,
    delays: DELAYS[id](step),
    easing: opts.easing ?? "ease-in-out",
  };
}

// ─── Animation library ────────────────────────────────────────────────────────
export const AGENT_STEPS = [
  css("wave-lr",     "WAVE-LR",     800,  110),
  css("wave-rl",     "WAVE-RL",     800,  110),
  css("wave-tb",     "WAVE-TB",     800,  110),
  css("wave-bt",     "WAVE-BT",     800,  110),

  css("diagonal-tl", "DIAGONAL-TL", 900,   90),
  css("diagonal-tr", "DIAGONAL-TR", 900,   90),
  css("apex-up",     "APEX-UP",     920,   95, { easing: "ease-in-out" }),
  css("apex-down",   "APEX-DOWN",   920,   95, { easing: "ease-in-out" }),

  css("snake",       "SNAKE",       1000, 90,  { easing: "linear" }),
  css("fill",        "FILL",        1400, 80,  { easing: "ease-in-out" }),
  css("surge-up",    "SURGE-UP",    1200, 55,  { easing: "cubic-bezier(0.33, 1, 0.68, 1)" }),

  css("fade",        "FADE",        2600, 0,   { easing: "ease-in", minOpacity: 0.0, maxOpacity: 1 }),
  css("scatter",     "SCATTER",     800,  75,  { easing: "ease-in-out" }),
  css("spiral-out",  "SPIRAL-OUT",  1200, 90,  { easing: "ease-out" }),
  css("rain",        "RAIN",        500,  90,  { easing: "ease-in", minOpacity: 0.04, maxOpacity: 1 }),
  css("zigzag",      "ZIGZAG",      1000, 80,  { easing: "linear" }),
];

// ─── CSS keyframe injection ───────────────────────────────────────────────────
const injectedKeyframes = new Set();

function ensureKeyframe(minOp, maxOp) {
  const key = `px_${Math.round(minOp * 100)}_${Math.round(maxOp * 100)}`;
  if (injectedKeyframes.has(key)) return key;
  if (typeof document === "undefined") return key;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ${key} {
      0%   { opacity: ${minOp}; }
      50%  { opacity: ${maxOp}; }
      100% { opacity: ${minOp}; }
    }
  `;
  document.head.appendChild(style);
  injectedKeyframes.add(key);
  return key;
}

function ensureSurgeUpKeyframe(minOp, maxOp) {
  const key = `px_surge_up_${Math.round(minOp * 100)}_${Math.round(maxOp * 100)}`;
  if (injectedKeyframes.has(key)) return key;
  if (typeof document === "undefined") return key;
  const trough = minOp + (maxOp - minOp) * 0.38;
  const rebound = minOp + (maxOp - minOp) * 0.78;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ${key} {
      0%   { opacity: ${minOp}; }
      20%  { opacity: ${maxOp}; }
      38%  { opacity: ${trough}; }
      55%  { opacity: ${rebound}; }
      100% { opacity: ${minOp}; }
    }
  `;
  document.head.appendChild(style);
  injectedKeyframes.add(key);
  return key;
}

function ensureFadeKeyframe(minOp, maxOp) {
  const key = `px_fade_${Math.round(minOp * 100)}_${Math.round(maxOp * 100)}`;
  if (injectedKeyframes.has(key)) return key;
  if (typeof document === "undefined") return key;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ${key} {
      0%   { opacity: ${minOp}; }
      30%  { opacity: ${maxOp}; }
      60%  { opacity: ${maxOp}; }
      80%  { opacity: ${minOp}; }
      100% { opacity: ${minOp}; }
    }
  `;
  document.head.appendChild(style);
  injectedKeyframes.add(key);
  return key;
}

// ─── Gradient glow color ──────────────────────────────────────────────────────
function glowColor(color, isGradient) {
  if (!isGradient) return color;
  const match = color.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : "#ffffff";
}

// ─── CssPixelIcon ─────────────────────────────────────────────────────────────
function CssPixelIcon({ anim, controls }) {
  const easing = anim.easing ?? "ease-in-out";
  const minOp = 0.06;
  const maxOp = controls.opacity;
  const duration = Math.round(anim.duration / controls.speed);
  const cellSize = controls.cellSize;
  const isGradient = controls.colorMode === "gradient";
  const glow = controls.glow;

  const [keyframe, setKeyframe] = useState("");

  useEffect(() => {
    const kf =
      anim.id === "fade"
        ? ensureFadeKeyframe(minOp, maxOp)
        : anim.id === "surge-up"
          ? ensureSurgeUpKeyframe(minOp, maxOp)
          : ensureKeyframe(minOp, maxOp);
    setKeyframe(kf);
  }, [anim.id, maxOp]);

  const size = anim.cols * cellSize;
  const gc = glowColor(controls.color, isGradient);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        isolation: isGradient ? "isolate" : undefined,
      }}
    >
      {isGradient && (
        <div style={{ position: "absolute", inset: 0, background: controls.color, borderRadius: 1 }} />
      )}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          display: "grid",
          gridTemplateColumns: `repeat(${anim.cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${anim.cols}, ${cellSize}px)`,
        }}
      >
        {anim.delays.map((delay, i) => (
          <div
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: isGradient ? "#ffffff" : controls.color,
              mixBlendMode: isGradient ? "screen" : undefined,
              opacity: minOp,
              animation: keyframe
                ? `${keyframe} ${duration}ms ${easing} ${delay}ms infinite`
                : undefined,
              boxShadow: glow > 0
                ? `0 0 ${glow}px ${Math.round(glow * 0.6)}px ${gc}`
                : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Snippet generator (download payload) ──────────────────────────────────────
export function generateSnippet(anim, controls) {
  if (anim.kind !== "css") return "/* frame-based animation — not exportable as CSS */";

  const cellSize = controls.cellSize;
  const color = controls.colorMode === "gradient" ? "#ffffff" : controls.color;
  const minOp = 0.06;
  const maxOp = controls.opacity;
  const duration = Math.round(anim.duration / controls.speed);
  const easing = anim.easing ?? "ease-in-out";
  const size = anim.cols * cellSize;
  const glowVal = controls.glow > 0
    ? `box-shadow: 0 0 ${controls.glow}px ${Math.round(controls.glow * 0.6)}px ${color};`
    : "";

  const trough = minOp + (maxOp - minOp) * 0.38;
  const reboundPeak = minOp + (maxOp - minOp) * 0.78;

  const keyframesCss =
    anim.id === "surge-up"
      ? `  @keyframes loader-pulse-${anim.id} {
    0%   { opacity: ${minOp}; }
    20%  { opacity: ${maxOp}; }
    38%  { opacity: ${trough}; }
    55%  { opacity: ${reboundPeak}; }
    100% { opacity: ${minOp}; }
  }`
      : `  @keyframes loader-pulse-${anim.id} {
    0%   { opacity: ${minOp}; }
    50%  { opacity: ${maxOp}; }
    100% { opacity: ${minOp}; }
  }`;

  const cells = anim.delays
    .map((delay) => `  <div class="cell" style="animation-delay:${delay}ms"></div>`)
    .join("\n");

  return `<!-- ${anim.label} loader -->
<style>
  .loader-${anim.id} {
    display: grid;
    grid-template-columns: repeat(${anim.cols}, ${cellSize}px);
    grid-template-rows: repeat(${anim.cols}, ${cellSize}px);
    width: ${size}px;
    height: ${size}px;
  }
  .loader-${anim.id} .cell {
    width: ${cellSize}px;
    height: ${cellSize}px;
    background-color: ${color};
    opacity: ${minOp};
    animation: loader-pulse-${anim.id} ${duration}ms ${easing} infinite;
    ${glowVal}
  }
${keyframesCss}
</style>
<div class="loader-${anim.id}">
${cells}
</div>`;
}

// ─── PixelIcon (unified) ──────────────────────────────────────────────────────
export function PixelIcon({ stepId, controls }) {
  const anim = AGENT_STEPS.find((s) => s.id === stepId) ?? AGENT_STEPS[0];
  return <CssPixelIcon anim={anim} controls={controls} />;
}

export default PixelIcon;