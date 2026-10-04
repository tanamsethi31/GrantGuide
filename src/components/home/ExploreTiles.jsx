import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IMG } from "@/lib/supportImages";

const TILES = [
  { label: "Energy bills", image: IMG.energy, to: "/search?category=Energy and environment" },
  { label: "Housing", image: IMG.housing, to: "/search?category=Housing" },
  { label: "Older people", image: IMG.elderly, to: "/search?q=older people pension" },
  { label: "Families", image: IMG.family, to: "/search?category=Income and family" },
  { label: "Health", image: IMG.health, to: "/search?category=Health" },
  { label: "Travel", image: IMG.travel, to: "/search?category=Transport" },
  { label: "Money", image: IMG.money, to: "/search?category=Tax" },
  { label: "Carers", image: IMG.community, to: "/search?category=Disability and caring" },
];

export default function ExploreTiles() {
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-10 pt-10 pb-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-[#222222] mb-5">
        Explore support nearby
        <span className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center"><ArrowRight className="w-4 h-4" /></span>
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TILES.map((t) => (
          <Link key={t.label} to={t.to} className="w-36 sm:w-40 shrink-0 group">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#f2f2f2]">
              <img src={t.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-2 text-sm text-[#222222]">{t.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
