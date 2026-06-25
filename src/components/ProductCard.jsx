import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import MeshCanvas from "./MeshCanvas";
import AgenticLoaderGallery from "./AgenticLoaderGallery";


// Plays the card's video when it scrolls into view — touch/no-hover devices only.
function useInViewVideo(videoRef, cardRef) {
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !("IntersectionObserver" in window)) return;

    // Scroll-to-play on touch devices OR narrow screens (covers real phones + resized browser)
    const useScrollPlay =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= 768;
    if (!useScrollPlay) return;

    const io = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          v.play().catch(() => {});
        } else {
          v.pause();
          v.currentTime = 0;
        }
      },
      { threshold: [0, 0.5, 1] }   // fire as it enters/leaves the 50% mark
    );
    io.observe(card);
    return () => io.disconnect();
  }, [videoRef, cardRef]);
}



// ── Case Study Info Panel ──────────────────────────────────────
function CaseStudyInfo({ item }) {
  const [activeInnerTab, setActiveInnerTab] = useState("intro");
  const scrollRef = useRef(null);


  useEffect(() => {
    setActiveInnerTab("intro");
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [item]);

  const tabContent = item.caseTabs?.[activeInnerTab] || [];

  return (
    <div className="archive-info archive-info--case-study">
      <div className="archive-info-head">
        <div className="archive-info-head-flex">
          {item.brandIcon && (
            <img src={item.brandIcon} alt={item.brand} width={16} height={16} />
          )}
          <h3>{item.brand}</h3>
        </div>
        {item.previewUrl && (
          <a href={item.previewUrl} target="_blank" rel="noreferrer" className="archive-tag">
            Preview
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M9.5 9.5H2.5V2.5H6V1.5H2.5C1.945 1.5 1.5 1.95 1.5 2.5V9.5C1.5 10.05 1.945 10.5 2.5 10.5H9.5C10.05 10.5 10.5 10.05 10.5 9.5V6H9.5V9.5ZM7 1.5V2.5H8.795L3.88 7.415L4.585 8.12L9.5 3.205V5H10.5V1.5H7Z" fill="#6A6A6A"/>
</svg>
          </a>
        )}
      </div>

      <div className="cs-tabs">
        {["intro", "team", "overview"].map((tab) => (
          <button
            key={tab}
            className={`cs-tab ${activeInnerTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveInnerTab(tab);
              if (scrollRef.current) scrollRef.current.scrollTop = 0;
            }}
          >
            {tab === "intro" ? "Intro" : tab === "team" ? "Team" : "Overview"}
          </button>
        ))}
      </div>

      <div className="cs-content" ref={scrollRef}>
        {tabContent.map((block, i) => {
          if (block.type === "text") {
            return (
              <div key={i} className="cs-block">
                {block.label && <h2 className="cs-label">{block.label}</h2>}
                <p className="cs-text">{block.content}</p>
              </div>
            );
          }
          if (block.type === "image") {
            return (
              <div key={i} className="cs-block">
                <div className="cs-block--media">
                  <img src={block.src} srcSet={block.srcSet} alt={block.alt || ""} />
                </div>
                {block.caption && <span className="cs-media-caption">{block.caption}</span>}
              </div>
            );
          }
          if (block.type === "video") {
            return (
              <div key={i} className="cs-block">
                <div className="cs-block--media">
                  <video autoPlay muted loop playsInline key={block.src}>
                    <source src={block.src} type="video/mp4" />
                  </video>
                </div>
                {block.caption && <span className="cs-media-caption">{block.caption}</span>}
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="archive-footer">
        <span className="archive-footer-tag">{item.category}</span>
      </div>
    </div>
  );
}

// ── Regular Info Panel ─────────────────────────────────────────
function RegularInfo({ item }) {
  return (
    <div className="archive-info">
      <div>
        <div className="archive-info-head">
          <div className="archive-info-head-flex">
            {item.brandIcon && (
              <img src={item.brandIcon} alt={item.brand} width={16} height={16} />
            )}
            <h3>{item.brand}</h3>
          </div>
          {item.previewUrl && (
            <a href={item.previewUrl} target="_blank" rel="noreferrer" className="archive-tag">
              Preview
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9.5 9.5H2.5V2.5H6V1.5H2.5C1.945 1.5 1.5 1.95 1.5 2.5V9.5C1.5 10.05 1.945 10.5 2.5 10.5H9.5C10.05 10.5 10.5 10.05 10.5 9.5V6H9.5V9.5ZM7 1.5V2.5H8.795L3.88 7.415L4.585 8.12L9.5 3.205V5H10.5V1.5H7Z" fill="#AAAAAA" />
              </svg>
            </a>
          )}
        </div>

        <div className="archive-info-content">
          <div>
            <h2>Project</h2>
            <p>{item.project}</p>
          </div>
          {item.summary && (
            <div>
              <h2>Summary</h2>
              <p>{item.summary}</p>
            </div>
          )}
          {item.tools && item.tools.length > 0 && (
            <div>
              <h2>Tools</h2>
              <div className="tools">
                {item.tools.map((tool) => (
                  <span key={tool.name}>
                    {tool.icon && (
                      <img src={tool.icon} alt={tool.name} width={24} height={24} />
                    )}
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="archive-footer">
        {item.inspiration && (
          <a href={item.inspirationUrl || "#"} target="_blank" rel="noreferrer">
            {item.inspiration}
            <span className="archive-footer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9.5 9.5H2.5V2.5H6V1.5H2.5C1.945 1.5 1.5 1.95 1.5 2.5V9.5C1.5 10.05 1.945 10.5 2.5 10.5H9.5C10.05 10.5 10.5 10.05 10.5 9.5V6H9.5V9.5ZM7 1.5V2.5H8.795L3.88 7.415L4.585 8.12L9.5 3.205V5H10.5V1.5H7Z" fill="#808080" />
              </svg>
            </span>
          </a>
        )}
        <span className="archive-footer-tag">{item.category}</span>
      </div>
    </div>
  );
}

// ── Case Study Full-Screen Modal ───────────────────────────────
// Used ONLY for the four home-page case-study cards (item.isCaseStudy).
// Four corner UI + a centered, scrollable stage driven by a tab bar.
function CaseStudyModal({ item, onClose }) {
  const [activeTab, setActiveTab] = useState("design");
  const stageRef = useRef(null);
  const tabbarRef = useRef(null);
  const tabRefs = useRef({});
  const [pill, setPill] = useState({ x: 0, w: 0 });

  const TABS = [
    { key: "design", label: "Preview" },
    { key: "intro", label: "Intro" },
    { key: "team", label: "Team" },
    { key: "overview", label: "Overview" },
  ];

  // measure the active tab so the sliding pill can match its position + width
  const measurePill = useCallback(() => {
    const el = tabRefs.current[activeTab];
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [activeTab]);

  // re-measure on tab change / project change (before paint, so it slides from the old spot)
  useLayoutEffect(() => { measurePill(); }, [measurePill, item]);

  // re-measure on resize and once webfonts finish loading (label widths shift)
  useEffect(() => {
    measurePill();
    window.addEventListener("resize", measurePill);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measurePill);
    }
    return () => window.removeEventListener("resize", measurePill);
  }, [measurePill]);

  // reset to first tab + top when the project changes
  useEffect(() => {
    setActiveTab("design");
    if (stageRef.current) stageRef.current.scrollTop = 0;
  }, [item]);

  // scroll the stage back to top whenever the tab changes
  useEffect(() => {
    if (stageRef.current) stageRef.current.scrollTop = 0;
  }, [activeTab]);

  const blocks = activeTab === "design" ? [] : (item.caseTabs?.[activeTab] || []);

  const renderBlock = (block, i) => {
    if (block.type === "text") {
      const isCont = !block.label;
      return (
        <div key={i} className={`cs-block${isCont ? " cs-block--cont" : ""}`}>
          {block.label && <h2 className="cs-label">{block.label}</h2>}
          <p className="cs-text">{block.content}</p>
        </div>
      );
    }
    if (block.type === "stats") {
      return (
        <div key={i} className="cs-block cs-block--stats">
          {block.items.map((s, j) => (
            <div key={j} className="cs-stat">
              <span className="cs-stat-value">{s.value}</span>
              <span className="cs-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      );
    }
    if (block.type === "image") {
      return (
        <div key={i} className="cs-block">
          <div className="cs-block--media">
            <img src={block.src} srcSet={block.srcSet} alt={block.alt || ""} />
          </div>
          {block.caption && <span className="cs-media-caption">{block.caption}</span>}
        </div>
      );
    }
    if (block.type === "video") {
      return (
        <div key={i} className="cs-block">
          <div className="cs-block--media">
            <video autoPlay muted loop playsInline key={block.src}>
              <source src={block.src} type="video/mp4" />
            </video>
          </div>
          {block.caption && <span className="cs-media-caption">{block.caption}</span>}
        </div>
      );
    }
    return null;
  };

  // Group consecutive media blocks for the overview tab so they render side-by-side
  const renderOverviewBlocks = (rawBlocks) => {
    const grouped = [];
    let i = 0;
    while (i < rawBlocks.length) {
      const b = rawBlocks[i];
      if (b.type === "image" || b.type === "video") {
        const run = [b];
        while (i + 1 < rawBlocks.length && (rawBlocks[i + 1].type === "image" || rawBlocks[i + 1].type === "video")) {
          i++;
          run.push(rawBlocks[i]);
        }
        grouped.push({ _media: true, items: run });
      } else {
        grouped.push(b);
      }
      i++;
    }

    return grouped.map((entry, idx) => {
      if (!entry._media) return renderBlock(entry, idx);
      const { items } = entry;
      const gridCls = items.length >= 4 ? "cs-block--media-quad" : items.length >= 2 ? "cs-block--media-pair" : null;
      const inner = items.map((b, j) => (
        <div key={j} className="cs-block">
          <div className="cs-block--media">
            {b.type === "video" ? (
              <video autoPlay muted loop playsInline key={b.src}>
                <source src={b.src} type="video/mp4" />
              </video>
            ) : (
              <img src={b.src} srcSet={b.srcSet} alt={b.alt || ""} />
            )}
          </div>
          {b.caption && <span className="cs-media-caption">{b.caption}</span>}
        </div>
      ));
      return gridCls
        ? <div key={idx} className={gridCls}>{inner}</div>
        : inner;
    });
  };

  return (
    <div className="cs-fs">
      {/* TOP BAR — breadcrumb (left) + close (right) */}
      <div className="cs-fs-topbar">
        <span className="cs-fs-crumb">{item.category}</span>
        <button className="custom-close cs-fs-close" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.95746 9.75L5.99999 6.70705L9.04299 9.75L9.74999 9.04295L6.70704 6L9.75049 2.95696L9.04354 2.25L5.99999 5.29295L2.95704 2.25L2.25 2.95703L5.29299 6L2.25049 9.04305L2.95746 9.75Z" fill="#AAAAAA" />
          </svg>
        </button>
      </div>

      {/* CENTER — scrollable stage */}
      <div className="cs-fs-stage" ref={stageRef}>
        {activeTab === "design" ? (
          <div className={`archive-preview work-card-vid cs-fs-preview ${item.className || ""}`}>
            {item.video ? (
              <video key={item.video} autoPlay muted loop playsInline>
                <source src={item.video} type="video/mp4" />
              </video>
            ) : item.image ? (
              <img src={item.image} srcSet={item.imageSrcSet} alt={item.project} />
            ) : null}
          </div>
        ) : (
          <div className={`cs-fs-content cs-fs-content--${activeTab} ${item.className || ""}`}>
            {activeTab === "overview" ? renderOverviewBlocks(blocks) : blocks.map(renderBlock)}
          </div>
        )}
      </div>

      {/* BOTTOM-LEFT — brand */}
      <div className="cs-fs-brand archive-info-head-flex">
        {item.brandIcon && (
          <img src={item.brandIcon} alt={item.brand} width={16} height={16} />
        )}
        <h3>{item.brand}</h3>
      </div>

      {/* BOTTOM-RIGHT — tab bar */}
      <div
        className="cs-fs-tabbar"
        ref={tabbarRef}
        style={{ "--pill-x": `${pill.x}px`, "--pill-w": `${pill.w}px` }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            ref={(el) => { tabRefs.current[t.key] = el; }}
            className={`cs-fs-tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Playground / Archives Full-Screen Modal ────────────────────
// Used for every non-case-study item (Playground + Archives embeds).
// Corner UI + a centered scrollable stage (preview, then info) on desktop,
// and a 2-slide swipe carousel (preview | info) on mobile.
function RegularModal({ item, onClose, soundEnabled, setSoundEnabled }) {
  const [slide, setSlide] = useState(0);
  const stageRef = useRef(null);
  const trackRef = useRef(null);

  const PreviewComp = item.Component;
  const muted = !(item.sound && soundEnabled);

  // reset slide + scroll position whenever the project changes
  useEffect(() => {
    setSlide(0);
    if (stageRef.current) stageRef.current.scrollTop = 0;   // desktop vertical
    if (trackRef.current) trackRef.current.scrollLeft = 0;  // mobile carousel
  }, [item]);

  // track active slide on the mobile carousel (no-op on desktop vertical scroll)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (!w) return;
      setSlide(Math.round(el.scrollLeft / w));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goSlide = (i) => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  // Pagination dots — sit in-flow under each slide's content (mobile only).
  const dots = (
    <div className="pgm-dots">
      {[0, 1].map((i) => (
        <button
          key={i}
          className={`pgm-dot ${slide === i ? "active" : ""}`}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => goSlide(i)}
        />
      ))}
    </div>
  );

  const linkIcon = (fill) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M9.5 9.5H2.5V2.5H6V1.5H2.5C1.945 1.5 1.5 1.95 1.5 2.5V9.5C1.5 10.05 1.945 10.5 2.5 10.5H9.5C10.05 10.5 10.5 10.05 10.5 9.5V6H9.5V9.5ZM7 1.5V2.5H8.795L3.88 7.415L4.585 8.12L9.5 3.205V5H10.5V1.5H7Z" fill={fill} />
    </svg>
  );

  return (
    <div className="pgm">
      {/* TOP BAR — category (left) + close (right) */}
      <div className="pgm-topbar">
        <span className="archive-footer-tag">{item.category}</span>
        <button className="custom-close pgm-close" onClick={onClose} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.95746 9.75L5.99999 6.70705L9.04299 9.75L9.74999 9.04295L6.70704 6L9.75049 2.95696L9.04354 2.25L5.99999 5.29295L2.95704 2.25L2.25 2.95703L5.29299 6L2.25049 9.04305L2.95746 9.75Z" fill="#AAAAAA" />
          </svg>
        </button>
      </div>

      {/* CENTER — stage: track (carousel) + dots */}
      <div className="pgm-stage" ref={stageRef}>
        <div className="pgm-track" ref={trackRef}>
          {/* SLIDE 1 — preview */}
          <div className="pgm-slide pgm-slide--preview">
          <div className={`archive-preview pgm-preview ${item.className || ""}`}>
            {PreviewComp ? (
              <PreviewComp muted={muted} />
            ) : item.video ? (
              <video key={item.video} autoPlay muted loop playsInline>
                <source src={item.video} type="video/mp4" />
              </video>
            ) : item.image ? (
              <img key={item.image} src={item.image} srcSet={item.imageSrcSet} alt={item.project} />
            ) : null}

            {PreviewComp && item.sound && (
              <button
                className="pg-ctrl-btn archive-preview-sound"
                aria-label="Toggle sound"
                onClick={(e) => { e.stopPropagation(); setSoundEnabled((v) => !v); }}
              >
                {soundEnabled ? (
                  <svg viewBox="0 0 16 16">
                    <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="#AAAAAA" />
                    <path d="M10 5.5a4 4 0 0 1 0 5M12.5 3a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16">
                    <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="#AAAAAA" />
                    <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* SLIDE 2 — info */}
        <div className="pgm-slide pgm-slide--info">
          <div className="archive-info-content">
            <div>
              <h2>Project</h2>
              <p>{item.project}</p>
            </div>
            {item.summary && (
              <div>
                <h2>Description</h2>
                <p>{item.summary}</p>
              </div>
            )}
            {item.tools && item.tools.length > 0 && (
              <div>
                <h2>Tools</h2>
                <div className="tools">
                  {item.tools.map((tool) => (
                    <span key={tool.name}>
                      {tool.icon && (
                        <img src={tool.icon} alt={tool.name} width={24} height={24} />
                      )}
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>{/* /pgm-track */}
        {dots}
      </div>{/* /pgm-stage */}

      {/* BOTTOM BAR — brand (left) + links (right) */}
      <div className="pgm-bottombar">
        <div className="pgm-brand archive-info-head-flex">
          {item.brandIcon && (
            <img src={item.brandIcon} alt={item.brand} width={16} height={16} />
          )}
          <h3>{item.brand}</h3>
        </div>

        <div className="pgm-links">
          {item.inspiration && (
            <a className="pgm-inspiration" href={item.inspirationUrl || "#"} target="_blank" rel="noreferrer">
              {item.inspiration}
              {linkIcon("#808080")}
            </a>
          )}
          {item.previewUrl && (
            <a className="archive-tag pgm-tag" href={item.previewUrl} target="_blank" rel="noreferrer">
              Preview
              {linkIcon("#AAAAAA")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Preview Modal ──────────────────────────────────────────────
export function PreviewModal({ items, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const item = items[current];

  const prev = useCallback(() =>
    setCurrent((i) => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() =>
    setCurrent((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // back to "sound on" whenever we move to a different project
  useEffect(() => { setSoundEnabled(true); }, [current]);

  return (
    <div className="archive-modal" onClick={onClose}>
      <div className={`modal-content ${item.isCaseStudy ? "modal-content--case" : "modal-content--pg"}`} onClick={(e) => e.stopPropagation()}>

        {item.isCaseStudy ? (
          <CaseStudyModal item={item} onClose={onClose} />
        ) : (
          <RegularModal
            item={item}
            onClose={onClose}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        )}
      </div>
    </div>
  );
}


// ── Product Card ───────────────────────────────────────────────
function ProductCard({ item, items, index }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  useInViewVideo(videoRef, cardRef);

  const isTouch = typeof window !== "undefined" &&
    (window.matchMedia("(hover: none)").matches ||
     window.matchMedia("(pointer: coarse)").matches);

  const handleEnter = () => {
    const v = videoRef.current;
    if (v) v.play().catch(() => { });
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
  };

const media = item?.video ? (
    <video
      ref={videoRef}
      className="hover-effect"
      key={item.video}
      muted
      loop
      playsInline
      autoPlay={isTouch}                        // ← native inline autoplay on phones
      preload={isTouch ? "auto" : "metadata"}   // ← actually load the data on mobile
    >
      <source src={item.video} type="video/mp4" />
    </video>
  ) : item?.image ? (
    <img className="hover-effect" src={item.image} srcSet={item.imageSrcSet} alt={item.project} />
  ) : null;

  // ── Linked card: anchor, no modal ──
  if (item?.href) {
    return (

      <a href={item.href}
        ref={cardRef}                    // ← add
        target="_blank"
        rel="noreferrer"
        className={`product-card ${item?.className || ""}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ cursor: "pointer", display: "block" }}
      >
        {media}
      </a>
    );
  }

  if (item?.mesh) {
    return (
      <div className={`product-card ${item?.className || ""}`} style={{ overflow: "hidden" }}>
        <MeshCanvas />
      </div>
    );
  }

  if (item?.gallery) {
    return (
      <div className={`product-card ${item?.className || ""}`}>
        <AgenticLoaderGallery />
      </div>
    );
  }

  // Previewable = anything that isn't a link or the mesh card
  const previewItems = items.filter((it) => !it.href && !it.mesh && !it.gallery);

  // ── Default card: opens the preview modal ──
  return (
    <>
      <div
        className={`product-card ${item?.className || ""}`}
        
        onClick={() => setActiveIndex(previewItems.indexOf(item))}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{ cursor: "pointer" }}
      >
        {media}
      </div>

      {activeIndex !== null && (
        <PreviewModal
          items={previewItems}
          initialIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}

export default ProductCard;