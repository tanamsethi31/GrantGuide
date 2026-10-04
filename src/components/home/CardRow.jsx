import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SupportCard from "@/components/supports/SupportCard";
import CountyFlag from "@/components/home/CountyFlag";

export default function CardRow({ title, county, category, saved }) {
  const [supports, setSupports] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    let live = true;
    setSupports(null);
    base44.functions
      .invoke("findSupports", { query: "", location: county, category: category === "Any" ? "" : category, details: "" })
      .then((res) => live && setSupports(res.data.supports || []))
      .catch(() => live && setSupports([]));
    return () => { live = false; };
  }, [county, category]);

  const scroll = (d) => ref.current?.scrollBy({ left: d * 600, behavior: "smooth" });
  const href = `/search?location=${county}${category !== "Any" ? `&category=${category}` : ""}`;
  const btn = "w-8 h-8 rounded-full border border-[#dddddd] bg-white flex items-center justify-center hover:scale-105 transition";

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-10 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link to={href} className="flex items-center gap-2 text-xl font-semibold text-[#222222]">
          <CountyFlag county={county} />{title}
          <span className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
        </Link>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} className={btn} aria-label="Scroll left"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => scroll(1)} className={btn} aria-label="Scroll right"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      {!supports ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#717171]" /></div>
      ) : !supports.length ? (
        <p className="text-[#717171] py-8">No supports found right now.</p>
      ) : (
        <div ref={ref} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {supports.map((s, i) => (
            <div key={s.name} className="w-56 sm:w-60 shrink-0">
              <SupportCard index={i} support={s} saved={saved.isSaved(s)} onToggle={(x) => saved.toggle(x, county)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}