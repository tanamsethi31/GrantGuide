import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { pickImage } from "@/lib/supportImages";
import { categoryLabel } from "@/lib/categories";
import { headline } from "@/lib/grantDisplay";
import SaveButton from "@/components/supports/SaveButton";
import StatusBadge from "@/components/supports/StatusBadge";
import SupportDetailDialog from "@/components/supports/SupportDetailDialog";

export default function SupportCard({ support, saved, onToggle, index = 0 }) {
  const [open, setOpen] = useState(false);
  const image = pickImage(support, index);
  const top = headline(support);
  return (
    <article className="w-full h-full flex flex-col rounded-3xl border border-border bg-card overflow-hidden hover:shadow-lg transition">
      <div onClick={() => setOpen(true)} className="relative aspect-[16/10] bg-muted cursor-pointer">
        <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-sm font-bold text-foreground shadow-sm">
          {categoryLabel(support.category)}
        </span>
        <SaveButton saved={saved} onToggle={() => onToggle(support)} className="absolute top-3 right-3" />
      </div>
      <div className="flex flex-col flex-1 p-5">
        <StatusBadge grant={support} className="self-start mb-3" />
        <h3 className="text-lg font-bold leading-snug">
          <button onClick={() => setOpen(true)} className="text-left hover:underline">{support.name}</button>
        </h3>
        <p className="text-muted-foreground mt-1 line-clamp-2">For: {support.audience}</p>
        <p className="mt-3">
          <span className="text-xl font-bold">{top.value}</span>
          {top.sub && <span className="text-muted-foreground"> · {top.sub}</span>}
        </p>
        <div className="mt-auto pt-4">
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline">
            See details and how to apply <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <SupportDetailDialog
        open={open} onOpenChange={setOpen} support={support} image={image}
        saved={saved} onToggle={onToggle}
      />
    </article>
  );
}
