import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import MatchRow from "@/components/profile/MatchRow";
import useSaved from "@/hooks/useSaved";

export default function Profile() {
  const navigate = useNavigate();
  const saved = useSaved();
  const [user, setUser] = useState(undefined);
  const [county, setCounty] = useState("");
  const [who, setWho] = useState([]);
  const [saving, setSaving] = useState(false);
  const [matches, setMatches] = useState(null);

  const find = async (c, w) => {
    setSaving(true);
    setMatches(null);
    const res = await base44.functions.invoke("matchSupports", { county: c, who: w });
    setMatches(res.data);
    setSaving(false);
  };

  useEffect(() => {
    (async () => {
      if (!(await base44.auth.isAuthenticated())) return setUser(null);
      const me = await base44.auth.me();
      setUser(me);
      setCounty(me.county || "");
      setWho(me.who || []);
      if (me.county || me.who?.length) find(me.county || "", me.who || []);
    })();
  }, []);

  const save = async () => {
    await base44.auth.updateMe({ county, who });
    find(county, who);
  };

  const onTab = (c) => navigate(c === "Any" ? "/search?q=support" : `/search?category=${c}`);

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader tab="" onTab={onTab} />
      <main className="max-w-7xl mx-auto px-5 sm:px-10 py-10 pb-20">
        {user === undefined ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#717171]" /></div>
        ) : user === null ? (
          <div className="py-16">
            <h1 className="text-3xl font-bold mb-3">Your profile</h1>
            <p className="text-[#717171] mb-4">Log in to get grants matched to you.</p>
            <button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="rounded-lg bg-[#FF385C] hover:bg-[#e31c5f] text-white font-semibold px-6 py-3 transition">
              Log in
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Hi Maureen, here's what you may be owed</h1>
            <div className="mb-10" />
            <div className="grid lg:grid-cols-[360px_1fr] gap-10 items-start">
              <ProfileForm county={county} setCounty={setCounty} who={who} setWho={setWho} onSave={save} saving={saving} />
              <div>
                {!matches && !saving && <p className="text-[#717171] py-10">Fill in your details and save to see your matches.</p>}
                {(matches || saving) && (
                  <>
                    <MatchRow title="You're likely eligible for" subtitle="Based on your details" items={matches?.likely || []} loading={!matches} saved={saved} county={county} />
                    {matches && <MatchRow title="Saved" subtitle={saved.items.length ? "Grants you've saved" : "Tap the heart on any grant to keep it here"} items={saved.items} saved={saved} county={county} />}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}