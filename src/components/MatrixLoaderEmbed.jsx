import { useEffect, useRef, useState } from "react";

const MATRIX_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
const SPINNER_FRAMES = ["⠀", "⠂", "⠌", "⡑", "⢕", "⢝", "⣫", "⣟", "⣿", "⣟", "⣫", "⢝", "⢕", "⡑", "⠌", "⠂", "⠀"];

const SENTENCES = [
  "Initializing inference engine…",
  "Scanning context for relevant signals…",
  "k=4 memory chunks retrieved…",
  "Mapping semantic relationships across tokens…",
  "Decomposing task into subtasks…",
  "Running tool calls in parallel…",
  "Evaluating response strategies…",
  "Cross-referencing prior context…",
  "Synthesis pass complete…",
  "Verifying reasoning chain…",
  "Output ready.",
];

// ── Audio ───────────────────────────────────────────────
let _ac = null;
let _lastTypeTick = 0;

function getAC() {
  if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)();
  return _ac;
}

function tone(freq, dur, type = "sine", vol = 0.05, when = 0, freqEnd) {
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
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.01);
}

const sfx = {
  typeTick: () => {
    const now = Date.now();
    if (now - _lastTypeTick < 40) return;
    _lastTypeTick = now;
    tone(1400, 0.011, "square", 0.005);
  },
  decoderScan: () => tone(1100, 0.007, "square", 0.003),
  verified: () => {
    tone(740, 0.06, "sine", 0.038);
    tone(988, 0.10, "sine", 0.028, 0.055);
  },
};

// ── Component ───────────────────────────────────────────
export default function MatrixLoaderEmbed({ muted = true }) {
  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; }, [muted]);
  const beep = (fn) => { if (!mutedRef.current) fn(); };

  // follow the site theme (data-theme on <html>): light = white bg / dark text
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-theme") || "light"
      : "light"
  );
  useEffect(() => {
    const read = () => setTheme(document.documentElement.getAttribute("data-theme") || "light");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  const isDark = theme === "dark";
  const bg = isDark ? "#101010" : "#FCFCFC";
  const fg = isDark ? "#FCFCFC" : "#101010";

  // reduce left padding on mobile (inline styles can't use media queries)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 480px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isRetracting, setIsRetracting] = useState(false);
  const [decoderPass, setDecoderPass] = useState(0);
  const [decoderPosition, setDecoderPosition] = useState(-1);
  const [glitchFrame, setGlitchFrame] = useState(0);
  const [spinnerFrame, setSpinnerFrame] = useState(0);

  const currentSentence = SENTENCES[currentSentenceIndex];

  // Spinner — always ticking
  useEffect(() => {
    const interval = setInterval(() => setSpinnerFrame((f) => f + 1), 100);
    return () => clearInterval(interval);
  }, []);

  // Glitch during typing
  useEffect(() => {
    if (!isRetracting && decoderPass === 0 && displayText.length > 0 && displayText.length < currentSentence.length) {
      const interval = setInterval(() => setGlitchFrame((f) => f + 1), 50);
      return () => clearInterval(interval);
    }
  }, [displayText.length, currentSentence.length, isRetracting, decoderPass]);

  // Main animation flow
  useEffect(() => {
    if (!isRetracting && decoderPass === 0 && displayText.length < currentSentence.length) {
      const timeout = setTimeout(() => {
        beep(sfx.typeTick);
        setDisplayText(currentSentence.slice(0, displayText.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    }

    if (!isRetracting && decoderPass === 0 && displayText.length === currentSentence.length) {
      const timeout = setTimeout(() => {
        setDecoderPass(1);
        setDecoderPosition(0);
      }, 300);
      return () => clearTimeout(timeout);
    }

    if (decoderPass === 4 && !isRetracting) {
      beep(sfx.verified);
      const timeout = setTimeout(() => setIsRetracting(true), 500);
      return () => clearTimeout(timeout);
    }

    if (isRetracting && displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 20);
      return () => clearTimeout(timeout);
    }

    if (isRetracting && displayText.length === 0) {
      setIsRetracting(false);
      setDecoderPass(0);
      setDecoderPosition(-1);
      setCurrentSentenceIndex((prev) => (prev + 1) % SENTENCES.length);
    }
  }, [displayText, currentSentence, isRetracting, decoderPass]);

  // Decoder passes left to right
  useEffect(() => {
    if (decoderPass > 0 && decoderPass <= 3) {
      if (decoderPosition < displayText.length) {
        const timeout = setTimeout(() => {
          if (decoderPass === 1) beep(sfx.decoderScan);
          setDecoderPosition((p) => p + 1);
        }, 50);
        return () => clearTimeout(timeout);
      }
      if (decoderPosition >= displayText.length) {
        const timeout = setTimeout(() => {
          setDecoderPass((p) => p + 1);
          setDecoderPosition(0);
        }, 200);
        return () => clearTimeout(timeout);
      }
    }
  }, [decoderPosition, decoderPass, displayText.length]);

  const getCharAtPosition = (char, index) => {
    if (decoderPass > 0 && decoderPass <= 3 && index === decoderPosition) {
      return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    }
    if (decoderPass === 0 && displayText.length < currentSentence.length) {
      const dist = displayText.length - 1 - index;
      if (dist >= 0 && dist < 3 && Math.random() > 0.5) {
        return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      }
    }
    return char;
  };

  const spinner = SPINNER_FRAMES[spinnerFrame % SPINNER_FRAMES.length];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: isMobile ? "0 16px 16px 16px" : "0 16px 16px 44px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 12,
          color: fg,
          whiteSpace: "pre",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ opacity: 0.4 }}>{spinner}</span>
        <span>
          {displayText.split("").map((char, index) => (
            <span key={`${currentSentenceIndex}-${index}-${glitchFrame}-${decoderPosition}`}>
              {getCharAtPosition(char, index)}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}