import React from "react";
import { Link } from "react-router-dom";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import sourceRegister from "@/data/catalogue/sources.json";

// Pitch-style landing page: the problem, one stat, the user.
const SOURCE_COUNT = sourceRegister.sources.length;

const slide = "min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-5 sm:px-10";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader />

      <section className={slide}>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#717171]">The problem</p>
        <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight md:whitespace-nowrap">
          The help is out there. Finding it isn't.
        </h1>
      </section>

      <section className={`${slide} bg-[#f7f7f7]`}>
        <p className="text-[7rem] sm:text-[11rem] leading-none font-bold text-[#15803D]">{SOURCE_COUNT}</p>
        <p className="mt-4 text-xl sm:text-2xl max-w-2xl">
          official websites hold Ireland's grants and supports.
        </p>
      </section>

      <section className={`${slide} py-16`}>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#717171]">The user</p>
        <img
          src="/images/great-aunt.webp"
          alt="An 88-year-old woman sitting on a sofa at home"
          className="mt-6 w-full max-w-sm aspect-[3/4] object-cover object-[center_55%] rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
        />
        <p className="mt-8 text-2xl sm:text-3xl font-semibold">
          My great aunt, 88.
          <br />
          <span className="text-[#717171]">Her heating stopped working.</span>
        </p>
        <Link
          to="/"
          className="mt-10 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-6 py-3.5 transition"
        >
          Find supports
        </Link>
      </section>
    </div>
  );
}
