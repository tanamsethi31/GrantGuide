import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import ChatSearch from "@/components/search/ChatSearch";
import ExploreTiles from "@/components/home/ExploreTiles";
import CardRow from "@/components/home/CardRow";
import CountyLinks from "@/components/home/CountyLinks";
import useSaved from "@/hooks/useSaved";
import { searchGrants } from "@/lib/searchGrants";
import { toSearchParams } from "@/lib/searchParams";
import { categoryLabel } from "@/lib/categories";
import { isClosed } from "@/lib/grantDisplay";

// With no topic picked, the home page shows these two rows.
const DEFAULT_ROWS = [
  { title: "Help with money and family", category: "Income and family" },
  { title: "Help with energy bills", category: "Energy and environment" },
];

export default function Home() {
  const navigate = useNavigate();
  const saved = useSaved();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Any");
  const [location, setLocation] = useState("");
  const [who, setWho] = useState([]);

  const search = (o = {}) => navigate(`/search?${toSearchParams({ query: o.q ?? query, category, location, who })}`);

  const rows = useMemo(() => {
    const defs = category === "Any" ? DEFAULT_ROWS : [{ title: categoryLabel(category), category }];
    return defs.map((r) => ({
      ...r,
      href: `/search?${toSearchParams({ category: r.category, location, who })}`,
      supports: searchGrants({ category: r.category, location, who }).filter((g) => !isClosed(g)).slice(0, 12),
    }));
  }, [category, location, who]);

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader>
        <ChatSearch
          query={query} setQuery={setQuery} onSearch={search}
          category={category} setCategory={setCategory}
          location={location} setLocation={setLocation}
          who={who} setWho={setWho}
        />
      </AirbnbHeader>
      <ExploreTiles />
      {rows.map((r) => (
        <CardRow key={r.title} title={r.title} href={r.href} supports={r.supports} saved={saved} />
      ))}
      <CountyLinks />
    </div>
  );
}
