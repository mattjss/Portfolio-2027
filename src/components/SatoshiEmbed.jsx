import { useEffect, useRef } from "react";

export default function SatoshiEmbed({ muted = true }) {
  const ref = useRef(null);

  // hover mute → Satoshi listens for { type:"setMuted" }
  useEffect(() => {
    const f = ref.current;
    if (!f) return;
    const send = () => { try { f.contentWindow.postMessage({ type: "setMuted", muted }, "*"); } catch {} };
    send();
    f.addEventListener("load", send);
    return () => f.removeEventListener("load", send);
  }, [muted]);

  // mirror the site's light/dark theme into the embed (matches its big preview)
  useEffect(() => {
    const f = ref.current;
    if (!f) return;
    const sendTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme") || "light";
      try { f.contentWindow.postMessage({ type: "theme", theme }, "*"); } catch {}
    };
    sendTheme();
    f.addEventListener("load", sendTheme);
    const obs = new MutationObserver(sendTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { f.removeEventListener("load", sendTheme); obs.disconnect(); };
  }, []);

  return (
    <iframe
      ref={ref}
      src="/playground/satoshi/index.html?embed=1"
      title="Satoshi"
      scrolling="no"
      tabIndex={-1}
      allow="autoplay"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block"}}
    />
  );
}