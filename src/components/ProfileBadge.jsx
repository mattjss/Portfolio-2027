import { useEffect, useRef } from "react";

// Satellite dots: side ('l'|'r'), dx/dy = fly-out offset (px), d = stagger delay (ms), img = thumbnail
const SATELLITES = [
  { side: "l", dx: -168, dy: -88,  d: 0,  img: "/images/sat-fishing.jpeg" },
  { side: "l", dx: -355, dy: -8,   d: 55, img: "/images/sat-tent.jpeg" },
  { side: "l", dx: -215, dy: 128,  d: 25, img: "/images/sat-golf-quivira.jpeg" },
  { side: "l", dx: -310, dy: -132, d: 70, img: "/images/sat-golf-incline.jpeg" },
  { side: "r", dx: 195,  dy: -52,  d: 10, img: "/images/sat-selfie.jpeg" },
  { side: "r", dx: 370,  dy: 30,   d: 40, img: "/images/sat-golf-cabos.jpeg" },
];

function ProfileBadge() {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const badge = badgeRef.current;
    if (!container || !badge) return;

    let rx = 0, ry = 0, scale = 1;
    const apply = () => {
      badge.style.transform =
        `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    };

    const tilt = (clientX, clientY) => {
      const r = badge.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      ry = ((clientX - cx) / (r.width / 2)) * 12;
      rx = ((cy - clientY) / (r.height / 2)) * 12;
      apply();
    };
    const reset = () => { rx = 0; ry = 0; scale = 1; apply(); };

    const onMove  = (e) => tilt(e.clientX, e.clientY);
    const onLeave = () => reset();
    const onDown  = () => { scale = 0.95; apply(); };
    const onUp    = () => { scale = 1; apply(); };

    const onClick = (e) => {
      if (window.innerWidth <= 768) return;          // no expand on mobile
      if (e.target.closest(".sat")) return;          // ignore clicks on satellites
      container.classList.toggle("expanded");
    };

    const onTouchMove = (e) => tilt(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchEnd  = () => reset();

    badge.addEventListener("mousemove", onMove);
    badge.addEventListener("mouseleave", onLeave);
    badge.addEventListener("mousedown", onDown);
    badge.addEventListener("mouseup", onUp);
    container.addEventListener("click", onClick);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    return () => {
      badge.removeEventListener("mousemove", onMove);
      badge.removeEventListener("mouseleave", onLeave);
      badge.removeEventListener("mousedown", onDown);
      badge.removeEventListener("mouseup", onUp);
      container.removeEventListener("click", onClick);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="badge-container" ref={containerRef}>
      <div className="badge" ref={badgeRef}>
        <div className="badge-avatar">
  <video
    src="/vids/about-vid.mp4"
    autoPlay
    muted
    loop
    playsInline
  />
</div>
        <div className="badge-info">
          <span className="badge-name">Matt Silverman</span>
          <span className="badge-sub">San Diego, California</span>
        </div>
        <span className="badge-dot"></span>
      </div>

      {SATELLITES.map((s, i) => (
        <div
          key={i}
          className={`sat sat-${s.side}`}
          style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, "--d": `${s.d}ms` }}
        >
          <span className="sat-dot"></span>
          <div className="sat-photo">
            <img src={s.img} alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfileBadge;