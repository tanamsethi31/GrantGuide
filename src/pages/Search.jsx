import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import AskBox from "@/components/search/AskBox";
import FilterBar from "@/components/search/FilterBar";
import ResultsGrid from "@/components/supports/ResultsGrid";
import useSaved from "@/hooks/useSaved";
import { searchGrants } from "@/lib/searchGrants";
import { readSearchParams, toSearchParams } from "@/lib/searchParams";
import { categoryLabel } from "@/lib/categories";

function heading(count, { query, category, location }) {
  const what = category === "Any" ? "grants" : `${categoryLabel(category).toLowerCase()} grants`;
  const where = location ? ` in Co. ${location}` : " across Ireland";
  const about = query ? ` for “${query}”` : "";
  return `${count} ${count === 1 ? what.replace(/s$/, "") : what}${about}${where}`;
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const state = readSearchParams(params);
  const [draft, setDraft] = useState(state.query);
  const saved = useSaved();

  // Follow the URL when it changes from outside the box (a tile, a county link, back button).
  useEffect(() => setDraft(state.query), [state.query]);

  const update = (patch) => setParams(toSearchParams({ ...state, ...patch }));
  const results = useMemo(() => searchGrants(state), [params]);

  return (
    <PageShell>
      <section className="bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-8 pb-8">
          <AskBox query={draft} setQuery={setDraft} onSearch={(o = {}) => update({ query: (o.q ?? draft).trim() })} />
          <FilterBar
            category={state.category} setCategory={(category) => update({ category })}
            location={state.location} setLocation={(location) => update({ location })}
            who={state.who} setWho={(who) => update({ who })}
          />
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 pb-20">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8" aria-live="polite">{heading(results.length, state)}</h1>
        <ResultsGrid supports={results} saved={saved} />
      </div>
    </PageShell>
  );
}
