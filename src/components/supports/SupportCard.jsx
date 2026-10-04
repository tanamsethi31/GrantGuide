import React, { useState } from "react";
import { Heart } from "lucide-react";
import { pickImage } from "@/lib/supportImages";
import { categoryLabel } from "@/lib/categories";
import { headline, statusBadge } from "@/lib/grantDisplay";
import SupportDetailDialog from "@/components/supports/SupportDetailDialog";

export function HeartIcon({ saved, className = "" }) {
  return (
    <Heart
      className={`w-6 h-6 ${saved ? "fill-[#15803D] text-[#15803D]" : className}`}
      strokeWidth={2}
    />
  );
}

export default function SupportCard({ support, saved, onToggle, index = 0 }) {
  const [open, setOpen] = useState(false);
  const image = pickImage(support, index);
  const price = headline(support);
  const badge = statusBadge(support);
  const flag = badge.tone === "closed" || badge.tone === "warn" ? badge.label : null;
  return (
    <div className="w-full">
      <div onClick={() => setOpen(true)} className="relative aspect-square rounded-2xl overflow-hidden bg-[#f2f2f2] cursor-pointer">
        <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-sm font-semibold text-[#222222] shadow-sm">
          {categoryLabel(support.category)}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(support); }}
          aria-label={saved ? "Remove from saved" : "Save"}
          aria-pressed={saved}
          className="absolute top-3 right-3 p-1 transition active:scale-90"
        >
          <HeartIcon saved={saved} className="drop-shadow fill-black/50 text-white" />
        </button>
      </div>
      <button onClick={() => setOpen(true)} className="mt-3 text-left w-full">
        <p className="text-base font-semibold text-[#222222] leading-snug hover:underline">{support.name}</p>
        <p className="text-sm text-[#717171] line-clamp-2 mt-0.5">{support.audience}</p>
        <p className="text-base text-[#222222] mt-1">
          <span className="font-semibold">{price.value}</span>
          {support.amountEur != null && price.sub && <span className="text-[#717171]"> {price.sub.toLowerCase()}</span>}
        </p>
        {flag && <p className="text-sm text-[#717171] mt-0.5">{flag}</p>}
        <p className="text-sm font-medium text-[#222222] underline mt-1">View details</p>
      </button>
      <SupportDetailDialog
        open={open} onOpenChange={setOpen} support={support} image={image}
        saved={saved} onToggle={onToggle}
      />
    </div>
  );
}
