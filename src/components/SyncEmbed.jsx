import { useEffect, useRef, useState } from "react";

export default function SyncEmbed({ muted = true }) {
  const ref = useRef(null);
  const mutedRef = useRef(muted);

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"
  );
  useEffect(() => {
    const read = () => setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  mutedRef.current = muted;

  useEffect(() => {
    const f = ref.current;
    if (!f) return;

    // Sync re-calls ctx.resume() on EVERY sound, so a plain suspend() gets undone
    // instantly. To actually mute, we suspend AND replace resume() with a no-op while
    // muted, then restore it on unmute. Same-origin only.
    const gate = (ctx) => {
      if (!ctx) return;
      if (!ctx.__pgOrigResume) ctx.__pgOrigResume = ctx.resume.bind(ctx);
      if (mutedRef.current) {
        ctx.resume = () => Promise.resolve(); // block Sync's self-resume
        try { ctx.suspend(); } catch {}
      } else {
        ctx.resume = ctx.__pgOrigResume;       // give resume back
        try { ctx.__pgOrigResume(); } catch {}
      }
    };

    // Capture every AudioContext the app creates and gate it immediately on creation,
    // so a context made while muted starts silenced.
    const patch = () => {
      try {
        const w = f.contentWindow;
        if (!w || w.__pgAudioPatched) return;
        const Native = w.AudioContext || w.webkitAudioContext;
        if (!Native) return;
        w.__pgAudioPatched = true;
        w.__pgContexts = [];
        const Patched = function (...args) {
          const ctx = new Native(...args);
          w.__pgContexts.push(ctx);
          gate(ctx);
          return ctx;
        };
        Patched.prototype = Native.prototype;
        if (w.AudioContext) w.AudioContext = Patched;
        if (w.webkitAudioContext) w.webkitAudioContext = Patched;
      } catch {}
    };

    const apply = () => {
      try {
        const w = f.contentWindow;
        [w._syncAC, ...(w.__pgContexts || [])].filter(Boolean).forEach(gate);
      } catch {}
    };

    patch();
    apply();
    const onLoad = () => { patch(); apply(); };
    f.addEventListener("load", onLoad);
    return () => f.removeEventListener("load", onLoad);
  }, [muted]);

  // top/height replicate the original card framing (crops to the centered 600 frame).
  return (
    <iframe
      ref={ref}
      className="sync-embed"
      src="/playground/sync/index.html?embed=1"
      title="Sync"
      scrolling="no"
      tabIndex={-1}
      allow="autoplay"
      style={{
        position: "absolute",
        top: "-25%",
        left: 0,
        width: "100%",
        height: "150%",
        border: "none",
        display: "block",
        background: isDark ? "#101010" : "#FCFCFC",
      }}
    />
  );
}