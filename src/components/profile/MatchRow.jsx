import React from "react";
import SupportCard from "@/components/supports/SupportCard";

export default function MatchRow({ title, subtitle, items, who = [], saved }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-[#717171] mt-1 mb-6">{subtitle}</p>
      {!items.length ? (
        <p className="text-[#717171] py-6">No matches yet. Try adding a few more details.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {items.map((s, i) => {
            const related = s.who.filter((w) => who.includes(w));
            return (
              <div key={s.id}>
                <SupportCard index={i} support={s} saved={saved.isSaved(s)} onToggle={saved.toggle} />
                {related.length > 0 && (
                  <p className="mt-2 text-sm text-[#222222] bg-[#f7f7f7] rounded-xl px-3 py-2">Related to: {related.join(", ")}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
