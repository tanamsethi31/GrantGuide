import React from "react";
import { statusBadge } from "@/lib/grantDisplay";

const TONES = {
  open: "bg-secondary text-secondary-foreground",
  info: "bg-muted text-foreground",
  closed: "bg-foreground/80 text-white",
  warn: "bg-accent text-accent-foreground",
};

export default function StatusBadge({ grant, className = "" }) {
  const { label, tone } = statusBadge(grant);
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${TONES[tone]} ${className}`}>
      {label}
    </span>
  );
}
