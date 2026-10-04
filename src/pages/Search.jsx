import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import PillSearch from "@/components/search/PillSearch";
import ResultsGrid from "@/components/supports/ResultsGrid";
import useSaved from "@/hooks/useSaved";

export default function Search() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [category, setCategory] = useState(params.get("category") || "Any");
  const [who, setWho] = useState((params.get("who") || "").split(",").filter(Boolean));
  const [loading, setLoading] = useState(false);
  const [supports, setSupports] = useState(null);
  const saved = useSaved();
  const started = useRef(false);

  const run = async (o = {}) => {
    const cat = o.category ?? category;
    setLoading(true);
    setSupports(null);
    const res = await base44.functions.invoke("findSupports", {
      query: o.q ?? query,
      location,
      category: cat === "Any" ? "" : cat,
      details: who.join(". "),
    });
    setSupports(res.data.supports || []);
    setLoading(false);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (query || category !== "Any" || location || who.length) run();
  }, []);

  const onTab = (c) => {
    setCategory(c);
    run({ category: c });
  };

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader tab={category} onTab={onTab}>
        <PillSearch
          location={location} setLocation={setLocation}
          query={query} setQuery={setQuery}
          who={who} setWho={setWho}
          onSearch={run}
        />
      </AirbnbHeader>
      <main className="max-w-7xl mx-auto px-5 sm:px-10 py-8 pb-20">
        {supports && supports.length > 0 && (
          <h1 className="text-xl font-semibold mb-6">
            {supports.length} supports{location ? ` in Co. ${location}` : " across Ireland"}
          </h1>
        )}
        <ResultsGrid loading={loading} supports={supports} saved={saved} county={location} />
      </main>
    </div>
  );
}