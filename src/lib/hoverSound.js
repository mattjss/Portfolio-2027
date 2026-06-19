// src/lib/hoverSound.js
let ctx = null;
let unlocked = false;
const buffers = {};
const loaders = {};

const SOURCES = {
  hover: "/audio/hover-vector.wav", // hover
  click: "/audio/hover.mp3",        // click
};

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function load(name) {
  if (!loaders[name]) {
    loaders[name] = fetch(SOURCES[name])
      .then((r) => {
        if (!r.ok) throw new Error(`${SOURCES[name]} → HTTP ${r.status}`);
        return r.arrayBuffer();
      })
      .then((data) => getCtx().decodeAudioData(data))
      .then((decoded) => {
        buffers[name] = decoded;
        console.log(`[sound] loaded "${name}" ✓`);
      })
      .catch((err) => {
        console.error(`[sound] FAILED to load "${name}":`, err.message);
        loaders[name] = null; // allow retry
      });
  }
  return loaders[name];
}

export function unlockSounds() {
  const c = getCtx();
  if (c.state === "suspended") c.resume();
  unlocked = true;
  load("hover");
  load("click");
}

function play(name, volume) {
  if (!unlocked) return;
  if (!buffers[name]) { load(name); return; } // not ready yet → kick a load
  const c = getCtx();
  const src = c.createBufferSource();
  src.buffer = buffers[name];
  const gain = c.createGain();
  gain.gain.value = volume;
  src.connect(gain).connect(c.destination);
  src.start(0);
}

export const playHover = (v = 0.13) => play("hover", v);
export const playClick = (v = 0.18) => play("click", v);