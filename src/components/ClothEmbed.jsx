import { useEffect, useRef } from "react";

export default function ClothEmbed({ muted = true }) {
  const ref = useRef(null);

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
      src="/playground/cloth/index.html?embed=1"
      title="Cloth"
      scrolling="no"
      tabIndex={-1}
      allow="autoplay"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block", background: "#101010" }}
    />
  );
}