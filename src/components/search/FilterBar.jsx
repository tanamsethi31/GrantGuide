import React from "react";
import { MapPin } from "lucide-react";
import { COUNTIES } from "@/lib/counties";
import { CATEGORIES } from "@/lib/categories";
import WhoPicker from "@/components/search/WhoPicker";

const pill =
  "flex items-center gap-2 rounded-full border border-input bg-white px-4 h-12 text-foreground hover:border-primary transition";

/** The filters that sit under the question box: where, about you, and topic. */
export default function FilterBar({ category, setCategory, location, setLocation, who, setWho }) {
  return (
    <div className="mt-5 space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        <label className={`${pill} cursor-pointer`}>
          <MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          <span className="font-bold">Where:</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="County"
            className="bg-transparent outline-none cursor-pointer"
          >
            <option value="">All of Ireland</option>
            {COUNTIES.map((c) => (
              <option key={c} value={c}>{`Co. ${c}`}</option>
            ))}
          </select>
        </label>
        <WhoPicker who={who} setWho={setWho} className={pill} />
      </div>
      <div
        role="group"
        aria-label="Topic"
        className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map(({ value, label, icon: Icon }) => {
          const active = category === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              aria-pressed={active}
              className={`flex items-center gap-2 shrink-0 rounded-full px-4 h-11 font-bold border transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary text-secondary-foreground border-transparent hover:border-primary"
              }`}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
