import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import ChatSearch from "@/components/search/ChatSearch";
import ResultsGrid from "@/components/supports/ResultsGrid";
import useSaved from "@/hooks/useSaved";
import { searchGrants } from "@/lib/searchGrants";
import { readSearchParams, toSearchParams } from "@/lib/searchParams";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const state = readSearchParams(params);
  const [draft, setDraft] = useState(state.query);
  const saved = useSaved();

  // Follow the URL when it changes from outside the box (a tile, a county link, back button).
  useEffect(() => setDraft(state.query), [state.query]);

  const update = (patch) => setParams(toSearchParams({ ...state, ...patch }));
  const supports = useMemo(() => searchGrants(state), [params]);

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader>
        <ChatSearch
          query={draft} setQuery={setDraft}
          onSearch={(o = {}) => update({ query: (o.q ?? draft).trim() })}
          category={state.category} setCategory={(category) => update({ category })}
          location={state.location} setLocation={(location) => update({ location })}
          who={state.who} setWho={(who) => update({ who })}
        />
      </AirbnbHeader>
      <main className="max-w-7xl mx-auto px-5 sm:px-10 py-8 pb-20">
        {supports.length > 0 && (
          <h1 className="text-xl font-semibold mb-6" aria-live="polite">
            {supports.length} supports{state.location ? ` in Co. ${state.location}` : " across Ireland"}
          </h1>
        )}
        <ResultsGrid supports={supports} saved={saved} />
      </main>
    </div>
  );
}
