import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Socials from "./Socials";
import ClockwiseCta from "./ClockwiseCta";
import PlaygroundTerminal from "./PlaygroundTerminal";
import PLAYGROUND_ITEMS from "../data/playgroundItems";
import { PreviewModal } from "./ProductCard";

function SoundIcons() {
    return (
        <>
            <svg className="icon-sound-on" viewBox="0 0 16 16">
                <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="currentColor" />
                <path d="M10 5.5a4 4 0 0 1 0 5M12.5 3a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            </svg>
            <svg className="icon-sound-off" viewBox="0 0 16 16" style={{ display: "none" }}>
                <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="currentColor" />
                <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            </svg>
        </>
    );
}

const SoundOnIcon = () => (
    <svg viewBox="0 0 16 16">
        <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="currentColor" />
        <path d="M10 5.5a4 4 0 0 1 0 5M12.5 3a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
);
const SoundOffIcon = () => (
    <svg viewBox="0 0 16 16">
        <path d="M7 2L3.5 6H1v4h2.5L7 14V2z" fill="currentColor" />
        <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
);

const EllipsisIcon = () => (
    <svg viewBox="0 0 16 16">
        <circle cx="3.5" cy="8" r="1.3" fill="currentColor" />
        <circle cx="8" cy="8" r="1.3" fill="currentColor" />
        <circle cx="12.5" cy="8" r="1.3" fill="currentColor" />
    </svg>
);

// Card for kind:"component" — desktop = hover to play, mobile = tap to play.
function ComponentCard({ item, onOpen }) {
    const [enabled, setEnabled] = useState(false);
    const [active, setActive] = useState(false);

    // Touch / no-hover devices use tap instead of hover
    const isTouch =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: none)").matches;

    const muted = !(item.sound && enabled && active);
    const Comp = item.Component;

    // Desktop: hover sets active. Mobile: tapping the card toggles active
    // (the tap also serves as the user gesture that unlocks audio on iOS).
    const activate = isTouch
        ? { onClick: () => setActive((a) => !a) }
        : {
            onMouseEnter: () => setActive(true),
            onMouseLeave: () => setActive(false),
        };

    return (
        <div className="pg-card" {...activate}>
            <div className="pg-card-inner">
                <div
                    className={`pg-embed${item.themed ? " pg-themed-embed" : ""}`}
                    style={item.embedBg ? { background: item.embedBg } : undefined}
                >
                    <Comp muted={muted} />
                </div>

                <div className="pg-card-controls">
                    {item.sound && (
                        <button
                            className="pg-ctrl-btn"
                            aria-label="Toggle sound"
                            onClick={(e) => { e.stopPropagation(); setEnabled((v) => !v); }}
                        >
                            {enabled ? <SoundOnIcon /> : <SoundOffIcon />}
                        </button>
                    )}
                    <button
                        className="pg-ctrl-btn"
                        aria-label={item.open?.label || "Open preview"}
                        onClick={(e) => { e.stopPropagation(); onOpen(); }}
                    >
                        <EllipsisIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Playground() {
    const rootRef = useRef(null);
    const [modalIndex, setModalIndex] = useState(null);

    // ── Per-card sound + hover for IFRAME/VIDEO cards (data-dom="1") ──
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const cards = Array.from(root.querySelectorAll('.pg-card[data-dom="1"]'));

        const iframeMsg = (iframe, muted) => {
            try { if (iframe) iframe.contentWindow.postMessage({ type: "setMuted", muted }, "*"); } catch (e) { }
        };

        const cleanups = cards.map((card) => {
            const soundBtn = card.querySelector(".pg-sound-btn");
            const iframe = card.querySelector("iframe");
            const video = card.querySelector("video");
            let muted = true, hovered = false;

            const updateIcon = () => {
                if (!soundBtn) return;
                soundBtn.querySelector(".icon-sound-on").style.display = muted ? "none" : "";
                soundBtn.querySelector(".icon-sound-off").style.display = muted ? "" : "none";
            };
            updateIcon();

            const onEnter = () => {
                hovered = true;
                cards.forEach((other) => {
                    if (other === card) return;
                    iframeMsg(other.querySelector("iframe"), true);
                    const v = other.querySelector("video");
                    if (v) { v.muted = true; v.pause(); }
                });
                iframeMsg(iframe, muted);
                if (video) { video.muted = true; video.play().catch(() => { }); }
            };
            const onLeave = () => {
                hovered = false;
                iframeMsg(iframe, true);
                if (video) { video.muted = true; video.pause(); video.currentTime = 0; }
            };
            const onSound = (e) => {
                e.stopPropagation();
                muted = !muted;
                updateIcon();
                if (hovered) iframeMsg(iframe, muted);
            };

            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("mouseleave", onLeave);
            if (soundBtn) soundBtn.addEventListener("click", onSound);

            return () => {
                card.removeEventListener("mouseenter", onEnter);
                card.removeEventListener("mouseleave", onLeave);
                if (soundBtn) soundBtn.removeEventListener("click", onSound);
            };
        });

        return () => cleanups.forEach((fn) => fn());
    }, []);

    return (
        <>
            <Header />
            <Socials />
            <ClockwiseCta />

            <PlaygroundTerminal />

            <main className="pg-main" ref={rootRef}>
                <div className="container">
                    <div className="row gx-4 gy-4">
                        {PLAYGROUND_ITEMS.map((item, i) => (
                            <div className="col-sm-6 col-xl-4" key={i}>
                                {item.kind === "component" ? (
                                    <ComponentCard item={item} onOpen={() => setModalIndex(i)} />
                                ) : (
                                    <div className="pg-card" data-dom="1">
                                        <div className="pg-card-inner">
                                            <div
                                                className={`pg-embed${item.themed ? " pg-themed-embed" : ""}`}
                                                style={item.embedBg ? { background: item.embedBg } : undefined}
                                            >
                                                {item.kind === "iframe" && (
                                                    <iframe
                                                        id={item.id}
                                                        src={item.src}
                                                        title={item.open?.label || "embed"}
                                                        scrolling="no"
                                                        tabIndex={-1}
                                                        allow={item.noAutoplay ? undefined : "autoplay"}
                                                        style={item.mediaStyle}
                                                    />
                                                )}
                                                {item.kind === "video" && (
                                                    <video src={item.src} muted loop playsInline style={item.mediaStyle} />
                                                )}
                                                {item.kind === "image" && (
                                                    <img src={item.src} alt={item.alt || ""} style={item.mediaStyle} />
                                                )}
                                            </div>

                                            <div className="pg-card-controls">
                                                    {item.sound && (
                                                        <button className="pg-ctrl-btn pg-sound-btn" aria-label="Toggle sound">
                                                            <SoundIcons />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="pg-ctrl-btn"
                                                        aria-label={item.open?.label || "Open preview"}
                                                        onClick={() => setModalIndex(i)}
                                                    >
                                                        <EllipsisIcon />
                                                    </button>
                                                </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {modalIndex !== null && (
                <PreviewModal
                    items={PLAYGROUND_ITEMS}
                    initialIndex={modalIndex}
                    onClose={() => setModalIndex(null)}
                />
            )}
        </>
    );
}

export default Playground;