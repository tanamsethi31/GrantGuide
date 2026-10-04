import React from "react";
import { Heart } from "lucide-react";

export default function SaveButton({ saved, onToggle, className = "" }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      aria-label={saved ? "Remove from saved" : "Save"}
      aria-pressed={saved}
      className={`w-11 h-11 rounded-full bg-white/95 shadow flex items-center justify-center transition active:scale-90 ${className}`}
    >
      <Heart className={`w-6 h-6 ${saved ? "fill-primary text-primary" : "text-foreground"}`} strokeWidth={2} />
    </button>
  );
}
