import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

function getLogoSize(scrollY, width) {
    let sizes;
    if (width <= 768) {
        sizes = [48, 20, 16];
    } else if (width <= 1440) {
        sizes = [60, 40, 24];
    } else {
        sizes = [64, 32, 24];
    }
    if (scrollY < 100) return sizes[0];
    if (scrollY < 300) return sizes[1];
    return sizes[2];
}

function Header() {
    const [logoSize, setLogoSize] = useState(64);
    const canvasRef = useRef(null);
    const orbRef = useRef(null);
    const headerRef = useRef(null);

    // logo sizing on scroll / resize
    useEffect(() => {
        const update = () => {
            setLogoSize(getLogoSize(window.scrollY, window.innerWidth));
            if (headerRef.current) {
                headerRef.current.classList.toggle('scroll', window.scrollY > 0);
            }
        };
        update();
        window.addEventListener('scroll', update);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    // halftone orb
    useEffect(() => {
        const canvas = canvasRef.current;
        const orbEl = orbRef.current;
        if (!canvas || !orbEl) return;

        const S = 60;
        canvas.width = S; canvas.height = S;
        const ctx = canvas.getContext('2d');

        const B8 = [
             0,32, 8,40, 2,34,10,42,
            48,16,56,24,50,18,58,26,
            12,44, 4,36,14,46, 6,38,
            60,28,52,20,62,30,54,22,
             3,35,11,43, 1,33, 9,41,
            51,19,59,27,49,17,57,25,
            15,47, 7,39,13,45, 5,37,
            63,31,55,23,61,29,53,21
        ].map(v => v / 64);

        const BASE_R = 0.86;
        const OR = 0.72, YF = 0.46;

        // theme-aware dot color
        let dot = [10, 10, 10];
        const readTheme = () => {
            const dark = document.documentElement.getAttribute('data-theme') === 'dark';
            dot = dark ? [250, 250, 250] : [10, 10, 10];
        };
        readTheme();
        const obs = new MutationObserver(readTheme);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        const BANDS = [
            { lat:  0.7, freq: 0.31, phase: 0.0, peak: 0.92, width: 0.22 },
            { lat:  0.1, freq: 0.53, phase: 1.4, peak: 0.80, width: 0.18 },
            { lat: -0.4, freq: 0.44, phase: 2.8, peak: 0.86, width: 0.20 },
            { lat: -0.8, freq: 0.67, phase: 4.2, peak: 0.70, width: 0.15 },
            { lat:  0.4, freq: 0.22, phase: 5.5, peak: 0.62, width: 0.14 },
        ];

        let hovered = false, t = 0, speed = 0.6, flash = 0, prevMs = 0, raf;

        const onEnter = () => { hovered = true; flash = 1; };
        const onLeave = () => { hovered = false; };
        orbEl.addEventListener('mouseenter', onEnter);
        orbEl.addEventListener('mouseleave', onLeave);

        function frame(ms) {
            const dt = Math.min((ms - prevMs) / 1000, 0.05);
            prevMs = ms;

            speed += ((hovered ? 4.0 : 0.6) - speed) * dt * 3;
            flash  = Math.max(0, flash - dt * 2.2);
            t     += dt * speed;

            const img = ctx.createImageData(S, S);
            const p   = img.data;

            for (let py = 0; py < S; py++) {
                for (let px = 0; px < S; px++) {
                    const u  = (px + 0.5) / S * 2 - 1;
                    const v  = -((py + 0.5) / S * 2 - 1);
                    const r2 = u*u + v*v;
                    if (r2 > BASE_R*BASE_R) continue;

                    const sz = Math.sqrt(BASE_R*BASE_R - r2);
                    const nx = u/BASE_R, ny = v/BASE_R, nz = sz/BASE_R;

                    let lit = 0.03;
                    for (const b of BANDS) {
                        const dist = Math.abs(ny - b.lat) / b.width;
                        if (dist < 1) {
                            const envelope = 1 - dist * dist;
                            const wave = 0.5 + 0.5 * Math.sin(nx * 6.0 + t * b.freq * 3.0 + b.phase);
                            lit += envelope * wave * b.peak * (0.5 + 0.5 * Math.sin(t * b.freq + b.phase));
                        }
                    }
                    lit *= 0.25 + 0.75 * Math.pow(nz, 0.4);
                    lit += flash * 0.20;

                    if (Math.min(1, Math.max(0, lit)) > B8[(py % 8) * 8 + (px % 8)]) {
                        const i = (py * S + px) * 4;
                        p[i] = dot[0]; p[i+1] = dot[1]; p[i+2] = dot[2]; p[i+3] = 255;
                    }
                }
            }

            ctx.putImageData(img, 0, 0);
            raf = requestAnimationFrame(frame);
        }

        raf = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(raf);
            orbEl.removeEventListener('mouseenter', onEnter);
            orbEl.removeEventListener('mouseleave', onLeave);
            obs.disconnect();
        };
    }, []);

    return (
        <header ref={headerRef}>
            <div className="container-fluid">
                <Link to="/" className="logo" ref={orbRef} aria-label="Home"
                    style={{
                        width: `${logoSize}px`,
                        height: `${logoSize}px`,
                        transition: 'width 0.4s ease, height 0.4s ease',
                    }}
                >
                    <canvas ref={canvasRef} className="logo-orb"></canvas>
                </Link>
                <div className="header-links">
    <NavLink to="/about">About</NavLink>
    <NavLink to="/archives">Archives</NavLink>
    <NavLink to="/playground">Playground</NavLink>
</div>
            </div>
        </header>
    );
}

export default Header;