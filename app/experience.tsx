"use client";

import { useCallback, useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";

const sections = ["home", "tools", "tests", "logs"] as const;
type Section = (typeof sections)[number];

const placeholderCopy = "滚滚长江东逝水";

const navItems: { id: Exclude<Section, "home">; label: string; icon: ReactNode }[] = [
  { id: "tools", label: "TOOLS", icon: <path d="M14.7 6.3a4.2 4.2 0 0 0-5.4 5.4L3.8 17.2a1.4 1.4 0 0 0 2 2l5.5-5.5a4.2 4.2 0 0 0 5.4-5.4l-2.5 2.5-2.9-.7-.7-2.9 2.5-2.5a4.2 4.2 0 0 1 1.6 1.6Z" /> },
  { id: "tests", label: "TESTS", icon: <><path d="M9 3h6M10 3v5l-5 9a2.7 2.7 0 0 0 2.4 4h9.2a2.7 2.7 0 0 0 2.4-4l-5-9V3" /><path d="M7.5 15h9" /></> },
  { id: "logs", label: "LOGS", icon: <><path d="M5 3h11l3 3v15H5Z" /><path d="M15 3v4h4M8 11h8M8 15h8M8 19h5" /></> },
];

function parseHash(): Section {
  if (typeof window === "undefined") return "home";
  const value = window.location.hash.slice(1) as Section;
  return sections.includes(value) ? value : "home";
}

function OceanBackdrop() {
  return (
    <div className="ocean-backdrop">
      <img className="ocean-image" src="/pixel-ocean-bg.png" alt="" />
      <div className="ocean-aurora ocean-aurora--a" />
      <div className="ocean-aurora ocean-aurora--b" />
      <div className="ocean-aurora ocean-aurora--c" />
      <div className="ocean-light" />
      <div className="ocean-grain" />
    </div>
  );
}

function EmptySection({ name, index }: { name: string; index: string }) {
  return (
    <section className="empty-section" aria-labelledby={`${name}-title`}>
      <p className="section-index">// {index}</p>
      <h2 id={`${name}-title`}>{name}</h2>
      <span className="empty-caret" aria-hidden="true" />
    </section>
  );
}

function ToolsSection() {
  return (
    <section className="empty-section tools-section" aria-labelledby="TOOLS-title">
      <p className="section-index">// 01</p>
      <h2 id="TOOLS-title">TOOLS</h2>
      <p className="tools-overview">A quiet command surface for small utilities, experiments and personal data views.</p>
      <a className="tool-entry" href="/tools">
        <span className="tool-entry__prompt">PS C:\TOOLS&gt;</span>
        <strong>OPEN TOOLS-PAGE</strong>
        <span>Browse available modules</span>
        <b aria-hidden="true">↗</b>
      </a>
    </section>
  );
}

function LogsPanel() {
  const history = [
    {
      id: "2026-09-12-interface-pass.md",
      label: "2026-09-12-interface-pass.md",
      live: true,
      lines: [
        <><span className="md-hash">#</span> Sleepy Sturgeon / interface pass</>,
        <span className="md-muted">LIVE · __TIME__</span>,
        <span>&nbsp;</span>,
        <><span className="md-hash">##</span> Current progress</>,
        <><span className="md-bullet">-</span> Home gestures: <span className="md-string">direct content tracking</span> + delayed scene motion.</>,
        <><span className="md-bullet">-</span> Tool hub: <span className="md-code">/tools</span> with a PowerShell workspace.</>,
        <><span className="md-bullet">-</span> F1 module: calendar, standings, circuit data and local session time.</>,
        <><span className="md-bullet">-</span> Liquid glass: reserved for navigation docks with a 34px refractive edge.</>,
        <span>&nbsp;</span>,
        <><span className="md-quote">&gt;</span> Runtime healthy · waiting for the next command.</>,
      ],
    },
    {
      id: "2026-09-11-site-init.md",
      label: "2026-09-11-site-init.md",
      live: false,
      lines: [
        <><span className="md-hash">#</span> Sleepy Sturgeon / site initialization</>,
        <span className="md-muted">ARCHIVED · SEP 11, 2026</span>,
        <span>&nbsp;</span>,
        <><span className="md-hash">##</span> Foundation</>,
        <><span className="md-bullet">-</span> Created the React, TypeScript and Vite static site.</>,
        <><span className="md-bullet">-</span> Added the pixel sturgeon and Material You ocean scene.</>,
        <><span className="md-bullet">-</span> Added <span className="md-code">TOOLS</span>, <span className="md-code">TESTS</span> and <span className="md-code">LOGS</span> routes.</>,
        <><span className="md-bullet">-</span> Prepared the project for GitHub and Cloudflare Pages.</>,
        <span>&nbsp;</span>,
        <><span className="md-quote">&gt;</span> Initial build completed.</>,
      ],
    },
  ];
  const [selected, setSelected] = useState(history[0].id);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const activeLog = history.find((entry) => entry.id === selected) ?? history[0];
  const renderedTime = now
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "medium" }).format(now)
    : "CONNECTING...";
  const logLines = activeLog.lines.map((line) => {
    if (typeof line !== "object" || !line || !("props" in line)) return line;
    const element = line as ReactElement<{ children?: ReactNode }>;
    if (typeof element.props.children === "string" && element.props.children.includes("__TIME__")) {
      return <span className="md-muted">LIVE · {renderedTime}</span>;
    }
    return line;
  });
  return (
    <section className="logs-section" aria-labelledby="logs-title">
      <div className="logs-heading">
        <p className="section-index">// 03</p>
        <h2 id="logs-title">LOGS</h2>
      </div>
      <div className="code-window">
        <aside className="activity-bar" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 4h6l2 2h8v14H4Z" /></svg>
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
          <svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><path d="M8 5h4a4 4 0 0 1 4 4v8M8 5v10a4 4 0 0 0 4 4h4" /></svg>
        </aside>
        <aside className="file-tree" aria-label="Log files">
          <div className="file-tree__title">EXPLORER</div>
          <div className="file-tree__folder"><span>⌄</span> SLEEPY-STURGEON</div>
          <div className="file-tree__folder file-tree__nested"><span>⌄</span> logs</div>
          {history.map((entry) => <button type="button" className="file-tree__file" data-active={entry.id === activeLog.id || undefined} key={entry.id} onClick={() => setSelected(entry.id)}><span>#</span> {entry.label}</button>)}
        </aside>
        <div className="editor-pane">
          <div className="editor-tab"><span>#</span> {activeLog.label} <b>×</b></div>
          <div className="breadcrumbs">logs <span>›</span> {activeLog.label}</div>
          <div className="code-lines" role="region" aria-label={`${activeLog.live ? "Live" : "Archived"} site log`} tabIndex={0}>
            {logLines.map((line, index) => (
              <div className="code-line" key={index}>
                <span className="line-number" aria-hidden="true">{index + 1}</span>
                <code>{line}{index === logLines.length - 1 && <span className="code-caret" aria-hidden="true" />}</code>
              </div>
            ))}
          </div>
          <div className="status-bar"><span><i className={activeLog.live ? "live-dot" : "archive-dot"} /> {activeLog.live ? "live" : "archived"}</span><span>Ln {logLines.length}, Col 31&nbsp;&nbsp; UTF-8&nbsp;&nbsp; Markdown</span></div>
        </div>
      </div>
    </section>
  );
}

type OpticalRefs = {
  dock: React.RefObject<HTMLElement | null>;
  map: React.RefObject<SVGFEImageElement | null>;
  spec: React.RefObject<SVGFEImageElement | null>;
  displacement: React.RefObject<SVGFEDisplacementMapElement | null>;
};

export function useLiquidGlass({ dock, map, spec, displacement }: OpticalRefs) {
  useEffect(() => {
    const dockNode = dock.current;
    const mapNode = map.current;
    const specNode = spec.current;
    const displacementNode = displacement.current;
    if (!dockNode || !mapNode || !specNode || !displacementNode) return;

    const SS = 3;
    const IOR = 1.62;
    const BEVEL = 34;
    const STRENGTH = 1.55;
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
    const smoothstep = (value: number) => { const t = clamp01(value); return t * t * (3 - 2 * t); };
    const sdf = (x: number, y: number, hw: number, hh: number, radius: number) => {
      const qx = Math.abs(x) - (hw - radius);
      const qy = Math.abs(y) - (hh - radius);
      return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
    };
    const setHref = (node: SVGFEImageElement, value: string) => {
      node.setAttribute("href", value);
      node.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", value);
    };

    const syncClone = () => {
      const bounds = dockNode.getBoundingClientRect();
      dockNode.style.setProperty("--clone-x", `${-bounds.left}px`);
      dockNode.style.setProperty("--clone-y", `${-bounds.top}px`);
    };
    const build = () => {
      const bounds = dockNode.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const cw = width * SS;
      const ch = height * SS;
      const dCanvas = document.createElement("canvas");
      const sCanvas = document.createElement("canvas");
      dCanvas.width = sCanvas.width = cw;
      dCanvas.height = sCanvas.height = ch;
      const dc = dCanvas.getContext("2d");
      const sc = sCanvas.getContext("2d");
      if (!dc || !sc) return;
      const di = dc.createImageData(cw, ch);
      const si = sc.createImageData(cw, ch);
      const dxs = new Float32Array(cw * ch);
      const dys = new Float32Array(cw * ch);
      const azimuth = 132 * Math.PI / 180;
      const lx = Math.cos(azimuth);
      const ly = Math.sin(azimuth);
      let max = 0;

      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const px = (x + .5) / SS - width / 2;
        const py = (y + .5) / SS - height / 2;
        const distance = sdf(px, py, width / 2, height / 2, height / 2);
        const fromEdge = -distance;
        if (distance >= 0 || fromEdge >= BEVEL) continue;
        const u = 1 - Math.max(fromEdge / BEVEL, .02);
        const slope = u ** 3 / Math.pow(1 - u ** 4, .75);
        const theta1 = Math.atan(slope);
        const theta2 = Math.asin(clamp01(Math.sin(theta1) / IOR));
        const fade = smoothstep((BEVEL - fromEdge) / Math.min(8, BEVEL * .45)) * smoothstep(fromEdge);
        const gx = sdf(px + 1, py, width / 2, height / 2, height / 2) - sdf(px - 1, py, width / 2, height / 2, height / 2);
        const gy = sdf(px, py + 1, width / 2, height / 2, height / 2) - sdf(px, py - 1, width / 2, height / 2, height / 2);
        const length = Math.hypot(gx, gy) || 1;
        const nx = gx / length;
        const ny = gy / length;
        const magnitude = Math.tan(theta1 - theta2) * BEVEL * fade * STRENGTH;
        const index = y * cw + x;
        dxs[index] = -nx * magnitude;
        dys[index] = -ny * magnitude;
        max = Math.max(max, magnitude);
        const tilt = Math.sin(theta1);
        const light = Math.pow(Math.abs(nx * tilt * lx + ny * tilt * ly), 9.375);
        const alpha = Math.min(255, Math.round(Math.max(light, tilt * .018) * .58 * Math.min(1, tilt * 1.7) * fade * 255));
        const p = index * 4;
        si.data[p] = si.data[p + 1] = si.data[p + 2] = 255;
        si.data[p + 3] = alpha;
      }
      const norm = max > 0 ? 1 / max : 1;
      for (let i = 0; i < cw * ch; i++) {
        const p = i * 4;
        di.data[p] = Math.round(128 + dxs[i] * norm * 127);
        di.data[p + 1] = Math.round(128 + dys[i] * norm * 127);
        di.data[p + 2] = 128;
        di.data[p + 3] = 255;
      }
      dc.putImageData(di, 0, 0);
      sc.putImageData(si, 0, 0);
      mapNode.setAttribute("width", String(width)); mapNode.setAttribute("height", String(height));
      specNode.setAttribute("width", String(width)); specNode.setAttribute("height", String(height));
      setHref(mapNode, dCanvas.toDataURL());
      setHref(specNode, sCanvas.toDataURL());
      displacementNode.setAttribute("scale", String(max * 2));
      syncClone();
    };
    let syncFrame = 0;
    const syncDuringTransition = () => {
      const started = performance.now();
      cancelAnimationFrame(syncFrame);
      const tick = () => {
        syncClone();
        if (performance.now() - started < 900) syncFrame = requestAnimationFrame(tick);
      };
      tick();
    };
    const observer = new ResizeObserver(build);
    observer.observe(dockNode);
    build();
    window.addEventListener("resize", build);
    dockNode.addEventListener("transitionrun", syncDuringTransition);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(syncFrame);
      window.removeEventListener("resize", build);
      dockNode.removeEventListener("transitionrun", syncDuringTransition);
    };
  }, [dock, map, spec, displacement]);
}

