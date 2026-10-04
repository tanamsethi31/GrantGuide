import React, { useMemo, useState } from "react";
import { Check } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import ProfileForm from "@/components/profile/ProfileForm";
import SupportCard from "@/components/supports/SupportCard";
import useSaved from "@/hooks/useSaved";
import { matchGrants } from "@/lib/searchGrants";
import { readStore, writeStore } from "@/lib/localStore";

const KEY = "grantguide.profile";

export default function Profile() {
  const saved = useSaved();
  const initial = readStore(KEY, { county: "", who: [] });
  const [county, setCounty] = useState(initial.county || "");
  const [who, setWho] = useState(initial.who || []);
  const [savedAt, setSavedAt] = useState(null);

  const matches = useMemo(() => matchGrants({ location: county, who }), [county, who]);

  const save = () => {
    writeStore(KEY, { county, who });
    setSavedAt(Date.now());
  };

  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-bold">Your profile</h1>
        <p className="text-lg text-muted-foreground mt-2 mb-10">
          Tell us a little about yourself and we'll show the grants you're most likely to qualify for.
        </p>
        <div className="grid lg:grid-cols-[400px_1fr] gap-10 items-start">
          <ProfileForm county={county} setCounty={setCounty} who={who} setWho={setWho} onSave={save} justSaved={Boolean(savedAt)} />
          <section>
            <h2 className="text-2xl font-bold">Schemes that may be relevant</h2>
            {!who.length ? (
              <p className="text-lg text-muted-foreground py-8">Pick anything that describes you and your matches will appear here.</p>
            ) : !matches.length ? (
              <p className="text-lg text-muted-foreground py-8">No matches yet. Try adding a few more details.</p>
            ) : (
              <>
                <p className="text-muted-foreground mt-1 mb-6">{matches.length} found. This is a starting point, not an eligibility check: each scheme has its own rules.</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {matches.map((g, i) => (
                    <div key={g.id} className="flex flex-col gap-2">
                      <SupportCard index={i} support={g} saved={saved.isSaved(g)} onToggle={saved.toggle} />
                      <p className="flex gap-2 rounded-2xl bg-secondary text-secondary-foreground px-4 py-2">
                        <Check className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>Related to: {g.who.filter((w) => who.includes(w)).join(", ")}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
