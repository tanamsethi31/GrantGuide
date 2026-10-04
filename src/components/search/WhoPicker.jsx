import React from "react";
import { UserRound } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const WHO_OPTIONS = [
  "Renting", "Own my home", "Over 66", "Medical card",
  "On social welfare", "Living alone", "Have children", "Low income",
];

export const chipClass = (selected) =>
  `rounded-full px-4 py-2 text-sm border transition ${
    selected ? "bg-[#222222] text-white border-[#222222]" : "bg-white text-[#222222] border-[#dddddd] hover:border-[#222222]"
  }`;

export default function WhoPicker({ who, setWho, className }) {
  const toggle = (o) => setWho(who.includes(o) ? who.filter((w) => w !== o) : [...who, o]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={className}>
          <UserRound className="w-4 h-4 text-[#717171]" aria-hidden="true" />
          <span className="font-semibold">Who</span>
          <span className="text-[#717171] truncate max-w-[12rem]">
            {who.length ? who.join(", ") : "Add details"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-80 max-w-[calc(100vw-2rem)] rounded-3xl p-4 border-[#dddddd]">
        <div className="flex flex-wrap gap-2">
          {WHO_OPTIONS.map((o) => (
            <button key={o} type="button" onClick={() => toggle(o)} aria-pressed={who.includes(o)} className={chipClass(who.includes(o))}>
              {o}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
