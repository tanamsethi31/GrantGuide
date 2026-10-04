import React from "react";

export function Fact({ label, children }) {
  if (!children) return null;
  return (
    <li className="flex flex-col sm:flex-row sm:gap-4 text-base text-[#222222]">
      <span className="font-semibold sm:w-40 shrink-0">{label}</span>
      <span className="text-[#717171]">{children}</span>
    </li>
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
