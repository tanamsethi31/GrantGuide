import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUp, ChevronDown } from "lucide-react";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import sourceRegister from "@/data/catalogue/sources.json";
import { grantById } from "@/data/grants";
import { headline, formatEur } from "@/lib/grantDisplay";
import { IMG } from "@/lib/supportImages";

// Pitch-style landing page: the problem, one stat, the user.

const SOURCES = sourceRegister.sources;

// Dot colours for the stat slide, one per kind of official source.
const LEVELS = [
  { level: "Local authority", label: "councils", color: "#86EFAC" },
  { level: "National agency", label: "national agencies", color: "#22C55E" },
  { level: "Department", label: "government departments", color: "#FDE68A" },
  { level: "Official portal", label: "official portals", color: "#FFFFFF" },
  { level: "Public information body", label: "information bodies", color: "#F59E0B" },
];
const colorFor = (level) => LEVELS.find((l) => l.level === level)?.color || "#FFFFFF";
const countOf = (level) => SOURCES.filter((s) => s.level === level).length;

// Real catalogue schemes relevant to an older person whose heating has failed.
// The headline grant pays for essential home repairs; its amount comes from the catalogue.
const HER_GRANT = grantById("IE-HOUSING-OLDER-PEOPLE");
const ALSO_CHECK = ["IE-SEAI-WARMER-HOMES", "IE-DSP-FUEL-ALLOWANCE"].map(grantById).filter(Boolean);

// Photos scattered around the headline (desktop only).
const SCATTER = [
  { src: IMG.energy, className: "left-[4%] top-[12%] w-40 -rotate-6" },
  { src: IMG.elderly, className: "right-[5%] top-[10%] w-44 rotate-6" },
  { src: IMG.housing, className: "left-[9%] bottom-[10%] w-36 rotate-3" },
  { src: IMG.health, className: "right-[10%] bottom-[12%] w-36 -rotate-3" },
  { src: IMG.family, className: "left-[22%] top-[4%] w-28 rotate-2" },
  { src: IMG.travel, className: "right-[24%] bottom-[4%] w-28 -rotate-2" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function Reveal({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to `to` the first time it scrolls into view. */
function CountUp({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / 1200, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  return <span ref={ref}>{n}</span>;
}

function ProblemSlide() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-5 sm:px-10 bg-[radial-gradient(ellipse_at_center,#F0FDF4_0%,#FFFFFF_65%)]">
      {SCATTER.map((p, i) => (
        <motion.img
          key={p.src + i}
          src={p.src}
          alt=""
          aria-hidden="true"
          className={`hidden lg:block absolute aspect-square object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] opacity-90 ${p.className}`}
          animate={reduce ? undefined : { y: [0, i % 2 ? 10 : -10, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <Reveal className="relative">
        <p className="inline-block rounded-full bg-white border border-[#dddddd] px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-[#717171] shadow-sm">
          The problem
        </p>
        <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight md:whitespace-nowrap">
          The help is out there. <span className="relative text-[#15803D] whitespace-nowrap">
            Finding it isn't.
            <svg className="absolute left-0 -bottom-3 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 9 C 50 2, 150 2, 198 8" fill="none" stroke="#86EFAC" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
      </Reveal>
      <motion.div
        className="absolute bottom-8 flex flex-col items-center text-sm text-[#717171]"
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

function StatSlide() {
  const reduce = useReducedMotion();
  return (
    <section className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-5 sm:px-10 py-20 bg-[#14532D] text-white">
      <Reveal>
        <p className="text-[7rem] sm:text-[11rem] leading-none font-bold tracking-tight">
          <CountUp to={SOURCES.length} />
        </p>
        <p className="mt-4 text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto">
          official websites hold Ireland's grants and supports.
        </p>
      </Reveal>

      {/* One dot per official source, coloured by kind. */}
      <motion.ul
        className="mt-12 grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1.5 sm:gap-2 w-full max-w-xl"
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, amount: 0.3 }}
        variants={{ show: { transition: { staggerChildren: 0.012 } } }}
        aria-label={`${SOURCES.length} official sources`}
      >
        {SOURCES.map((s) => (
          <motion.li
            key={s.name}
            title={s.name}
            className="aspect-square rounded-[4px]"
            style={{ backgroundColor: colorFor(s.level) }}
            variants={{ hidden: { opacity: 0, scale: 0.4 }, show: { opacity: 1, scale: 1 } }}
          />
        ))}
      </motion.ul>

      <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/80">
        {LEVELS.map((l) => (
          <li key={l.level} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: l.color }} />
            {countOf(l.level)} {l.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function UserSlide() {
  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center px-5 sm:px-10 py-20">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-4 rounded-[2rem] bg-[#F0FDF4] -rotate-3" aria-hidden="true" />
          <img
            src="/images/great-aunt.webp"
            alt="An 88-year-old woman sitting on a sofa at home"
            className="relative w-full aspect-[4/5] object-cover object-[center_55%] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
          />
          <span className="absolute -bottom-5 -right-3 sm:-right-5 rounded-2xl bg-white border border-[#ebebeb] shadow-[0_6px_16px_rgba(0,0,0,0.12)] px-5 py-3 text-left">
            <span className="block text-3xl font-bold text-[#15803D] leading-none">88</span>
            <span className="block text-sm text-[#717171] mt-1">years old</span>
          </span>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="inline-block rounded-full bg-[#F0FDF4] px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-[#15803D]">
            The user
          </p>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
            My great aunt, 88.
            <br />
            <span className="text-[#717171]">Her heating stopped working.</span>
          </h2>

          {/* What that looks like on GrantGuide, using real catalogue entries. */}
          <div className="mt-10 rounded-3xl border border-[#dddddd] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-5">
            <div className="flex items-center gap-3 rounded-2xl border border-[#ebebeb] bg-[#f7f7f7] pl-4 pr-2 py-2">
              <p className="flex-1 text-base text-[#222222]">My heating stopped working and I'm 88</p>
              <span className="w-9 h-9 shrink-0 rounded-full bg-[#15803D] text-white flex items-center justify-center" aria-hidden="true">
                <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
              </span>
            </div>
            {HER_GRANT && (
              <div className="mt-5 rounded-2xl bg-[#14532D] text-white p-5">
                <p className="text-sm text-white/80">She may be able to get</p>
                <p className="mt-1 text-4xl sm:text-5xl font-bold tracking-tight">
                  up to <span className="text-[#86EFAC]">{formatEur(HER_GRANT.amountEur)}</span>
                </p>
                <p className="mt-2 font-semibold">{HER_GRANT.name}</p>
                <p className="mt-1 text-sm text-white/75">
                  For essential repairs so older people can stay at home. The amount depends on household income.
                </p>
              </div>
            )}
            <p className="mt-5 mb-1 text-sm font-semibold text-[#717171]">Also worth checking</p>
            <ul className="divide-y divide-[#ebebeb]">
              {ALSO_CHECK.map((g) => {
                const h = headline(g);
                return (
                  <li key={g.id} className="flex items-center justify-between gap-4 py-3">
                    <span className="font-semibold text-[#222222]">{g.name.split(" | ")[0]}</span>
                    <span className="shrink-0 text-sm text-[#15803D] font-semibold">
                      {h.value}
                      {g.amountEur != null && h.sub ? ` ${h.sub.split(" ")[0].toLowerCase()}` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-6 py-3.5 transition"
          >
            Find supports <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader />
      <ProblemSlide />
      <StatSlide />
      <UserSlide />
    </div>
  );
}
