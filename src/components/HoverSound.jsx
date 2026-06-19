// src/components/HoverSound.jsx
import { useEffect } from "react";
import { unlockSounds, playHover, playClick } from "../lib/hoverSound";

/* ════════════════════════════════════════════════════════════
   EDIT THESE TWO LISTS — that's all you need to touch.
   HOVER_SOUND  → plays hover-vector.mp3 when the mouse enters
   CLICK_SOUND  → plays hover.mp3 when clicked
   ════════════════════════════════════════════════════════════ */

const HOVER_SOUND = [
  ".header-links a",          // header nav links
  ".socials a",               // social icons
  ".products .row > div",     // home project cards
  ".archives-projects .row > div:not(:has(.pg-card))", // archives product cards
  ".archives-hero-card",      // archives hero icons
  ".pg-card",                 // ← playground + archives embed cards
  ".preview-panel button",    // preview arrows / close
];

const CLICK_SOUND = [
  ".header-links a",
  ".socials a",
  ".products .row > div",
  ".archives-projects .row > div:not(:has(.pg-card))",
  ".pg-card",
  ".archives-hero-card",
  ".cs-tab",          // ← real class (was .preview-panel .cs-tab)
  ".nav-btn",         // ← real class (prev / next arrows)
  ".custom-close",    // ← real class (close button)
  ".clockwise-cta",
  ".about-terminal-card .paddle",
  ".badge",
  ".cs-fs-tab"
];

/* ════════════════════════════════════════════════════════════
   No need to edit below this line.
   ════════════════════════════════════════════════════════════ */

const HOVER_SELECTOR = HOVER_SOUND.join(",");
const CLICK_SELECTOR = CLICK_SOUND.join(",");

export default function HoverSound() {
  useEffect(() => {
    const onFirst = () => {
      unlockSounds();
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
    window.addEventListener("pointerdown", onFirst);
    window.addEventListener("keydown", onFirst);

    let last = null, lastTime = 0;
    const onOver = (e) => {
      const el = e.target.closest(HOVER_SELECTOR);
      if (!el) { last = null; return; }
      if (el === last) return;
      const now = performance.now();
      if (now - lastTime < 50) return;
      lastTime = now;
      last = el;
      playHover();
    };

    const onClick = (e) => {
      const el = e.target.closest(CLICK_SELECTOR);
      if (!el) return;
      // Inside the preview modal, only the real controls (.cs-tab/.nav-btn/.custom-close)
      // should click — ignore the underlying home/archives card column.
      if (
        el.matches(".products .row > div, .archives-projects .row > div") &&
        e.target.closest(".archive-modal")
      ) return;
      playClick();
    };

    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("keydown", onFirst);
    };
  }, []);

  return null;
}