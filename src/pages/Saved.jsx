import React from "react";
import PageShell from "@/components/layout/PageShell";
import ResultsGrid from "@/components/supports/ResultsGrid";
import useSaved from "@/hooks/useSaved";

export default function Saved() {
  const saved = useSaved();
  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold">Saved grants</h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">Saved on this device. Tap the heart again to remove one.</p>
        <ResultsGrid
          supports={saved.items}
          saved={saved}
          emptyText="Nothing saved yet. Tap the heart on any grant to keep it here."
        />
      </div>
    </PageShell>
  );
}
