import { useEffect, useState } from "react";

export default function TactileEmbed() {
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

  return (
    <img
      src="/playground/tactile/tactile-1x"
      srcSet="/playground/tactile/tactile-1x.png 1x, /playground/tactile/tactile-2x.png 2x, /playground/tactile/tactile-3x.png 3x"
      alt="Tactile UI"
      draggable={false}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        background: isDark ? "#101010" : "#FCFCFC",
      }}
    />
  );
}
