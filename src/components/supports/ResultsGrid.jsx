import React from "react";
import SupportCard from "@/components/supports/SupportCard";

export default function ResultsGrid({ supports, saved, emptyText }) {
  if (!supports.length) {
    return <p className="text-center text-[#717171] py-24">{emptyText || "No supports matched. Try changing your search."}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {supports.map((s, i) => (
        <SupportCard key={s.id} index={i} support={s} saved={saved.isSaved(s)} onToggle={saved.toggle} />
      ))}
    </div>
  );
}
