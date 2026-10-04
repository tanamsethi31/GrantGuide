import React, { useMemo, useState } from "react";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import MatchRow from "@/components/profile/MatchRow";
import useSaved from "@/hooks/useSaved";
import { matchGrants } from "@/lib/searchGrants";
import { readStore, writeStore } from "@/lib/localStore";

const KEY = "grantguide.profile";

// No accounts yet: profile answers are kept in this browser.
export default function Profile() {
  const saved = useSaved();
  const initial = readStore(KEY, { county: "", who: [] });
  const [county, setCounty] = useState(initial.county || "");
  const [who, setWho] = useState(initial.who || []);
  const [justSaved, setJustSaved] = useState(false);

  const matches = useMemo(() => matchGrants({ location: county, who }), [county, who]);

  const save = () => {
    writeStore(KEY, { county, who });
    setJustSaved(true);
  };

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader />
      <main className="max-w-7xl mx-auto px-5 sm:px-10 py-10 pb-20">
        <h1 className="text-3xl font-bold">Your profile</h1>
        <p className="text-[#717171] mt-1 mb-10">Tell us about you to see supports that may be relevant.</p>
        <div className="grid lg:grid-cols-[360px_1fr] gap-10 items-start">
          <ProfileForm county={county} setCounty={setCounty} who={who} setWho={setWho} onSave={save} justSaved={justSaved} />
          <div>
            {!who.length ? (
              <p className="text-[#717171] py-10">Pick anything that describes you to see your matches.</p>
            ) : (
              <MatchRow
                title="Supports that may be relevant"
                subtitle="Based on your details. Each scheme has its own rules, so check before applying."
                items={matches}
                who={who}
                saved={saved}
              />
            )}
            {saved.items.length > 0 && (
              <MatchRow title="Saved" subtitle="Supports you've saved" items={saved.items} saved={saved} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
