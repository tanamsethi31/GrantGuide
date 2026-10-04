import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SupportCard from "@/components/supports/SupportCard";

export default function CardRow({ title, href, supports, saved }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 600, behavior: "smooth" });
  const btn = "w-8 h-8 rounded-full border border-[#dddddd] bg-white flex items-center justify-center hover:scale-105 transition";

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-10 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link to={href} className="flex items-center gap-2 text-xl font-semibold text-[#222222]">
          {title}
          <span className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
        </Link>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} className={btn} aria-label="Scroll left"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => scroll(1)} className={btn} aria-label="Scroll right"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      {!supports.length ? (
        <p className="text-[#717171] py-8">No supports found right now.</p>
      ) : (
        <div ref={ref} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {supports.map((s, i) => (
            <div key={s.id} className="w-56 sm:w-60 shrink-0">
              <SupportCard index={i} support={s} saved={saved.isSaved(s)} onToggle={saved.toggle} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
