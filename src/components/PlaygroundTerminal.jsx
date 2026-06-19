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

// Native terminal hero for the Playground — same structure/classes/engine as the
// About terminal (reuses the .about-terminal* CSS), only the scenes differ.
export default function PlaygroundTerminal() {
  const outRef = useRef(null);
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
      if (actx.state === "suspended") actx.resume();
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

    function successChime() {
      if (!terminalAudible || mutedRef.current) return;
      try {
        const c = ac();
        [[880, 0, 0.12, 0.15], [1108, 0.18, 0.10, 0.18]].forEach(([hz, delay, vol, decay]) => {
          const osc = c.createOscillator(), g = c.createGain();
          osc.type = "sine"; osc.frequency.value = hz;
          osc.connect(g); g.connect(c.destination);
          const t = c.currentTime + delay;
          g.gain.setValueAtTime(vol, t);
          g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
          osc.start(t); osc.stop(t + decay + 0.01);
        });
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

    function spinFor(label, ms, gen) {
      const line = addLine("");
      const span = document.createElement("span"); line.appendChild(span);
      let si = 0;
      span.innerHTML = `<span class="v">${SPIN[si]}</span> ${label}`;
      return new Promise((res, rej) => {
        const iv = setInterval(() => {
          if (runGen !== gen) { clearInterval(iv); rej(0); return; }
          si = (si + 1) % SPIN.length;
          span.innerHTML = `<span class="v">${SPIN[si]}</span> ${label}`;
        }, 100);
        setTimeout(() => {
          clearInterval(iv);
          runGen === gen ? res(line) : rej(0);
        }, ms);
      });
    }

    // ── Scenes (agentic) ───────────────────────────────────────
    async function sceneDinner(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "reserve dinner tonight", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor([
        "red meat: 0 of 1 this week",
        "you hit the gym today",
        "protein's the priority",
      ], 3800, gen);

      addLine('<span class="v">House of Prime Rib</span>  <span class="d">0.8mi · Van Ness</span>');
      blip(); await waitG(250, gen);
      addLine('<span class="mk">—</span> <span class="m">why</span>      <span class="v">no red meat this week</span>  <span class="d">(0 / 1)</span>');
      blip(); await waitG(190, gen);
      addLine('<span class="mk">—</span> <span class="m">table</span>    <span class="v">window · 8:00pm · 2 seats</span>');
      blip(); await waitG(190, gen);
      addLine('<span class="mk">—</span> <span class="m">budget</span>   <span class="v">~$110pp</span>  <span class="d">within range</span>');
      blip(); await waitG(340, gen);

      const l1 = await spinFor("reserving", 2200, gen);
      l1.innerHTML = '<span class="g">confirmed</span>  8:00pm · table for 2  <span class="d">2.1s</span>';
      successChime(); await waitG(200, gen);
      addLine('view reservation  <span class="d">#R-4829 · Prime Rib</span>');
      blip(); await waitG(500, gen);

      await thinkFor(["timing ride around your 8pm"], 2200, gen);

      const l2 = await spinFor("scheduling ride", 1000, gen);
      l2.innerHTML = '<span class="g">ride confirmed</span>  <span class="d">1.4s</span>';
      successChime(); await waitG(200, gen);
      addLine('<span class="v">Cybercab</span>  <span class="d">departs 7:40pm · arrives 8:02pm</span>');
      blip(); await waitG(190, gen);
      addLine('view ride  <span class="d">#C-2291 · Tesla</span>');
      blip();
    }

    async function sceneFun(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "play golf", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["checking your week", "tallying your stats"], 2600, gen);

      addLine('<span class="mk">—</span> <span class="m">run</span>     <span class="v">52mi</span>  <span class="d">goal 40mi</span>  <span class="g">✓</span>');
      blip(); await waitG(220, gen);
      addLine('<span class="mk">—</span> <span class="m">code</span>    <span class="v">4,820 lines</span>  <span class="g">✓</span>');
      blip(); await waitG(220, gen);
      addLine('<span class="mk">—</span> <span class="m">meals</span>   <span class="v">clean</span>  <span class="d">6 of 7 days</span>  <span class="g">✓</span>');
      blip(); await waitG(360, gen);

      addLine('<span class="mk">top tier unlocked</span>  <span class="d">2 courses available</span>');
      blip(); await waitG(380, gen);

      addLine('<span class="m">The Olympic Club</span>    <span class="d">7mi</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="v">Pebble Beach</span>        <span class="d">32mi</span>  <span class="mk">← best match</span>');
      blip(); await waitG(440, gen);

      const l1 = await spinFor("booking", 2400, gen);
      l1.innerHTML = '<span class="g">confirmed</span>  Pebble Beach · Sat 8:30am  <span class="d">1.8s</span>';
      successChime(); await waitG(200, gen);
      addLine('view booking  <span class="d">#G-2291 · Pebble Beach</span>');
      blip(); await waitG(500, gen);

      const l2 = await spinFor("scheduling ride", 1800, gen);
      l2.innerHTML = '<span class="g">ride confirmed</span>  <span class="d">1.2s</span>';
      successChime(); await waitG(200, gen);
      addLine('<span class="v">Cybercab</span>  <span class="d">departs 7:45am · arrives 8:15am</span>');
      blip(); await waitG(190, gen);
      addLine('view ride  <span class="d">#C-8847 · Tesla</span>');
      blip();
    }

    async function sceneMorning(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "morning brief", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor([
        "syncing health data",
        "pulling your schedule",
        "checking weather",
      ], 3200, gen);

      addLine('<span class="mk">—</span> <span class="m">sleep</span>    <span class="v">6h 42m</span>  <span class="d">deep 1h 12m</span>  <span class="g">✓</span>');
      blip(); await waitG(220, gen);
      addLine('<span class="mk">—</span> <span class="m">hrv</span>      <span class="v">68ms</span>  <span class="d">+4 from yesterday</span>  <span class="g">✓</span>');
      blip(); await waitG(220, gen);
      addLine('<span class="mk">—</span> <span class="m">weather</span>  <span class="v">62°F · clear</span>  <span class="d">SF · no rain</span>');
      blip(); await waitG(300, gen);

      addLine("");
      addLine('<span class="d">today</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="m">9:00am</span>   <span class="v">standup</span>  <span class="d">eng team · 15min</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">1:00pm</span>   <span class="v">figma review</span>  <span class="d">← prep deck</span>');
      blip(); await waitG(340, gen);

      addLine("");
      await thinkFor(["meal timing", "gym window"], 1600, gen);

      addLine('<span class="mk">—</span> <span class="m">gym</span>      <span class="v">7:30 – 9:00am</span>  <span class="d">window open</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">meals</span>    <span class="v">3 clean meals prepped</span>  <span class="g">✓</span>');
      blip();
    }

    async function sceneTrip(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "find a trip", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor([
        "Jun 14–18 window clear",
        "scanning flights + hotels",
        "checking budget",
      ], 3600, gen);

      addLine('<span class="v">Tulum, MX</span>  <span class="d">Jun 14–18 · 5 nights · 2 tickets</span>');
      blip(); await waitG(240, gen);
      addLine('<span class="mk">—</span> <span class="m">flight</span>   <span class="v">$640/pp · nonstop</span>  <span class="d">AA · SFO → CUN</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">hotel</span>    <span class="v">Casa Malca</span>  <span class="d">boutique · beachfront · $320/night</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">total</span>    <span class="v">$2,880</span>  <span class="d">flights + 5 nights</span>');
      blip(); await waitG(380, gen);

      const l1 = await spinFor("booking flights", 2600, gen);
      l1.innerHTML = '<span class="g">confirmed</span>  Jun 14 · AA 847 · SFO → CUN  <span class="d">3.2s</span>';
      successChime(); await waitG(200, gen);
      addLine('view booking  <span class="d">#F-2291 · American Airlines</span>');
      blip(); await waitG(420, gen);

      const l2 = await spinFor("reserving hotel", 2000, gen);
      l2.innerHTML = '<span class="g">confirmed</span>  Casa Malca · Jun 14–18  <span class="d">2.8s</span>';
      successChime(); await waitG(200, gen);
      addLine('view booking  <span class="d">#H-4429 · Tulum</span>');
      blip();
    }

    async function sceneWorkout(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "build my workout", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor([
        "checking recovery score",
        "reviewing last 7 days",
        "last push day: 3 days ago",
      ], 3000, gen);

      addLine('<span class="mk">—</span> <span class="m">recovery</span>  <span class="v">82</span>  <span class="d">+6 from yesterday</span>  <span class="g">ready to push</span>');
      blip(); await waitG(260, gen);
      addLine('<span class="mk">—</span> <span class="m">split</span>     <span class="v">push day</span>  <span class="d">chest / shoulders / tris</span>');
      blip(); await waitG(340, gen);

      addLine("");
      addLine('<span class="d">program</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="m">bench press</span>   <span class="v">4×8</span>  <span class="d">185lb</span>  <span class="g">↑ 10lb</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">incline db</span>     <span class="v">3×10</span>  <span class="d">65lb</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">cable fly</span>      <span class="v">3×15</span>  <span class="d">25lb</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">ohp</span>            <span class="v">3×8</span>   <span class="d">115lb</span>');
      blip(); await waitG(380, gen);

      const l1 = await spinFor("scheduling", 1200, gen);
      l1.innerHTML = '<span class="g">added to calendar</span>  gym · 6:00am · 90min  <span class="d">1.1s</span>';
      successChime();
      blip();
    }

    // ── Scene registry / loop ──────────────────────────────────
    const SCENE_NAMES = ["dinner reservation", "golf round", "morning brief", "find a trip", "build workout"];
    const SCENE_FNS = [sceneDinner, sceneFun, sceneMorning, sceneTrip, sceneWorkout];
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
      setLabel();
      try {
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
  );
}