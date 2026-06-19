import { useEffect, useRef } from "react";

export default function LogoCarouselEmbed() {
  const ref = useRef(null);

  // mirror the site's light/dark theme into the embed (no audio in this one)
  useEffect(() => {
    const f = ref.current;
    if (!f) return;
    const getTheme = () => document.documentElement.getAttribute("data-theme") || "light";
    const post = () => { try { f.contentWindow.postMessage({ type: "theme", theme: getTheme() }, "*"); } catch {} };

    // The carousel registers its message listener a beat after the iframe "load"
    // (React mount + effect). Burst the theme a few times so the initial state
    // matches the site instead of the bundle's default "dark".
    let timers = [];
    const burst = () => {
      post();
      timers.forEach(clearTimeout);
      timers = [40, 120, 250, 500, 900].map((ms) => setTimeout(post, ms));
    };

    post();                          // in case it's already loaded
    f.addEventListener("load", burst);

    const obs = new MutationObserver(post);   // live toggles after load
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      f.removeEventListener("load", burst);
      obs.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src="/Logo-Carousel/index.html?embed=1"
      title="Logo Carousel"
      scrolling="no"
      tabIndex={-1}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
    />
  );
}