import React from "react";
import { Check } from "lucide-react";
import { COUNTIES } from "@/lib/counties";
import { WHO_OPTIONS, TagButton } from "@/components/search/WhoPicker";
import { EXTRA_GROUPS } from "@/components/profile/extraGroups";

export default function ProfileForm({ county, setCounty, who, setWho, onSave, justSaved }) {
  const toggle = (o) => setWho(who.includes(o) ? who.filter((w) => w !== o) : [...who, o]);
  return (
    <div className="rounded-3xl border border-border shadow-[0_10px_30px_-12px_rgba(15,118,110,0.25)] p-6 sm:p-8 bg-card">
      <h2 className="text-2xl font-bold mb-5">About you</h2>
      <label htmlFor="county" className="block font-bold mb-2">Your county</label>
      <select
        id="county"
        value={county}
        onChange={(e) => setCounty(e.target.value)}
        className="w-full rounded-xl border border-input px-4 py-3 text-lg bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
      >
        <option value="">Select a county</option>
        {COUNTIES.map((c) => <option key={c} value={c}>{`Co. ${c}`}</option>)}
      </select>
      <p className="font-bold mt-8 mb-3">Which of these describe you?</p>
      <div className="flex flex-wrap gap-2">
        {WHO_OPTIONS.map((o) => (
          <TagButton key={o} selected={who.includes(o)} onClick={() => toggle(o)}>{o}</TagButton>
        ))}
      </div>
      <p className="font-bold mt-8">Tell us more</p>
      <p className="text-muted-foreground mb-4">The more you add, the better your matches.</p>
      {EXTRA_GROUPS.map((g) => (
        <div key={g.title} className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-2">{g.title}</p>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => (
              <TagButton key={o} selected={who.includes(o)} onClick={() => toggle(o)}>{o}</TagButton>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={onSave}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-lg font-bold px-6 py-4 transition"
      >
        {justSaved && <Check className="w-5 h-5" aria-hidden="true" />}
        {justSaved ? "Saved on this device" : "Save my details"}
      </button>
    </div>
  );
}
