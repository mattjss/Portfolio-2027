import { useEffect, useRef, useState } from "react";

const SoundOnIcon = () => (
  <svg viewBox="0 0 16 16">
    <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="currentColor" />
    <path d="M10 5.5a4 4 0 0 1 0 5M12.5 3a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </svg>
);
const SoundOffIcon = () => (
  <svg viewBox="0 0 16 16">
    <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="currentColor" />
    <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </svg>
);

const LINES = [
  { text: "Matt Silverman" },
  { text: "Based in San Diego, California" },
  { text: "AI-native product designer building products\nthrough strategy, craft, and code." },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function Hero() {
  const h1Ref = useRef(null);
  const heroRef = useRef(null);
  const audibleRef = useRef(true);
  const [heroMuted, setHeroMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;

    let cancelled = false;

    let io;
    const heroEl = heroRef.current;
    if (heroEl && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([e]) => { audibleRef.current = e.intersectionRatio >= 0.5; },
        { threshold: 0.5 }
      );
      io.observe(heroEl);
    }

    h1.innerHTML = "";

    const cursor = document.createElement("span");
    cursor.className = "cursor";

    // ── Build all line slots up front (empty text nodes + every <br>) ──
    // Keeps your markup shape: name & location are plain text in <h1>,
    // tagline lives in a <span> (so only it gets `h1 span` styling).
    // All four lines exist from frame one → nothing reflows while typing.
    const t0 = document.createTextNode("");
    h1.appendChild(t0);
    h1.appendChild(document.createElement("br"));

    const t1 = document.createTextNode("");
    h1.appendChild(t1);
    h1.appendChild(document.createElement("br"));

    const tagline = document.createElement("span");
    h1.appendChild(tagline);
    const [tagA, tagB] = LINES[2].text.split("\n");
    const tA = document.createTextNode("");
    tagline.appendChild(tA);
    tagline.appendChild(document.createElement("br"));
    const tB = document.createTextNode("");
    tagline.appendChild(tB);

    const segments = [
      { node: t0, text: LINES[0].text, brk: "enter" },
      { node: t1, text: LINES[1].text, brk: "enter" },
      { node: tA, text: tagA,          brk: "silent" },
      { node: tB, text: tagB,          brk: null },
    ];

    // ── Web Audio setup ──
    let actx = null;
    const ac = () => {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      return actx;
    };

    function mkNoise(c, dur) {
      const n = Math.ceil(c.sampleRate * dur);
      const buf = c.createBuffer(1, n, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource();
      src.buffer = buf;
      return src;
    }

    function keyClick() {
      if (!audibleRef.current || mutedRef.current) return;
      try {
        const c = ac(), t = c.currentTime;
        const noise = mkNoise(c, 0.005);
        const ng = c.createGain();
        ng.gain.setValueAtTime(0.14, t);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.006);
        noise.connect(ng); ng.connect(c.destination);
        noise.start(); noise.stop(t + 0.007);
        const osc = c.createOscillator(), og = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(300 + Math.random() * 60, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);
        osc.connect(og); og.connect(c.destination);
        og.gain.setValueAtTime(0.055, t);
        og.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
        osc.start(); osc.stop(t + 0.05);
      } catch {
        /* ignore */
      }
    }

    function enterClick() {
      if (!audibleRef.current || mutedRef.current) return;
      try {
        const c = ac(), t = c.currentTime;
        const noise = mkNoise(c, 0.008);
        const ng = c.createGain();
        ng.gain.setValueAtTime(0.22, t);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.01);
        noise.connect(ng); ng.connect(c.destination);
        noise.start(); noise.stop(t + 0.012);
        const osc = c.createOscillator(), og = c.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.055);
        osc.connect(og); og.connect(c.destination);
        og.gain.setValueAtTime(0.08, t);
        og.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        osc.start(); osc.stop(t + 0.065);
      } catch {
        /* ignore */
      }
    }

    function successChime() {
      if (!audibleRef.current || mutedRef.current) return;
      try {
        const c = ac();
        [[880, 0, 0.12, 0.15], [1108, 0.18, 0.10, 0.18]].forEach(([hz, delay, vol, decay]) => {
          const osc = c.createOscillator(), g = c.createGain();
          osc.type = "sine";
          osc.frequency.value = hz;
          osc.connect(g); g.connect(c.destination);
          const t = c.currentTime + delay;
          g.gain.setValueAtTime(vol, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
          osc.start(t); osc.stop(t + decay + 0.01);
        });
      } catch {
        /* ignore */
      }
    }

    // ── Typing: fill the pre-made slots, slide the cursor through them ──
    async function run() {
      await sleep(420);
      for (let s = 0; s < segments.length; s++) {
        if (cancelled) return;
        const seg = segments[s];

        // Park the (zero-width) cursor right after this slot's text node.
        seg.node.parentNode.insertBefore(cursor, seg.node.nextSibling);

        for (const ch of seg.text) {
          if (cancelled) return;
          seg.node.textContent += ch;
          keyClick();
          await sleep(36 + Math.random() * 30);
        }

        if (cancelled) return;
        if (seg.brk === "enter") {
          enterClick();
          await sleep(220);
        }
        // "silent" / null: line already exists, just continue
      }
      if (!cancelled) successChime();
    }

    const unlock = () => ac();
    ["click", "keydown", "touchstart"].forEach((e) =>
      document.addEventListener(e, unlock, { once: true, passive: true })
    );

    run();

    return () => {
      cancelled = true;
      if (io) io.disconnect();
      cursor.remove();
      h1.innerHTML = "";
      ["click", "keydown", "touchstart"].forEach((e) =>
        document.removeEventListener(e, unlock)
      );
      if (actx) actx.close();
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-frame">
        <h1 ref={h1Ref}></h1>
        <div className="hero-frame-bottom">
          <button
            className="pg-ctrl-btn"
            aria-label="Toggle sound"
            onClick={() => { const next = !heroMuted; setHeroMuted(next); mutedRef.current = next; }}
          >
            {heroMuted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;