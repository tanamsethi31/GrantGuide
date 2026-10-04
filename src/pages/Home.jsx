import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import PillSearch from "@/components/search/PillSearch";
import ExploreTiles from "@/components/home/ExploreTiles";
import CardRow from "@/components/home/CardRow";
import CountyLinks from "@/components/home/CountyLinks";
import useSaved from "@/hooks/useSaved";

export default function Home() {
  const navigate = useNavigate();
  const saved = useSaved();
  const [tab, setTab] = useState("Any");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [who, setWho] = useState([]);

  const search = (o = {}) => {
    const p = new URLSearchParams();
    const q = o.q ?? query;
    if (q) p.set("q", q);
    if (location) p.set("location", location);
    if (tab !== "Any") p.set("category", tab);
    if (who.length) p.set("who", who.join(","));
    navigate(`/search?${p.toString() || "q=support"}`);
  };

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader tab={tab} onTab={setTab}>
        <PillSearch
          location={location} setLocation={setLocation}
          query={query} setQuery={setQuery}
          who={who} setWho={setWho}
          onSearch={search}
        />
      </AirbnbHeader>
      <ExploreTiles />
      <CardRow title="Supports in Co. Cork" county="Cork" category={tab} saved={saved} />
      <CardRow title="Popular supports in Co. Dublin" county="Dublin" category={tab} saved={saved} />
      <CountyLinks />
    </div>
  );
}