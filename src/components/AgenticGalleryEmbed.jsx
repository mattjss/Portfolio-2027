import { useState, useEffect, useRef } from "react";
import { AGENT_STEPS, PixelIcon, generateSnippet } from "./AgenticLoader";

const CONTROLS = { color: "#ffffff", colorMode: "solid", speed: 1, glow: 0, opacity: 1, cellSize: 8 };
const monoFont = "'JetBrains Mono', ui-monospace, monospace";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scramble(str) {
  return str
    .split("")
    .map((c) => (c === " " || c === "-" ? c : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
    .join("");
}

// ── Self-contained sound, gated by the card's muted prop ───────────────
let _ac = null;
let _muted = true;
function getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  return _ac;
}
function tone(freq, dur, type = "sine", vol = 0.09, when = 0, freqEnd) {
  if (_muted) return;
  const ac = getAC();
  if (ac.state === "suspended") ac.resume();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  const t0 = ac.currentTime + when;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd !== undefined) osc.frequency.linearRampToValueAtTime(freqEnd, t0 + dur);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}
const sounds = {
  cardHover: () => tone(1568, 0.028, "triangle", 0.012),
  downloadClick: () => { tone(784, 0.07, "triangle", 0.09); tone(1175, 0.09, "sine", 0.07, 0.06); },
  downloadDone: () => { tone(784, 0.12, "sine", 0.09); tone(988, 0.14, "sine", 0.078, 0.10); tone(1175, 0.22, "sine", 0.062, 0.20); },
};

function AnimCard({ step }) {
  const [hovered, setHovered] = useState(false);
  const [copyState, setCopyState] = useState("idle");
  const [scrambledText, setScrambledText] = useState(step.label);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    if (!hovered) {
      setScrambledText(step.label);
      setShowDownload(false);
      return;
    }
    const scrambleId = setInterval(() => setScrambledText(() => scramble(step.label)), 40);
    const downloadId = setTimeout(() => setShowDownload(true), 140);
    return () => { clearInterval(scrambleId); clearTimeout(downloadId); };
  }, [hovered, step.label]);

  const handleDownload = () => {
    if (copyState === "copied") return;
    sounds.downloadClick();
    const snippet = generateSnippet(step, CONTROLS);
    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${step.label} Loader</title>
</head>
<body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#000;">
${snippet}
</body>
</html>`;
    const blob = new Blob([doc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${step.id}-loader.html`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.downloadDone();
    setCopyState("copied");
    setTimeout(() => setCopyState("idle"), 1800);
  };

  const isCopied = copyState === "copied";

  return (
    <div
      onMouseEnter={() => { sounds.cardHover(); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      onClick={handleDownload}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: isCopied ? "default" : "pointer" }}
    >
      <div style={{
        borderRadius: 6,
        padding: 8,
        outline: hovered && !isCopied ? "1px solid #2a2a2a" : "1px solid transparent",
        transition: "outline-color 180ms ease",
      }}>
        <PixelIcon stepId={step.id} controls={CONTROLS} />
      </div>

      <div style={{ position: "relative", height: 18, width: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{
          fontFamily: monoFont, fontSize: 9, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase",
          color: "#cfcfcf", whiteSpace: "nowrap", position: "absolute",
          opacity: showDownload ? 0 : 1, transform: showDownload ? "translateY(-3px)" : "translateY(0)",
          transition: "opacity 180ms ease, transform 180ms ease", pointerEvents: "none",
        }}>
          {hovered ? scrambledText : step.label}
        </span>

        <span style={{
          fontFamily: monoFont, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", position: "absolute",
          color: isCopied ? "#6ee7b7" : "#888",
          opacity: showDownload ? 1 : 0, transform: showDownload ? "translateY(0)" : "translateY(3px)",
          transition: "opacity 180ms ease, transform 180ms ease, color 150ms", pointerEvents: "none",
        }}>
          {isCopied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              downloaded
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M6 2v5M4 6l2 2 2-2M2 9h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              download
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default function AgenticGalleryEmbed({ muted = true }) {
  useEffect(() => { _muted = muted; }, [muted]);

  const wrapRef = useRef(null);
  const galleryRef = useRef(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const g = galleryRef.current;
    if (!wrap || !g) return;
    const fit = () => {
      const gw = g.offsetWidth;   // natural (unscaled) size — transform doesn't affect offsetWidth
      const gh = g.offsetHeight;
      const ww = wrap.clientWidth;
      const wh = wrap.clientHeight;
      if (!gw || !gh || !ww || !wh) return;
      setScale(Math.min(ww / gw, wh / gh) * 0.92); // 8% breathing room
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute", inset: 0, background: "#101010",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}
    >
      <div
        ref={galleryRef}
        style={{
          transform: `scale(${scale || 1})`,
          transformOrigin: "center",
          opacity: scale ? 1 : 0,        // avoid a flash at natural size before fit
          transition: "opacity 120ms ease",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, auto)", gap: 36, width: "fit-content" }}>
          {AGENT_STEPS.map((step) => (
            <AnimCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </div>
  );
}