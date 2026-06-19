import { useEffect, useRef } from "react";

export default function MeshCanvas({
  soundSrc = "/sounds/selection.mp3",
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ── Params ──
    const GRID_SPACING = 38,
      PAD = 22,
      NEIGHBOR_COUNT = 18,
      MAX_DIST = 220;
    const PULL_STR = 0.22,
      PULL_ELASTIC = 0.15,
      FADE_IN = 0.25,
      FADE_OUT = 0.08;
    const HUB_SIZE = 4,
      DOT_MIN = 1.5,
      DOT_MAX = 6;
    const RIPPLE_DURATION = 3600,
      RIPPLE_SPEED = 0.6,
      RIPPLE_AMPLITUDE = 14;
    const RIPPLE_FREQUENCY = 0.08,
      RIPPLE_DAMPING = 0.0008;

    let W = 500,
      H = 500;
    let particles = [];
    let shimmerStrengths = [];
    const activeRipples = [];

    const COLORS = [
      "#ffffff",
      "#ff6b35",
      "#ffd93b",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
    ];
    let colorIndex = 0,
      meshColor = COLORS[0];

    let cursorX = -1000,
      cursorY = -1000,
      cursorActive = false;
    let currentNeighbors = [];
    let lastRippleTimeMs = -Infinity;
    let rafId = 0;

    // ── Ripple ──
    function rippleOffset(node, now) {
      let dx = 0,
        dy = 0;
      for (const r of activeRipples) {
        const dist = Math.hypot(node.x - r.x, node.y - r.y);
        const elapsed = now - r.startTime;
        if (elapsed < 0 || elapsed > r.duration) continue;
        const radius = elapsed * r.speed;
        const band = dist - radius;
        const width = 100;
        const t = band / width;
        if (Math.abs(t) > 1.2) continue;
        const envelope = Math.max(0, Math.cos(t * Math.PI * 0.5));
        const temporal = Math.exp(-elapsed * RIPPLE_DAMPING);
        let offset = r.amplitude * envelope * temporal;
        const tail = -Math.sin((band / width) * Math.PI * 0.5) * 0.75;
        const tailTemporal = Math.exp(-elapsed * RIPPLE_DAMPING * 1.2);
        offset +=
          r.amplitude * tail * temporal * tailTemporal * RIPPLE_FREQUENCY;
        offset *= 1 + 0.5 * Math.sin(elapsed * 0.01);
        const len = Math.hypot(node.x - r.x, node.y - r.y) || 1;
        dx += ((node.x - r.x) / len) * offset;
        dy += ((node.y - r.y) / len) * offset;
      }
      return { dx, dy };
    }

    // ── Particle ──
    class Particle {
      constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.displayX = x;
        this.displayY = y;
        this.scale = 1;
        this.opacity = 0.3;
        this.targetScale = 1;
        this.targetOpacity = 0.3;
        this.isActive = false;
      }
      update() {
        this.displayX += (this.x - this.displayX) * 0.15;
        this.displayY += (this.y - this.displayY) * 0.15;
        const spd = this.isActive ? FADE_IN : FADE_OUT;
        this.scale += (this.targetScale - this.scale) * spd;
        this.opacity += (this.targetOpacity - this.opacity) * spd;
      }
      draw(ox, oy, alphaOverride) {
        const size = DOT_MIN + (DOT_MAX - DOT_MIN) * ((this.scale - 1) / 2);
        const x = this.displayX + ox,
          y = this.displayY + oy;
        ctx.globalAlpha = alphaOverride ?? this.opacity;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }

    function particlePhase(id) {
      const s = Math.sin(id * 12.9898) * 43758.5453;
      return s - Math.floor(s);
    }

    // ── Build grid sized to the card ──
    function buildGrid() {
      particles = [];
      shimmerStrengths = [];

      const cols = Math.max(1, Math.floor((W - PAD * 2) / GRID_SPACING) + 1);
      const rows = Math.max(1, Math.floor((H - PAD * 2) / GRID_SPACING) + 1);

      // even spacing that fills the full width/height (symmetric margins)
      const stepX = cols > 1 ? (W - PAD * 2) / (cols - 1) : 0;
      const stepY = rows > 1 ? (H - PAD * 2) / (rows - 1) : 0;

      let id = 0;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          particles.push(new Particle(PAD + c * stepX, PAD + r * stepY, id));
          shimmerStrengths.push(0);
          id++;
        }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }

    // ── Audio ──
    let clickAudio = null;
    function playClick() {
      if (!clickAudio) {
        clickAudio = new Audio(soundSrc);
        clickAudio.volume = 0.42;
      }
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
    }

    // ── Events ──
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      cursorX = (e.clientX - r.left) * (W / r.width);
      cursorY = (e.clientY - r.top) * (H / r.height);
      cursorActive = true;
    };
    const onLeave = () => {
      cursorActive = false;
    };
    const onContext = (e) => {
      e.preventDefault();
      colorIndex = (colorIndex + 1) % COLORS.length;
      meshColor = COLORS[colorIndex];
    };
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const cx = (e.clientX - r.left) * (W / r.width);
      const cy = (e.clientY - r.top) * (H / r.height);
      activeRipples.length = 0;
      const now = performance.now();
      activeRipples.push({
        x: cx,
        y: cy,
        startTime: now,
        duration: RIPPLE_DURATION,
        speed: RIPPLE_SPEED,
        amplitude: RIPPLE_AMPLITUDE,
      });
      lastRippleTimeMs = now;
      playClick();
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("contextmenu", onContext);
    canvas.addEventListener("click", onClick);

    // ── Update ──
    function update() {
      const distances = particles.map((p) => ({
        p,
        d: Math.hypot(p.x - cursorX, p.y - cursorY),
      }));
      currentNeighbors = cursorActive
        ? distances
            .filter((x) => x.d < MAX_DIST)
            .sort((a, b) => a.d - b.d)
            .slice(0, NEIGHBOR_COUNT)
            .map((x) => x.p)
        : [];
      const neighborIds = new Set(currentNeighbors.map((p) => p.id));
      const pullFactor = 1 + PULL_ELASTIC;
      particles.forEach((p) => {
        p.isActive = neighborIds.has(p.id);
        if (p.isActive) {
          const dx = cursorX - p.x,
            dy = cursorY - p.y;
          p.displayX += (p.x + dx * PULL_STR - p.displayX) * pullFactor;
          p.displayY += (p.y + dy * PULL_STR - p.displayY) * pullFactor;
          p.targetScale = 3;
          p.targetOpacity = 1;
        } else {
          p.targetScale = 1;
          p.targetOpacity = 0.3;
        }
        p.update();
      });
      const now = performance.now();
      for (let i = activeRipples.length - 1; i >= 0; i--)
        if (now - activeRipples[i].startTime > activeRipples[i].duration)
          activeRipples.splice(i, 1);
    }

    // ── Draw ──
    function draw(now) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#101010";
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.roundRect(0, 0, W, H);
      ctx.fill();

      ctx.save();
      ctx.translate(0.5, 0.5);
      ctx.fillStyle = meshColor;
      ctx.strokeStyle = meshColor;

      const hubOff = rippleOffset({ x: cursorX, y: cursorY }, now);
      const hx = cursorX + hubOff.dx,
        hy = cursorY + hubOff.dy;

      const shimmerDecayMs = 5000;
      const sinceRipple = now - lastRippleTimeMs;
      const shimmerTemporal =
        sinceRipple >= 0 && lastRippleTimeMs !== -Infinity
          ? Math.exp(-sinceRipple / shimmerDecayMs)
          : 0;

      ctx.lineWidth = 1;
      currentNeighbors.forEach((p) => {
        const pOff = rippleOffset(p, now);
        const px = p.displayX + pOff.dx,
          py = p.displayY + pOff.dy;
        const dist = Math.hypot(p.displayX - cursorX, p.displayY - cursorY);
        ctx.globalAlpha = Math.max(0.3, 1 - dist / MAX_DIST) * 0.75;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(px, py);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      particles.forEach((p, index) => {
        const off = rippleOffset(p, now);
        let alphaOverride;
        if (!p.isActive && shimmerTemporal > 0) {
          const rippleMag = Math.hypot(off.dx, off.dy);
          const local = Math.min(1, rippleMag / 9);
          let stored = shimmerStrengths[index] ?? 0;
          if (local > 0.02) stored = Math.min(1, stored + local * 0.9);
          stored *= 0.975 + 0.02 * shimmerTemporal;
          shimmerStrengths[index] = stored;
          if (stored > 0.01) {
            const phase = particlePhase(p.id) * Math.PI * 2;
            const twinkle = 0.5 + 0.5 * Math.sin(phase + now * 0.01);
            alphaOverride = Math.min(1, p.opacity + 0.9 * stored * twinkle);
          }
        }
        p.draw(off.dx, off.dy, alphaOverride);
      });

      if (currentNeighbors.length > 0) {
        ctx.globalAlpha = 1;
        const h = HUB_SIZE / 2;
        ctx.fillRect(hx - h, hy - h, HUB_SIZE, HUB_SIZE);
      }
      ctx.restore();
    }

    function loop(now) {
      update();
      draw(now);
      rafId = requestAnimationFrame(loop);
    }

    // init
    resize();
    rafId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("contextmenu", onContext);
      canvas.removeEventListener("click", onClick);
    };
  }, [soundSrc]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: "none",
      }}
    />
  );
}
