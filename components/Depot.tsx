"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { SECTIONS, PILE } from "./data";

const EASE = "cubic-bezier(.55,0,.25,1)";
const SPRING = "cubic-bezier(.34,1.5,.5,1)";
const HOVER = 58, LIFT = 62, ARM = 44; // claw head heights; ARM = head (34) + arm bar (10)
const NAV = [["Work", 1], ["About", 2], ["Process", 3], ["Contact", 6]] as const;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Claw = { ci: number; y: "hover" | "grab" | "lift"; fo: boolean; tx: number; ty: number };
const css = (o: Record<string, string | number>) => o as CSSProperties;

export default function Depot() {
  const stage = useRef<HTMLElement>(null);
  const [sz, setSz] = useState({ w: 0, h: 0 });
  const [lifted, setLifted] = useState<number | null>(null);
  const [held, setHeld] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const [claw, setClaw] = useState<Claw>({ ci: 0, y: "hover", fo: true, tx: 0, ty: 0 });
  const liftedRef = useRef<number | null>(null);
  const openRef = useRef(false);
  const busy = useRef(false);
  const next = useRef<number | null>(null);
  const reduce = useRef(false);
  const started = useRef(false);

  useLayoutEffect(() => {
    const el = stage.current!;
    const measure = () => setSz({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- the pick sequence ----
  const run = useCallback(async (j: number) => {
    const r = reduce.current;
    const t = (s: number) => (r ? 0 : s);
    const w = (ms: number) => sleep(r ? 30 : ms);
    const cur = liftedRef.current;
    if (cur === j && openRef.current) return;

    if (cur !== null) { // 1. put the held box back
      setOpen(false); openRef.current = false; await w(450);
      setClaw({ ci: cur, y: "grab", fo: false, tx: t(.85), ty: t(.85) });
      liftedRef.current = null; setLifted(null); await w(850);
      setClaw((c) => ({ ...c, fo: true })); await w(300);
      setHeld(null);
    }
    setClaw({ ci: j, y: "hover", fo: true, tx: t(.75), ty: t(.75) }); await w(750); // 2. travel
    setClaw((c) => ({ ...c, y: "grab", ty: t(.56) })); await w(560);               // 3. drop
    setClaw((c) => ({ ...c, fo: false })); await w(240);                            // 4. grip
    setHeld(j); liftedRef.current = j; setLifted(j);                                // 5. lift + grow
    setClaw((c) => ({ ...c, y: "lift", tx: t(.95), ty: t(.95) })); await w(950);
    setOpen(true); openRef.current = true; await w(750);                            // 6. doors
    document.getElementById(`h-${j}`)?.focus({ preventScroll: true });             // 7. focus
  }, []);

  // clicks during a sequence are queued; the latest wins
  const pick = useCallback((j: number) => {
    if (busy.current) { next.current = j; return; }
    busy.current = true;
    (async () => {
      let n: number | null = j;
      while (n !== null) { await run(n); n = next.current; next.current = null; }
      busy.current = false;
    })();
  }, [run]);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && pick(0);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [pick]);

  useEffect(() => {
    if (sz.w > 0 && !started.current) { started.current = true; const id = setTimeout(() => pick(0), 500); return () => clearTimeout(id); }
  }, [sz.w, pick]);

  // ---- geometry (recomputed on every resize) ----
  const mob = sz.w <= 700;
  const W = mob ? Math.min(170, sz.w * .38) : Math.min(310, Math.max(200, sz.w * .2));
  const H = W * (mob ? .6 : .43), D = W * (mob ? .56 : .4), S = mob ? 2.4 : 1.95;
  const pos = (i: number) => { const p = PILE[i][mob ? "m" : "d"]; return { x: p[0] * sz.w, y: p[1] * sz.h }; };
  const grabHead = (i: number) => Math.max(HOVER, pos(i).y - H / 2 - ARM);
  const head = claw.y === "hover" ? HOVER : claw.y === "lift" ? LIFT : grabHead(claw.ci);
  const clawX = claw.y === "lift" ? sz.w / 2 : pos(claw.ci).x;
  const cw = claw.y === "lift" ? W * S : W;
  const fh = Math.max(28, Math.min(120, (claw.y === "lift" ? H * S : H) * .5));
  const fin = (side: 1 | -1): CSSProperties => ({
    position: "absolute", top: 34, width: 10, height: fh, transformOrigin: "50% 0",
    borderRadius: "0 0 8px 8px", background: "linear-gradient(90deg,#fff,#d5dde8)", boxShadow: "0 3px 6px rgba(8,50,120,.3)",
    transform: `rotate(${claw.fo ? 16 * side : 0}deg)`,
    transition: `transform ${claw.fo ? ".4s " + SPRING : ".24s " + EASE}, height ${claw.ty}s ${EASE}`,
  });

  return (
    <main className="depot-bg relative flex h-[100dvh] flex-col overflow-hidden">
      {/* ---- navigation ---- */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-y-1 px-[14px] py-2 dsk:h-[72px] dsk:px-12 dsk:py-0">
        {logoOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/logo.png" alt="Debbie" onError={() => setLogoOk(false)} className="w-[92px] dsk:w-[112px]" style={{ filter: "invert(1)", mixBlendMode: "screen" }} />
        ) : <span className="font-display text-2xl font-bold text-white">debbie</span>}
        <nav aria-label="Sections" className="order-3 flex w-full justify-center gap-6 dsk:order-none dsk:w-auto dsk:gap-9">
          {NAV.map(([name, i]) => (
            <button key={name} onClick={() => pick(i)} className="text-[15px] font-bold text-[#e6f3ff] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd23f]">{name}</button>
          ))}
        </nav>
        <a href="mailto:hello@debbie.example" className="font-display font-semibold text-white">Let&apos;s Talk ↗</a>
      </header>

      {/* ---- stage ---- */}
      <section ref={stage} className="relative flex-1 overflow-hidden" style={{ perspective: 1400, perspectiveOrigin: "50% 40%" }}>
        <p aria-hidden className="absolute left-12 top-2 hidden text-[11px] font-bold tracking-[.2em] text-[#d7ecff] dsk:block">
          DEBBIE&apos;S DEPOT · <span className="text-[#ffd23f]">7 CONTAINERS</span> · 2026
        </p>
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display font-bold leading-none tracking-[-.04em] text-white" style={{ fontSize: "clamp(90px,19vw,330px)" }}>PORTFOLIO</div>

        {/* rail + claw */}
        {sz.w > 0 && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{ zIndex: 200 }}>
            <div className="absolute inset-x-0 top-[14px] h-4 rounded-full" style={{ background: "linear-gradient(180deg,#fff,#c9d3df)", boxShadow: "0 6px 14px rgba(8,60,140,.35)" }}>
              <div className="absolute inset-x-3 top-1/2 border-t border-dashed border-slate-400/70" />
            </div>
            <div style={{ position: "absolute", left: clawX, top: 0, width: 0, transition: `left ${claw.tx}s ${EASE}` }}>
              <div style={{ position: "absolute", left: -34, top: 5, width: 68, height: 34, borderRadius: 10, background: "linear-gradient(180deg,#fff,#d5dde8)", boxShadow: "0 4px 10px rgba(8,50,120,.3)" }}>
                <i className="absolute left-3 top-[6px] h-[7px] w-[7px] rounded-full bg-slate-400" />
                <i className="absolute right-3 top-[6px] h-[7px] w-[7px] rounded-full bg-slate-400" />
              </div>
              <div style={{ position: "absolute", left: -3, top: 39, width: 6, height: head - 39, background: "linear-gradient(90deg,#8e9aa8,#fff,#8e9aa8)", transition: `height ${claw.ty}s ${EASE}` }} />
              <div style={css({ position: "absolute", left: 0, top: 0, transform: `translateY(${head}px)`, "--cw": `${cw}px`, transition: `transform ${claw.ty}s ${EASE}, --cw ${claw.ty}s ${EASE}` })}>
                <div style={{ position: "absolute", left: -36, top: 0, width: 72, height: 34, borderRadius: 12, background: "linear-gradient(180deg,#fff,#d5dde8)", boxShadow: "0 5px 10px rgba(8,50,120,.3)" }} />
                <div style={{ position: "absolute", top: 34, height: 10, left: "calc(var(--cw) * -.53 - 10px)", width: "calc(var(--cw) * 1.06 + 20px)", borderRadius: 5, background: "linear-gradient(180deg,#fff,#cdd6e2)" }} />
                <div style={{ ...fin(-1), left: "calc(var(--cw) * -.53 - 10px)" }} />
                <div style={{ ...fin(1), left: "calc(var(--cw) * .53)" }} />
              </div>
            </div>
          </div>
        )}

        {/* containers */}
        {sz.w > 0 && SECTIONS.map((s, i) => {
          const isUp = lifted === i, p = pos(i), t = PILE[i].t;
          const wi = isUp ? W * S : W, hi = isUp ? H * S : H, di = isUp ? D * S : D;
          const x = isUp ? sz.w / 2 : p.x, y = isUp ? LIFT + ARM + hi / 2 : p.y;
          const rot = isUp ? "rotateX(-7deg) rotateY(-11deg) rotateZ(0deg)" : `rotateX(${t[0]}deg) rotateY(${t[1]}deg) rotateZ(${t[2]}deg)`;
          const d = held === i ? claw.ty : 0;
          const tr = ["left", "top", "transform", "--w", "--h", "--d"].map((k) => `${k} ${d}s ${EASE}`).join(",") + ", translate .2s";
          const isOpen = isUp && open;
          const doorTr = isOpen ? `transform .75s ${SPRING}` : `transform .45s ${EASE}`;
          const lf = `calc(var(--h) * ${mob ? .25 : .28})`;
          return (
            <div key={i} className={`box ${isUp ? "up" : ""}`}
              style={css({ left: x, top: y, zIndex: held === i ? 100 : Math.round(p.y), transform: `translate(-50%,-50%) ${rot}`, transition: tr,
                "--w": `${wi}px`, "--h": `${hi}px`, "--d": `${di}px`, "--c": s.c, "--k": s.k })}>
              <div className="face ribs-k" style={{ inset: 0, transform: "rotateY(180deg) translateZ(calc(var(--d) / 2))" }} />
              {[-1, 1].map((n) => (
                <div key={n} className="face end" style={{ width: "var(--d)", height: "100%", left: "50%", marginLeft: "calc(var(--d) / -2)", transform: `rotateY(${90 * n}deg) translateZ(calc(var(--w) / 2))` }} />
              ))}
              <div className="face ribs" style={{ width: "100%", height: "var(--d)", top: "50%", marginTop: "calc(var(--d) / -2)", transform: "rotateX(90deg) translateZ(calc(var(--h) / 2))" }} />
              <div className="face ribs-k" style={{ width: "100%", height: "var(--d)", top: "50%", marginTop: "calc(var(--d) / -2)", transform: "rotateX(-90deg) translateZ(calc(var(--h) / 2))" }} />

              {/* inside wall, just behind the doors */}
              <div className="wall" inert={!isOpen} style={{ transform: "translateZ(calc(var(--d) / 2 - 2px))", opacity: isOpen ? 1 : 0, transition: "opacity .5s .2s" }}>
                <div className="px-[1.2em]">
                  <p className="text-[.62em] font-extrabold tracking-[.2em]" style={{ color: s.acc }}>{s.kicker}</p>
                  <h2 id={`h-${i}`} tabIndex={-1} className="mt-[.35em] font-display text-[2.1em] font-semibold leading-none outline-none text-white">
                    {s.h[0]}<span className="font-serif font-normal italic" style={{ color: s.acc }}>{s.h[1]}</span>{s.h[2]}
                  </h2>
                  {s.p && <p className="mx-auto mt-[.8em] max-w-[30em] text-[.82em] leading-snug">{s.p}</p>}
                  {s.list && <ul className="mt-[.8em] text-[.8em]">{s.list.map(([a, b]) => <li key={a} className="mt-[.4em]"><b className="text-white">{a}</b> · {b}</li>)}</ul>}
                  {s.chips && <div className="mt-[.9em] flex flex-wrap justify-center">{s.chips.map((c) => <span key={c} className="m-[.2em] rounded-full border border-white/30 px-[.9em] py-[.3em] text-[.72em] font-bold">{c}</span>)}</div>}
                  {s.cta && <a href={s.cta.href} className="mt-[1em] inline-block rounded-full px-[1.2em] py-[.55em] font-display text-[.8em] font-semibold text-[#0b1a3d]" style={{ background: s.acc }}>{s.cta.text}</a>}
                </div>
              </div>

              {/* front: two doors inside one real button */}
              <button className="front" aria-label={`Open the ${s.label.join(" ")} container`} onClick={() => pick(i)}
                style={{ transform: "translateZ(calc(var(--d) / 2))", pointerEvents: isOpen ? "none" : "auto" }}>
                <span className="door dr" style={{ transform: `rotateY(${isOpen ? 122 : 0}deg)`, transition: doorTr }}>
                  <span className="df out ribs"><span className="tag">{s.tag}</span></span>
                  <span className="df in" />
                </span>
                <span className="door dl" style={{ transform: `rotateY(${isOpen ? -122 : 0}deg)`, transition: doorTr }}>
                  <span className="df out ribs"><b className="lab" style={{ fontSize: lf }}>{s.label[0]}<br />{s.label[1]}</b></span>
                  <span className="df in" />
                </span>
              </button>
            </div>
          );
        })}

        <div aria-hidden className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[11px] font-extrabold tracking-[.18em] text-white backdrop-blur-md dsk:block" style={{ zIndex: 300 }}>
          PICK A CONTAINER ↓
        </div>
      </section>
    </main>
  );
}
