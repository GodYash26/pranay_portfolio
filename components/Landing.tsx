"use client";
import { useEffect, useRef } from "react";
import Depot from "./Depot";
import { WORKS } from "./data";

export default function Landing() {
  const dim = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);

  // as the work section slides over, the hero recedes a little and darkens
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      if (dim.current) dim.current.style.opacity = String(p * 0.55);
      if (hero.current) hero.current.style.transform = `scale(${1 - p * 0.06})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div className="sticky top-0 z-0 h-[100dvh] overflow-hidden">
        <div ref={hero} className="h-full origin-top will-change-transform"><Depot /></div>
        <div ref={dim} aria-hidden className="pointer-events-none absolute inset-0 bg-[#06204a] opacity-0" style={{ zIndex: 400 }} />
      </div>

      <section id="works" aria-labelledby="works-h" className="depot-bg relative z-10 min-h-[100dvh] rounded-t-[36px] px-[14px] pb-24 pt-16 shadow-[0_-30px_60px_rgba(4,30,80,.45)] dsk:px-12 dsk:pt-24">
        <div className="relative mx-auto max-w-[1280px]">
          <p className="text-[11px] font-bold tracking-[.2em] text-[#d7ecff]">SELECTED WORK · <span className="text-[#ffd23f]">{WORKS.length} PROJECTS</span></p>
          <h2 id="works-h" className="mt-3 font-display font-bold leading-none tracking-[-.04em] text-white" style={{ fontSize: "clamp(56px,11vw,180px)" }}>
            THE <span className="font-serif font-normal italic text-[#ffd23f]">work</span>
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 dsk:mt-16 dsk:grid-cols-3 dsk:gap-8">
            {WORKS.map((w, i) => (
              <a key={w.title} href="#" className={`group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd23f] ${i % 3 === 1 ? "dsk:translate-y-10" : ""}`}>
                <div className="overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-[0_14px_30px_rgba(8,50,120,.35)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.img} alt={w.title} loading="lazy" className="aspect-[9/7] w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-white">{w.title}</h3>
                  <span className="text-xs font-bold tracking-[.15em] text-[#d7ecff]">{w.year}</span>
                </div>
                <p className="mt-1 text-sm text-[#e6f3ff]">{w.note}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {w.tags.map((t) => <span key={t} className="rounded-full border border-white/30 px-3 py-0.5 text-[11px] font-bold text-white">{t}</span>)}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