export default function Experience() {
  const [active, setActive] = useState<Section>("home");
  const rootRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLElement>(null);
  const mapRef = useRef<SVGFEImageElement>(null);
  const specRef = useRef<SVGFEImageElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const selectorMapRef = useRef<SVGFEImageElement>(null);
  const selectorSpecRef = useRef<SVGFEImageElement>(null);
  const selectorDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const [selectorMoving, setSelectorMoving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const navLock = useRef(0);
  const touchStart = useRef<number | null>(null);
  const touchOffset = useRef(0);
  const releaseFrame = useRef(0);
  const pointerFrame = useRef(0);
  const dragFrame = useRef(0);
  useLiquidGlass({ dock: dockRef, map: mapRef, spec: specRef, displacement: displacementRef });
  useLiquidGlass({ dock: selectorRef, map: selectorMapRef, spec: selectorSpecRef, displacement: selectorDisplacementRef });

  useEffect(() => {
    if (active === "home") return;
    setSelectorMoving(true);
    const timer = window.setTimeout(() => setSelectorMoving(false), 820);
    return () => window.clearTimeout(timer);
  }, [active]);

  const navigate = useCallback((next: Section, replace = false) => {
    setActive(next);
    const hash = `#${next}`;
    if (window.location.hash !== hash) window.history[replace ? "replaceState" : "pushState"](null, "", hash);
  }, []);

  const step = useCallback((direction: number) => {
    const now = performance.now();
    if (now - navLock.current < 720) return;
    navLock.current = now;
    const index = sections.indexOf(active);
    navigate(sections[Math.max(0, Math.min(sections.length - 1, index + direction))]);
  }, [active, navigate]);

  useEffect(() => {
    navigate(parseHash(), true);
    const sync = () => setActive(parseHash());
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, [navigate]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(event.key)) { event.preventDefault(); step(1); }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); step(-1); }
      if (event.key === "Home" || event.key === "Escape") navigate("home");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [navigate, step]);

  const onPointerMove = (event: React.PointerEvent) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !rootRef.current) return;
    const x = (event.clientX / innerWidth - .5) * 2;
    const y = (event.clientY / innerHeight - .5) * 2;
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      rootRef.current?.style.setProperty("--pointer-x", x.toFixed(3));
      rootRef.current?.style.setProperty("--pointer-y", y.toFixed(3));
    });
  };

  return (
    <main
      ref={rootRef}
      className={`experience is-${active}`}
      data-dragging={dragging || undefined}
      onPointerMove={onPointerMove}
      onWheel={(event) => { if (Math.abs(event.deltaY) > 18) step(event.deltaY > 0 ? 1 : -1); }}
      onTouchStart={(event) => {
        cancelAnimationFrame(releaseFrame.current);
        touchStart.current = event.touches[0]?.clientY ?? null;
        touchOffset.current = 0;
        setDragging(true);
      }}
      onTouchMove={(event) => {
        if (touchStart.current === null || !rootRef.current) return;
        const current = event.touches[0]?.clientY ?? touchStart.current;
        let offset = current - touchStart.current;
        const index = sections.indexOf(active);
        if ((index === 0 && offset > 0) || (index === sections.length - 1 && offset < 0)) offset *= .24;
        offset = Math.max(-innerHeight * .42, Math.min(innerHeight * .42, offset));
        touchOffset.current = offset;
        cancelAnimationFrame(dragFrame.current);
        dragFrame.current = requestAnimationFrame(() => rootRef.current?.style.setProperty("--drag-y", `${offset}px`));
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current);
        const index = sections.indexOf(active);
        const direction = delta > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(sections.length - 1, index + direction));
        const changesPage = Math.abs(delta) > Math.min(90, innerHeight * .12) && nextIndex !== index;
        if (changesPage && rootRef.current) {
          rootRef.current.style.setProperty("--drag-y", `${touchOffset.current + direction * innerHeight}px`);
          navLock.current = performance.now();
          navigate(sections[nextIndex]);
        }
        touchStart.current = null;
        releaseFrame.current = requestAnimationFrame(() => {
          setDragging(false);
          releaseFrame.current = requestAnimationFrame(() => rootRef.current?.style.setProperty("--drag-y", "0px"));
        });
      }}
      onTouchCancel={() => {
        touchStart.current = null;
        setDragging(false);
        releaseFrame.current = requestAnimationFrame(() => rootRef.current?.style.setProperty("--drag-y", "0px"));
      }}
    >
      <div className="scene-source" aria-hidden="true"><OceanBackdrop /></div>
      <div className="fish-wrap" aria-hidden="true"><img src="/sturgeon-hero.png" alt="" /></div>
      <div className="depth-mark" aria-hidden="true"><span>SS / {String(sections.indexOf(active)).padStart(2, "0")}</span><i /></div>
      <nav className="section-rail" aria-label="Section navigation">{sections.map((item) => <button type="button" key={item} className={active === item ? "active" : ""} aria-label={`Go to ${item}`} aria-current={active === item ? "page" : undefined} onClick={() => navigate(item)} />)}</nav>

      <div className="section-stage" style={{ transform: `translate3d(0, calc(-${sections.indexOf(active) * 100}dvh + var(--drag-y, 0px)), 0)` }}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker">PERSONAL SYSTEM · EST. 2026</p>
            <h1 id="hero-title"><span>SLEEPY</span><span>STURGEON</span></h1>
            <p className="hero-subtitle">{placeholderCopy}</p>
          </div>
          <div className="explore-cue" aria-hidden="true"><span>SCROLL TO EXPLORE</span><i /></div>
        </section>
        <ToolsSection />
        <EmptySection name="TESTS" index="02" />
        <LogsPanel />
      </div>

      <nav ref={dockRef} className="liquid-dock" aria-label="Primary navigation">
        <div className="liquid-dock__refraction" aria-hidden="true"><div className="dock-scene-clone"><OceanBackdrop /></div></div>
        <div className="liquid-dock__surface" aria-hidden="true" />
        <div className="liquid-dock__content">
          <div
            ref={selectorRef}
            className="dock-selector"
            data-visible={active !== "home" || undefined}
            data-moving={selectorMoving || undefined}
            style={{ transform: `translate3d(${Math.max(0, navItems.findIndex((item) => item.id === active)) * 100}%, 0, 0)` }}
            aria-hidden="true"
          >
            <div className="dock-selector__refraction"><div className="dock-scene-clone"><OceanBackdrop /></div></div>
            <span className="dock-selector__rest" />
          </div>
          {navItems.map((item) => (
            <button key={item.id} type="button" className="dock-item" data-active={active === item.id || undefined} aria-current={active === item.id ? "page" : undefined} onClick={() => { navLock.current = performance.now(); navigate(item.id); }}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg><span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <svg className="filter-host" colorInterpolationFilters="sRGB" aria-hidden="true">
        <defs><filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feImage ref={mapRef} preserveAspectRatio="none" result="rawMap" /><feGaussianBlur in="rawMap" stdDeviation="0.35" result="map" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.18" result="softSrc" /><feDisplacementMap ref={displacementRef} in="softSrc" in2="map" scale="34" xChannelSelector="R" yChannelSelector="G" result="refracted" />
          <feImage ref={specRef} preserveAspectRatio="none" result="spec" /><feBlend mode="normal" in="spec" in2="refracted" />
        </filter></defs>
      </svg>
      <svg className="filter-host" colorInterpolationFilters="sRGB" aria-hidden="true">
        <defs><filter id="selector-glass-filter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feImage ref={selectorMapRef} preserveAspectRatio="none" result="rawMap" /><feGaussianBlur in="rawMap" stdDeviation="0.35" result="map" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.18" result="softSrc" /><feDisplacementMap ref={selectorDisplacementRef} in="softSrc" in2="map" scale="34" xChannelSelector="R" yChannelSelector="G" result="refracted" />
          <feImage ref={selectorSpecRef} preserveAspectRatio="none" result="spec" /><feBlend mode="normal" in="spec" in2="refracted" />
        </filter></defs>
      </svg>
      <p className="sr-only" aria-live="polite">Current section: {active}</p>
    </main>
  );
}
