import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";
import AskBox from "@/components/search/AskBox";
import FilterBar from "@/components/search/FilterBar";
import ExploreTiles from "@/components/home/ExploreTiles";
import CardRow from "@/components/home/CardRow";
import CountyLinks from "@/components/home/CountyLinks";
import useSaved from "@/hooks/useSaved";
import { searchGrants } from "@/lib/searchGrants";
import { toSearchParams } from "@/lib/searchParams";
import { categoryLabel } from "@/lib/categories";

export default function Home() {
  const navigate = useNavigate();
  const saved = useSaved();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Any");
  const [location, setLocation] = useState("");
  const [who, setWho] = useState([]);

  const filters = { category, location, who };
  const search = (o = {}) => navigate(`/search?${toSearchParams({ ...filters, query: o.q ?? query })}`);
  const featured = useMemo(() => searchGrants(filters).slice(0, 10), [category, location, who]);

  return (
    <PageShell>
      <section className="bg-gradient-to-b from-secondary to-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Find the grants you're owed</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Ask in your own words, or just speak. We'll show the Irish grants and supports that fit you.
          </p>
          <div className="mt-8 text-left">
            <AskBox
              query={query}
              setQuery={setQuery}
              onSearch={search}
              placeholder="For example: I'm 70, live alone and my heating bills are too high"
            />
          </div>
          <FilterBar
            category={category} setCategory={setCategory}
            location={location} setLocation={setLocation}
            who={who} setWho={setWho}
          />
        </div>
      </section>
      <CardRow
        title={category === "Any" ? "Grants to explore" : `${categoryLabel(category)} grants`}
        href={`/search?${toSearchParams(filters)}`}
        supports={featured}
        saved={saved}
      />
      <ExploreTiles />
      <CountyLinks />
    </PageShell>
  );
}
