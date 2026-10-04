import React from "react";
import { ChevronDown, UserRound } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const WHO_OPTIONS = [
  "Renting", "Own my home", "Over 66", "Medical card",
  "On social welfare", "Living alone", "Have children", "Low income",
];

export function TagButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full px-4 py-2 border transition ${
        selected ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-input hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}

export default function WhoPicker({ who, setWho, className }) {
  const toggle = (o) => setWho(who.includes(o) ? who.filter((w) => w !== o) : [...who, o]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={className}>
          <UserRound className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          <span className="truncate max-w-[14rem]">
            <span className="font-bold">About you:</span>{" "}
            {who.length ? who.join(", ") : "Add details"}
          </span>
          <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-[22rem] max-w-[calc(100vw-2rem)] rounded-3xl p-5">
        <p className="font-bold mb-3">Which of these describe you?</p>
        <div className="flex flex-wrap gap-2">
          {WHO_OPTIONS.map((o) => (
            <TagButton key={o} selected={who.includes(o)} onClick={() => toggle(o)}>{o}</TagButton>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
