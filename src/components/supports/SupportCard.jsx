import React, { useState } from "react";
import { Heart, Phone, ExternalLink } from "lucide-react";
import { Image } from "@/components/ui/image";
import { pickImage } from "@/lib/supportImages";
import SupportDetailDialog from "@/components/supports/SupportDetailDialog";

export default function SupportCard({ support, saved, onToggle, index = 0, county = "" }) {
  const [open, setOpen] = useState(false);
  const image = pickImage(support, index);
  return (
    <div className="w-full">
      <div onClick={() => setOpen(true)} className="relative aspect-square rounded-2xl overflow-hidden bg-[#f2f2f2] cursor-pointer">
        <Image src={image} alt={support.name} className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-xs font-semibold text-[#222222] shadow-sm">
          {support.category || "Support"}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(support); }}
          aria-label={saved ? "Remove from saved" : "Save"}
          className="absolute top-3 right-3 p-1 transition active:scale-90"
        >
          <Heart
            className={`w-6 h-6 drop-shadow ${saved ? "fill-[#FF385C] text-[#FF385C]" : "fill-black/50 text-white"}`}
            strokeWidth={2}
          />
        </button>
      </div>
      <button onClick={() => setOpen(true)} className="mt-3 text-left w-full">
        <p className="text-[15px] font-semibold text-[#222222] leading-snug hover:underline">{support.name}</p>
        <p className="text-sm text-[#717171] line-clamp-2 mt-0.5">{support.help}</p>
        <p className="text-sm font-medium text-[#222222] underline mt-1">View details</p>
      </button>
      <div className="flex items-center gap-4 mt-2 text-sm text-[#222222]">
        {support.phone && (
          <a href={`tel:${support.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-1.5 font-medium underline-offset-2 hover:underline">
            <Phone className="w-4 h-4" /> {support.phone}
          </a>
        )}
        {support.website && (
          <a href={support.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#717171] underline-offset-2 hover:underline">
            <ExternalLink className="w-4 h-4" /> Website
          </a>
        )}
      </div>
      <SupportDetailDialog
        open={open} onOpenChange={setOpen} support={support} image={image}
        saved={saved} onToggle={onToggle} county={county}
      />
    </div>
  );
}