import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMG } from "@/lib/supportImages";

const TILES = [
  { label: "Energy bills", image: IMG.energy, to: "/search?category=Energy" },
  { label: "Housing", image: IMG.housing, to: "/search?category=Housing" },
  { label: "Older people", image: IMG.elderly, to: "/search?category=Elderly" },
  { label: "Families", image: IMG.family, to: "/search?q=family and children support" },
  { label: "Health", image: IMG.health, to: "/search?q=medical card and health support" },
  { label: "Travel", image: IMG.travel, to: "/search?q=free travel pass" },
  { label: "Money", image: IMG.money, to: "/search?q=household benefits and money help" },
  { label: "Community", image: IMG.community, to: "/search?q=community support services" },
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
            <div className="aspect-square rounded-2xl overflow-hidden">
              <Image src={t.image} alt={t.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-2 text-sm text-[#222222]">{t.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}