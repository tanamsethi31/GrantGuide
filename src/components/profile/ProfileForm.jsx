import React from "react";
import { COUNTIES } from "@/lib/counties";
import { WHO_OPTIONS, chipClass } from "@/components/search/WhoPicker";
import { EXTRA_GROUPS } from "@/components/profile/extraGroups";

export default function ProfileForm({ county, setCounty, who, setWho, onSave, justSaved }) {
  const toggle = (o) => setWho(who.includes(o) ? who.filter((w) => w !== o) : [...who, o]);
  return (
    <div className="rounded-3xl border border-[#dddddd] shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-6 sm:p-8 bg-white">
      <h2 className="text-xl font-semibold mb-5">About you</h2>
      <label htmlFor="county" className="block text-sm font-semibold mb-2">Your county</label>
      <select
        id="county"
        value={county}
        onChange={(e) => setCounty(e.target.value)}
        className="w-full rounded-xl border border-[#b0b0b0] px-4 py-3 text-base bg-white outline-none focus:border-[#222222]"
      >
        <option value="">Select a county</option>
        {COUNTIES.map((c) => <option key={c} value={c}>{`Co. ${c}`}</option>)}
      </select>
      <p className="text-sm font-semibold mt-6 mb-3">Which of these describe you?</p>
      <div className="flex flex-wrap gap-2">
        {WHO_OPTIONS.map((o) => (
          <button key={o} type="button" onClick={() => toggle(o)} aria-pressed={who.includes(o)} className={chipClass(who.includes(o))}>{o}</button>
        ))}
      </div>
      <p className="text-sm font-semibold mt-6 mb-1">Tell us more</p>
      <p className="text-sm text-[#717171] mb-4">The more you add, the better your matches.</p>
      {EXTRA_GROUPS.map((g) => (
        <div key={g.title} className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#717171] mb-2">{g.title}</p>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => (
              <button key={o} type="button" onClick={() => toggle(o)} aria-pressed={who.includes(o)} className={chipClass(who.includes(o))}>{o}</button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={onSave}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-6 py-3.5 transition"
      >
        {justSaved ? "Saved on this device" : "Save my details"}
      </button>
    </div>
  );
}
