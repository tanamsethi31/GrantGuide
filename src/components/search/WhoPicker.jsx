import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const WHO_OPTIONS = [
  "Renting", "Own my home", "Over 66", "Medical card",
  "On social welfare", "Living alone", "Have children", "Low income",
];

export default function WhoPicker({ who, setWho, className, labelClass }) {
  const toggle = (o) => setWho(who.includes(o) ? who.filter((w) => w !== o) : [...who, o]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={className}>
          <span className={labelClass}>Who</span>
          <span className="block text-sm text-[#717171] truncate">
            {who.length ? who.join(", ") : "Add details"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 rounded-3xl p-4 border-[#dddddd]">
        <div className="flex flex-wrap gap-2">
          {WHO_OPTIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              className={`rounded-full px-4 py-2 text-sm border transition ${
                who.includes(o) ? "bg-[#222222] text-white border-[#222222]" : "bg-white text-[#222222] border-[#dddddd] hover:border-[#222222]"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}