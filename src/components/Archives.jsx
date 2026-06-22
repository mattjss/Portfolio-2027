import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Socials from "./Socials";
import ClockwiseCta from "./ClockwiseCta";

import ProductCard, { PreviewModal } from "./ProductCard";
import FEATURED_WORKS from "../data/featuredWorks";
import ARCHIVES_EMBEDS from "../data/archivesEmbeds";

/* ── Icons (same as Playground) ─────────────────────────────── */
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


/* ── Embed card — identical behaviour to Playground's ComponentCard ── */
const EllipsisIcon = () => (
  <svg viewBox="0 0 16 16">
    <circle cx="3.5" cy="8" r="1.3" fill="currentColor" />
    <circle cx="8" cy="8" r="1.3" fill="currentColor" />
    <circle cx="12.5" cy="8" r="1.3" fill="currentColor" />
  </svg>
);

function EmbedCard({ item, onOpen }) {
  const [enabled, setEnabled] = useState(true);
  const [hovered, setHovered] = useState(false);
  const muted = !(item.sound && enabled && hovered);
  const Comp = item.Component;

  return (
    <div
      className="pg-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pg-card-inner">
        <div
          className={`pg-embed${item.themed ? " pg-themed-embed" : ""}`}
          style={item.embedBg ? { background: item.embedBg } : undefined}
        >
          <Comp muted={muted} />
        </div>

                <div className="pg-card-controls">
          {item.sound && (
            <button
              className="pg-ctrl-btn"
              aria-label="Toggle sound"
              onClick={(e) => { e.stopPropagation(); setEnabled((v) => !v); }}
            >
              {enabled ? <SoundOnIcon /> : <SoundOffIcon />}
            </button>
          )}
          <button
            className="pg-ctrl-btn"
            aria-label={item.open?.label || "Open preview"}
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
          >
            <EllipsisIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function Archives() {
  const outRef = useRef(null);
  const [modalIndex, setModalIndex] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sceneRef = useRef(null);
  const heroRef = useRef(null);
  const [heroMuted, setHeroMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => {
    const out = outRef.current;
    if (!out) return;

    // ── Mute terminal sounds when the terminal isn't in view ───
    let terminalAudible = true;
    let io;
    const heroEl = heroRef.current;
    if (heroEl && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([e]) => { terminalAudible = e.intersectionRatio >= 0.5; },
        { threshold: 0.5 }
      );
      io.observe(heroEl);
    }

    // ── Web Audio ──────────────────────────────────────────────
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
      if (!terminalAudible || mutedRef.current) return;
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
      } catch { /* ignore */ }
    }

    function enterClick() {
      if (!terminalAudible || mutedRef.current) return;
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
      } catch { /* ignore */ }
    }

    function blip() {
      if (!terminalAudible || mutedRef.current) return;
      try {
        const c = ac(), t = c.currentTime;
        const noise = mkNoise(c, 0.004);
        const ng = c.createGain();
        ng.gain.setValueAtTime(0.05, t);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.005);
        noise.connect(ng); ng.connect(c.destination);
        noise.start(); noise.stop(t + 0.006);
      } catch { /* ignore */ }
    }

    // ── Helpers ────────────────────────────────────────────────
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let runGen = 0;
    const waitG = (ms, gen) =>
      new Promise((res, rej) => setTimeout(() => (runGen === gen ? res() : rej(0)), ms));

    function addLine(html = "") {
      const el = document.createElement("span");
      el.className = "line";
      el.innerHTML = html;
      out.appendChild(el);
      return el;
    }

    function mkPrompt(user = "matt") {
      const el = document.createElement("span"); el.className = "line";
      const pr = document.createElement("span"); pr.className = "p"; pr.textContent = user + " › ";
      const cmd = document.createElement("span");
      const cur = document.createElement("span"); cur.className = "cursor";
      el.appendChild(pr); el.appendChild(cmd); el.appendChild(cur);
      out.appendChild(el);
      return { cmd, cur };
    }

    async function type(cmdEl, text, gen) {
      for (const ch of text) {
        if (runGen !== gen) throw 0;
        cmdEl.textContent += ch;
        keyClick();
        await wait(46 + Math.random() * 62);
      }
    }

    const SPIN = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];

    function thinkFor(messages, ms, gen) {
      const line = addLine("");
      const span = document.createElement("span"); line.appendChild(span);
      let si = 0, mi = 0, frames = 0;
      span.innerHTML = `<span class="v">${SPIN[si]}</span>  <span class="d">${messages[mi]}</span>`;
      return new Promise((res, rej) => {
        const iv = setInterval(() => {
          if (runGen !== gen) { clearInterval(iv); line.remove(); rej(0); return; }
          si = (si + 1) % SPIN.length;
          if (++frames % 12 === 0) mi = (mi + 1) % messages.length;
          span.innerHTML = `<span class="v">${SPIN[si]}</span>  <span class="d">${messages[mi]}</span>`;
        }, 100);
        setTimeout(() => {
          clearInterval(iv);
          line.remove();
          runGen === gen ? res() : rej(0);
        }, ms);
      });
    }

    // ── Scenes ─────────────────────────────────────────────────
    async function sceneQualcomm(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "cat qualcomm.md", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entry"], 1800, gen);

      addLine('<span class="mk">qualcomm</span>');
      blip(); await waitG(160, gen);
      addLine('<span class="m">role</span>       <span class="wh">UX Researcher</span>  <span class="d">· contract</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">location</span>   <span class="d">San Diego, CA</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">period</span>     <span class="d">2010</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="mk">—</span> <span class="v">UX research for Qualcomm Retail Solutions</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">conducted research on the Swagg App</span>  <span class="d">· iOS + Android</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">user interviews, usability testing, and synthesis</span>');
      blip();
    }

    async function sceneMattSilvermanDesign(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "cat matt-silverman-design.md", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entry"], 1800, gen);

      addLine('<span class="mk">matt silverman design</span>');
      blip(); await waitG(160, gen);
      addLine('<span class="m">role</span>       <span class="wh">Designer</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">location</span>   <span class="d">San Diego and San Francisco, CA</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">period</span>     <span class="d">2012 — 2018</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="mk">—</span> <span class="v">independent designer working with early-stage startups on strategy, product design, and GTM execution</span>');
      blip();
    }

    async function sceneActionNetwork(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "cat action-network.md", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entry"], 1800, gen);

      addLine('<span class="mk">the action network</span>');
      blip(); await waitG(160, gen);
      addLine('<span class="m">role</span>       <span class="wh">Product Designer</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">location</span>   <span class="d">San Francisco, CA</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">period</span>     <span class="d">2019 — 2020</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="mk">—</span> <span class="v">product design for a sports betting analytics platform</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">odds displays, line movement, and bet tracking UI</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">high-information density design for fast decisions</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">shipped across iOS, Android, and Web</span>');
      blip();
    }

    async function sceneOlympus(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "cat olympus-finance.md", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entry"], 1800, gen);

      addLine('<span class="mk">olympus finance</span>');
      blip(); await waitG(160, gen);
      addLine('<span class="m">role</span>       <span class="wh">Lead Product Designer</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">location</span>   <span class="d">San Francisco, CA (remote)</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">period</span>     <span class="d">2021 — 2022</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="mk">—</span> <span class="v">designed UX for a DeFi bonding and staking protocol</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">dashboard design for on-chain treasury mechanics</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">brand and interface work during rapid growth phase</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">shipped at speed in a high-stakes protocol environment</span>');
      blip();
    }

    async function sceneMakersPlace(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "cat makersplace.md", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entry"], 1800, gen);

      addLine('<span class="mk">makersplace</span>');
      blip(); await waitG(160, gen);
      addLine('<span class="m">role</span>       <span class="wh">Sr. Product Designer</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">location</span>   <span class="d">San Francisco, CA (remote)</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">period</span>     <span class="d">2022 — 2025</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="mk">—</span> <span class="v">led product design for an NFT fine art marketplace and gallery</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">built and owned the design system from scratch</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">redesigned all legacy pages</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">designed complex creator and collector flows</span>');
      blip();
    }

    async function sceneStateMachine(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "cat state-machine.md", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entry"], 1800, gen);

      addLine('<span class="mk">state machine</span>');
      blip(); await waitG(160, gen);
      addLine('<span class="m">role</span>       <span class="wh">Product Designer · Design Engineer</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">location</span>   <span class="d">San Diego, CA</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">period</span>     <span class="d">2025 — present</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="mk">—</span> <span class="v">independent design, engineering, and research practice for applied AI</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">running focused experiments on AI-native products, interfaces, and workflows</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">currently building Rowan</span>');
      blip();
    }

    async function sceneRowan(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "cat rowan.md", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entry"], 1800, gen);

      addLine('<span class="mk">rowan</span>');
      blip(); await waitG(160, gen);
      addLine('<span class="m">role</span>       <span class="wh">Founder · Product & Design</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">location</span>   <span class="d">San Diego, CA</span>');
      blip(); await waitG(140, gen);
      addLine('<span class="m">period</span>     <span class="d">2025 — present</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="mk">—</span> <span class="v">AI listing assistant for real estate agents</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">the real estate agents, agent</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">designed and built the product, brand, and design system</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">shipped end-to-end: web app, deck engine, marketing site</span>');
      blip();
    }

    // ── Scene registry / loop ──────────────────────────────────
    const SCENE_NAMES = ["qualcomm.md", "matt-silverman-design.md", "action-network.md", "olympus-finance.md", "makersplace.md", "state-machine.md", "rowan.md"];
    const SCENE_FNS = [
      sceneQualcomm,
      sceneMattSilvermanDesign,
      sceneActionNetwork,
      sceneOlympus,
      sceneMakersPlace,
      sceneStateMachine,
      sceneRowan,
    ];
    let sceneIdx = 0;

    function setLabel() {
      if (sceneRef.current) sceneRef.current.textContent = SCENE_NAMES[sceneIdx];
    }

    function switchScene(idx) {
      sceneIdx = ((idx % SCENE_FNS.length) + SCENE_FNS.length) % SCENE_FNS.length;
      runGen++;
      out.innerHTML = "";
      setTimeout(() => run(), 400);
    }

    async function run() {
      const gen = ++runGen;
      out.innerHTML = "";
      setLabel(); // show current scene name under the arrows
      try {
        addLine('<span class="mk">matt silverman</span>  <span class="d">design</span>');
        addLine("");
        await waitG(700, gen);
        await SCENE_FNS[sceneIdx](gen);
        await waitG(500, gen);
        mkPrompt("matt");
        await waitG(5000 + Math.random() * 1000, gen);
        sceneIdx = (sceneIdx + 1) % SCENE_FNS.length;
        run();
      } catch { /* superseded run — ignore */ }
    }

    // ── Wiring ─────────────────────────────────────────────────
    const prevBtn = prevRef.current;
    const nextBtn = nextRef.current;
    const onPrev = () => switchScene(sceneIdx - 1);
    const onNext = () => switchScene(sceneIdx + 1);
    if (prevBtn) prevBtn.addEventListener("click", onPrev);
    if (nextBtn) nextBtn.addEventListener("click", onNext);

    const unlock = () => ac();
    document.addEventListener("click", unlock, { once: true });

    run();

    // ── Cleanup (also handles StrictMode double-mount) ─────────
    return () => {
      runGen++;
      if (io) io.disconnect();
      if (prevBtn) prevBtn.removeEventListener("click", onPrev);
      if (nextBtn) nextBtn.removeEventListener("click", onNext);
      document.removeEventListener("click", unlock);
      out.innerHTML = "";
      if (actx) actx.close();
    };
  }, []);

  return (
    <>
      <Header />
      <Socials />
      <ClockwiseCta />

      <section className="about-terminal" ref={heroRef}>
        <div className="container">
          <div className="about-terminal-card">
            <div className="about-terminal-body">
              <div className="about-terminal-output" ref={outRef}></div>
            </div>
            <div className="about-terminal-bottom">
              <div className="about-terminal-controls">
                <button className="paddle" ref={prevRef} aria-label="Previous">
                  <svg width="9" height="14" viewBox="0 0 9 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6.5,1.5 2.5,7 6.5,12.5" />
                  </svg>
                </button>
                <button className="paddle" ref={nextRef} aria-label="Next">
                  <svg width="9" height="14" viewBox="0 0 9 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2.5,1.5 6.5,7 2.5,12.5" />
                  </svg>
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="about-terminal-meta" ref={sceneRef}></span>
                <button
                  className="pg-ctrl-btn"
                  aria-label="Toggle sound"
                  onClick={() => { const next = !heroMuted; setHeroMuted(next); mutedRef.current = next; }}
                >
                  {heroMuted ? <SoundOffIcon /> : <SoundOnIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="archives-projects">
        <div className="container">
          <div className="row gx-4 gy-4">
            {FEATURED_WORKS.map((item, i) => (
              <div className="col-sm-6 col-xl-4" key={i}>
                {i === 0 ? (
                  <EmbedCard item={ARCHIVES_EMBEDS[0]} onOpen={() => setModalIndex(0)} />
                ) : i === 1 ? (
                  <EmbedCard item={ARCHIVES_EMBEDS[1]} onOpen={() => setModalIndex(1)} />
                ) : (
                  <ProductCard item={item} items={FEATURED_WORKS} index={i} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalIndex !== null && (
        <PreviewModal
          items={ARCHIVES_EMBEDS}
          initialIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  );
}

export default Archives;