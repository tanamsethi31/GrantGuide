import React from "react";
import { Check } from "lucide-react";

export function Criteria({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((c, i) => (
        <li key={i} className="flex gap-3 text-[15px] text-[#222222]">
          <span className="mt-0.5 w-5 h-5 rounded-full bg-[#222222] text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" strokeWidth={3} />
          </span>
          {c}
        </li>
      ))}
    </ul>
  );
}

export function Steps({ items }) {
  return (
    <ol className="space-y-4">
      {items.map((s, i) => (
        <li key={i} className="flex gap-4">
          <span className="w-8 h-8 rounded-full bg-[#FF385C] text-white text-sm font-semibold flex items-center justify-center shrink-0">
            {i + 1}
          </span>
          <p className="text-[15px] text-[#222222] pt-1">{s}</p>
        </li>
      ))}
    </ol>
  );
}

export function Section({ title, children }) {
  return (
    <section className="py-6 border-t border-[#ebebeb]">
      <h3 className="text-lg font-semibold text-[#222222] mb-4">{title}</h3>
      {children}
    </section>
  );
}