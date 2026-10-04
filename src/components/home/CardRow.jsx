import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SupportCard from "@/components/supports/SupportCard";

export default function CardRow({ title, href, supports, saved }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 600, behavior: "smooth" });
  const btn = "w-11 h-11 rounded-full border border-input bg-white flex items-center justify-center hover:border-primary transition";

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <Link to={href} className="flex items-center gap-3 text-2xl font-bold hover:underline">
          {title}
          <span className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center"><ArrowRight className="w-5 h-5" /></span>
        </Link>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll(-1)} className={btn} aria-label="Scroll left"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => scroll(1)} className={btn} aria-label="Scroll right"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      {!supports.length ? (
        <p className="text-muted-foreground py-8">No grants in this topic yet.</p>
      ) : (
        <div ref={ref} className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {supports.map((s, i) => (
            <div key={s.id} className="w-72 shrink-0">
              <SupportCard index={i} support={s} saved={saved.isSaved(s)} onToggle={saved.toggle} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
