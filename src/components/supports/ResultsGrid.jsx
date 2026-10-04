import React from "react";
import SupportCard from "@/components/supports/SupportCard";

export default function ResultsGrid({ supports, saved, emptyText }) {
  if (!supports.length) {
    return (
      <p className="text-center text-lg text-muted-foreground py-20">
        {emptyText || "No grants matched. Try other words, or pick a different topic."}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {supports.map((s, i) => (
        <SupportCard key={s.id} index={i} support={s} saved={saved.isSaved(s)} onToggle={saved.toggle} />
      ))}
    </div>
  );
}
