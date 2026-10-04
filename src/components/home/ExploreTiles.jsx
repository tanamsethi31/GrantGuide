import React from "react";
import { Link } from "react-router-dom";
import { IMG } from "@/lib/supportImages";

const TILES = [
  { label: "Energy and home", image: IMG.energy, to: "/search?category=Energy and environment" },
  { label: "Housing", image: IMG.housing, to: "/search?category=Housing" },
  { label: "Older people", image: IMG.elderly, to: "/search?q=older people pension" },
  { label: "Money and family", image: IMG.family, to: "/search?category=Income and family" },
  { label: "Health", image: IMG.health, to: "/search?category=Health" },
  { label: "Disability and carers", image: IMG.community, to: "/search?category=Disability and caring" },
  { label: "Transport", image: IMG.travel, to: "/search?category=Transport" },
  { label: "Tax relief", image: IMG.money, to: "/search?category=Tax" },
];

export default function ExploreTiles() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-4">
      <h2 className="text-2xl font-bold mb-5">Explore by topic</h2>
      <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TILES.map((t) => (
          <Link key={t.label} to={t.to} className="w-40 sm:w-44 shrink-0 group">
            <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
              <img src={t.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-2 text-lg font-bold group-hover:underline">{t.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
