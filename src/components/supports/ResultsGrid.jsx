import React from "react";
import { Loader2 } from "lucide-react";
import SupportCard from "@/components/supports/SupportCard";

export default function ResultsGrid({ loading, supports, saved, county, emptyText }) {
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#717171]" />
      </div>
    );
  }
  if (!supports) {
    return <p className="text-center text-[#717171] py-24">Search above to find supports near you.</p>;
  }
  if (!supports.length) {
    return <p className="text-center text-[#717171] py-24">{emptyText || "No supports matched. Try changing your search."}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {supports.map((s, i) => (
        <SupportCard
          key={s.name}
          index={i}
          support={s}
          saved={saved.isSaved(s)}
          onToggle={(x) => saved.toggle(x, county)}
        />
      ))}
    </div>
  );
}