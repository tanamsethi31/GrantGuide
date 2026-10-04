import React from "react";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import ResultsGrid from "@/components/supports/ResultsGrid";
import useSaved from "@/hooks/useSaved";

export default function Saved() {
  const saved = useSaved();
  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader />
      <main className="max-w-7xl mx-auto px-5 sm:px-10 py-10 pb-20">
        <h1 className="text-3xl font-bold mb-8">Saved supports</h1>
        <ResultsGrid
          supports={saved.items}
          saved={saved}
          emptyText="Nothing saved yet. Tap the heart on any support to keep it here."
        />
      </main>
    </div>
  );
}
