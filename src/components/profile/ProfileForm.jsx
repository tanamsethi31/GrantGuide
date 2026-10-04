import React from "react";
import { Loader2 } from "lucide-react";
import { COUNTIES } from "@/lib/counties";
import { WHO_OPTIONS } from "@/components/search/WhoPicker";
import { EXTRA_GROUPS } from "@/components/profile/extraGroups";

export default function ProfileForm({ county, setCounty, who, setWho, onSave, saving }) {
  const toggle = (o) => setWho(who.includes(o) ? who.filter((w) => w !== o) : [...who, o]);
  return (
    <div className="rounded-3xl border border-[#dddddd] shadow-[0_6px_16px_rgba(0,0,0,0.08)] p-6 sm:p-8 bg-white">
      <h2 className="text-xl font-semibold mb-5">About you</h2>
      <label className="block text-sm font-semibold mb-2">Your county</label>
      <select
        value={county}
        onChange={(e) => setCounty(e.target.value)}
        className="w-full rounded-xl border border-[#b0b0b0] px-4 py-3 text-[15px] bg-white outline-none focus:border-[#222222]"
      >
        <option value="">Select a county</option>
        {COUNTIES.map((c) => <option key={c} value={c}>{`Co. ${c}`}</option>)}
      </select>
      <p className="text-sm font-semibold mt-6 mb-3">Which of these describe you?</p>
      <div className="flex flex-wrap gap-2">
        {WHO_OPTIONS.map((o) => (
          <button
            key={o} type="button" onClick={() => toggle(o)}
            className={`rounded-full px-4 py-2 text-sm border transition ${
              who.includes(o) ? "bg-[#222222] text-white border-[#222222]" : "bg-white text-[#222222] border-[#dddddd] hover:border-[#222222]"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      <p className="text-sm font-semibold mt-6 mb-1">Tell us more</p>
      <p className="text-sm text-[#717171] mb-4">The more you add, the better your matches.</p>
      {EXTRA_GROUPS.map((g) => (
        <div key={g.title} className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#717171] mb-2">{g.title}</p>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => (
              <button
                key={o} type="button" onClick={() => toggle(o)}
                className={`rounded-full px-4 py-2 text-sm border transition ${
                  who.includes(o) ? "bg-[#222222] text-white border-[#222222]" : "bg-white text-[#222222] border-[#dddddd] hover:border-[#222222]"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={onSave} disabled={saving}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF385C] hover:bg-[#e31c5f] disabled:opacity-60 text-white font-semibold px-6 py-3.5 transition"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Save and find my grants
      </button>
    </div>
  );
}