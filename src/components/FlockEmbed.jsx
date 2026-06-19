import { useEffect, useRef } from "react";

export default function FlockEmbed({ muted = true }) {
  const ref = useRef(null);

  // unmute on hover / mute on leave — the original flock.html listens for this
  useEffect(() => {
    const f = ref.current;
    if (!f) return;
    const send = () => { try { f.contentWindow.postMessage({ type: "setMuted", muted }, "*"); } catch {} };
    send();
    f.addEventListener("load", send);
    return () => f.removeEventListener("load", send);
  }, [muted]);

  return (
    <iframe
      ref={ref}
      src="/playground/flock/index.html?embed=1"
      title="Flock"
      scrolling="no"
      tabIndex={-1}
      allow="autoplay"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block", background: "#101010" }}
    />
  );
}