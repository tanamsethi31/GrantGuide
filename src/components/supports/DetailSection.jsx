import React from "react";
import { Check } from "lucide-react";

export function Criteria({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((c, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
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
          <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
            {i + 1}
          </span>
          <p className="pt-1">{s}</p>
        </li>
      ))}
    </ol>
  );
}

export function Section({ title, children }) {
  return (
    <section className="pt-6 mt-6 border-t border-border">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      {children}
    </section>
  );
}
