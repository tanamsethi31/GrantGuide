import React from "react";
import { Loader2 } from "lucide-react";
import SupportCard from "@/components/supports/SupportCard";

export default function MatchRow({ title, subtitle, items, loading, saved, county }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-[#717171] mt-1 mb-6">{subtitle}</p>
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-[#717171]" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {items.map((s, i) => (
            <div key={s.name}>
              <SupportCard index={i} support={s} county={county} saved={saved.isSaved(s)} onToggle={(x) => saved.toggle(x, county)} />
              {s.reason && <p className="mt-2 text-sm text-[#222222] bg-[#f7f7f7] rounded-xl px-3 py-2">{s.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}