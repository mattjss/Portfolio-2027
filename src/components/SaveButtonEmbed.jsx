import { useEffect, useRef } from "react";

export default function SaveButtonEmbed({ muted = true }) {
  const ref = useRef(null);

  // hover mute (harmless no-op if the app doesn't implement setMuted)
  useEffect(() => {
    const f = ref.current;
    if (!f) return;
    const send = () => { try { f.contentWindow.postMessage({ type: "setMuted", muted }, "*"); } catch {} };
    send();
    f.addEventListener("load", send);
    return () => f.removeEventListener("load", send);
  }, [muted]);

  // mirror the site's light/dark theme into the embed
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
      src="/playground/save-button/index.html?embed=1"
      title="Save Button"
      scrolling="no"
      tabIndex={-1}
      allow="autoplay"
      style={{ position: "absolute", top: "-5%", left: "-5%", width: "110%", height: "110%", border: "none", display: "block" }}
    />
  );
}