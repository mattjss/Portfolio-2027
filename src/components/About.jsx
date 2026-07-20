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
import Header from "./Header";
import Socials from "./Socials";
import ClockwiseCta from "./ClockwiseCta";
import ProfileBadge from "./ProfileBadge";

function About() {
  const outRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const sceneRef = useRef(null);
  const heroRef = useRef(null);
  const [heroMuted, setHeroMuted] = useState(true);
  const mutedRef = useRef(true);

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
    async function sceneAbout(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "about me", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["loading profile", "resolving identity"], 2200, gen);

      addLine('<span class="mk">—</span> <span class="m">born</span>      <span class="v">San Francisco, CA</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">raised</span>    <span class="v">San Diego, CA</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">based</span>     <span class="v">San Diego, CA</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="m">role</span>      <span class="v">product designer</span>  <span class="d">· 11 years</span>');
      blip(); await waitG(340, gen);

      addLine("");
      addLine('<span class="d">experience</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">Rowan</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">MakersPlace</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Olympus Finance</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">The Action Network</span>');
      blip();

      if (window.innerWidth > 480) {
        await waitG(340, gen);
        addLine("");
        addLine('<span class="d">tools</span>');
        blip(); await waitG(180, gen);
        addLine('<span class="mk">—</span> <span class="v">Figma</span>');
        blip(); await waitG(200, gen);
        addLine('<span class="mk">—</span> <span class="v">Claude Code</span>');
        blip(); await waitG(200, gen);
        addLine('<span class="mk">—</span> <span class="v">Cursor</span>');
        blip(); await waitG(200, gen);
        addLine('<span class="mk">—</span> <span class="v">Perplexity</span>');
        blip();
      }
    }

    async function sceneProInterests(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "interests --pro", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "indexing skills"], 1800, gen);

      addLine('<span class="d">professional interests</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">human-computer interaction</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">applied AI</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">systems</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Japanese + Swiss graphic design</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">creative coding</span>');
      blip();
    }

    async function scenePersonalInterests(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "interests --personal", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading file", "parsing entries"], 1800, gen);

      addLine('<span class="d">personal interests</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">family + friends</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">museums</span>  <span class="d">· fine art · architecture</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">cars</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">horology</span>  <span class="d">· Swiss watchmaking</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">U.S. history</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">backpack camping</span>  <span class="d">+ fishing</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">traveling the world</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">golf</span>  <span class="d">· 1.7 hcp</span>');
      blip();
    }

    async function sceneSports(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "sports --teams", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["loading rosters", "checking standings", "pulling prospects"], 2600, gen);

      addLine('<span class="mk">—</span> <span class="v">San Francisco Giants</span>     <span class="d">MLB</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">San Francisco 49ers</span>      <span class="d">NFL</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Golden State Warriors</span>    <span class="d">NBA</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">San Jose Sharks</span>          <span class="d">NHL</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">San Diego FC</span>             <span class="d">MLS</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Liverpool</span>               <span class="d">EPL</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Univ. of Maine Hockey</span>    <span class="d">Hockey East</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Boston University</span>        <span class="d">Hockey East</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Stanford Golf + Baseball</span> <span class="d">NCAA</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Florida Basketball + Football</span>  <span class="d">NCAA</span>');
      blip(); await waitG(320, gen);
      addLine('<span class="d">also: prospects — hockey + golf scouting</span>');
      blip();
    }

    async function sceneHealthFood(gen) {
      const { cmd, cur } = mkPrompt("matt");
      await waitG(700, gen);
      await type(cmd, "health --habits", gen);
      enterClick(); await waitG(140, gen); cur.remove();

      await thinkFor(["reading habits", "checking routine"], 1800, gen);

      addLine('<span class="d">fitness</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">gym</span>  <span class="d">· lifting + strength</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">running</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">yoga</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">whole foods</span>  <span class="d">· no seed oils · water</span>');
      blip(); await waitG(340, gen);

      addLine("");
      addLine('<span class="d">cheat meals</span>');
      blip(); await waitG(180, gen);
      addLine('<span class="mk">—</span> <span class="v">cheeseburgers</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">california burritos</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">sushi</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">pizza</span>');
      blip(); await waitG(200, gen);
      addLine('<span class="mk">—</span> <span class="v">Mexican Coca-Cola</span>');
      blip();
    }

    // ── Scene registry / loop ──────────────────────────────────
    const SCENE_NAMES = ["about me", "interests --pro", "interests --personal", "sports --teams", "health --habits"];
    const SCENE_FNS = [
      sceneAbout,
      sceneProInterests,
      scenePersonalInterests,
      sceneSports,
      sceneHealthFood,
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
        await waitG(700, gen);
        await SCENE_FNS[sceneIdx](gen);
        await waitG(500, gen);
        mkPrompt("matt");
        await waitG(3200, gen);
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

      <main>
        <section className="about-terminal about-terminal--bio" ref={heroRef}>
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

        <section className="about-bio">
          <div className="container">
            <div className="about-bio-main">
              <ProfileBadge />
              <div className="about-bio-line">
                <p>
                  I&rsquo;m an AI&#8209;native product designer focused on strategy, craft, and code.
                  For the past decade I&rsquo;ve worked mostly in 0&ndash;1 spaces, helping take products
                  from concept to launch in domains like crypto and sports betting.
                </p>
                <p>
                  Right now I&rsquo;m deep into creative coding, motion, and applied AI, experimenting
                  with how design can make everyday interactions feel simpler and more natural.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default About;