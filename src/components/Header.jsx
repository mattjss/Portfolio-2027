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

        // theme-aware dot color (black in light, near-white in dark)
        let dot = [10, 10, 10];
        const readTheme = () => {
            const dark = document.documentElement.getAttribute('data-theme') === 'dark';
            dot = dark ? [250, 250, 250] : [10, 10, 10];
        };
        readTheme();
        const obs = new MutationObserver(readTheme);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        let hovered = false, angle = 1.2, speed = 0.38, gain = 0.60,
            specPow = 10, flash = 0, breatheT = 0, prevMs = 0, raf;

        const onEnter = () => { hovered = true; flash = 1.0; };
        const onLeave = () => { hovered = false; };
        orbEl.addEventListener('mouseenter', onEnter);
        orbEl.addEventListener('mouseleave', onLeave);

        function frame(ms) {
            const dt = Math.min((ms - prevMs) / 1000, 0.05);
            prevMs = ms;

            speed   += ((hovered ? 2.8  : 0.38) - speed)   * Math.min(1, dt * 4);
            gain    += ((hovered ? 0.90 : 0.60) - gain)    * Math.min(1, dt * 5);
            specPow += ((hovered ? 22   : 10)   - specPow) * Math.min(1, dt * 4);
            flash    = Math.max(0, flash - dt * 2.5);
            breatheT += dt * 0.55;
            angle   += speed * dt;

            const R  = BASE_R * (1 + 0.022 * Math.sin(breatheT));
            const lx = Math.cos(angle) * OR;
            const ly = Math.sin(angle) * OR * YF;
            const lz = Math.sqrt(Math.max(0, 1 - lx*lx - ly*ly));

            const img = ctx.createImageData(S, S);
            const p   = img.data;

            for (let py = 0; py < S; py++) {
                for (let px = 0; px < S; px++) {
                    const u  = (px + 0.5) / S * 2 - 1;
                    const v  = -((py + 0.5) / S * 2 - 1);
                    const r2 = u*u + v*v;
                    if (r2 > R*R) continue;

                    const sz = Math.sqrt(R*R - r2);
                    const nx = u/R, ny = v/R, nz = sz/R;

                    const ndl  = Math.max(0, nx*lx + ny*ly + nz*lz);
                    const rz   = 2*ndl*nz - lz;
                    const spec = Math.pow(Math.max(0, rz), specPow);
                    const rim  = 0.10 * Math.pow(1 - nz, 2.2);
                    const lit  = (0.05 + ndl*0.58 + spec*0.75 + rim) * gain + flash * 0.30;

                    if (Math.min(1, lit) > B8[(py % 8) * 8 + (px % 8)]) {
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