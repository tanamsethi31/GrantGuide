import React, { useEffect, useState } from "react";
import { Phone, ExternalLink, Clock, FileText, Loader2, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { Criteria, Steps, Section } from "@/components/supports/DetailSection";

export default function SupportDetailDialog({ open, onOpenChange, support, image, saved, onToggle, county }) {
  const [details, setDetails] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open || details) return;
    base44.functions
      .invoke("supportDetails", { name: support.name, help: support.help, county: support.county || county })
      .then((r) => (r.data.details ? setDetails(r.data.details) : setFailed(true)))
      .catch(() => setFailed(true));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-0 gap-0">
        <div className="relative h-56 sm:h-64 bg-[#f2f2f2]">
          <Image src={image} alt={support.name} className="w-full h-full object-cover" />
          <span className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-xs font-semibold shadow-sm">
            {support.category || "Support"}
          </span>
        </div>
        <div className="px-6 sm:px-8 pt-6 pb-8">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-[#222222] leading-tight">{support.name}</DialogTitle>
            <button onClick={() => onToggle(support)} aria-label="Save" className="p-2 rounded-full hover:bg-[#f2f2f2] shrink-0">
              <Heart className={`w-6 h-6 ${saved ? "fill-[#FF385C] text-[#FF385C]" : "text-[#222222]"}`} />
            </button>
          </div>
          <DialogDescription className="text-[15px] text-[#717171] mt-2">{support.help}</DialogDescription>

          {!details && !failed && (
            <div className="flex flex-col items-center gap-3 py-16 text-[#717171]">
              <Loader2 className="w-7 h-7 animate-spin" />
              <p className="text-sm">Finding the latest details…</p>
            </div>
          )}
          {failed && <p className="py-10 text-[#717171]">Couldn't load details right now. Use the website link below.</p>}

          {details && (
            <>
              <div className="mt-6 rounded-2xl bg-[#f7f7f7] border border-[#ebebeb] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">How much you could get</p>
                <p className="text-3xl font-bold text-[#222222] mt-1">{details.amount}</p>
                {details.amount_note && <p className="text-sm text-[#717171] mt-1">{details.amount_note}</p>}
              </div>
              <Section title="Who can apply"><Criteria items={details.criteria || []} /></Section>
              <Section title="How it works">
                <Steps items={details.steps || []} />
                {details.timeline && (
                  <p className="flex items-center gap-2 text-sm text-[#717171] mt-5"><Clock className="w-4 h-4" /> {details.timeline}</p>
                )}
              </Section>
              {details.documents?.length > 0 && (
                <Section title="What to have ready">
                  <ul className="space-y-2">
                    {details.documents.map((d, i) => (
                      <li key={i} className="flex gap-3 text-[15px] text-[#222222]"><FileText className="w-5 h-5 text-[#717171] shrink-0" /> {d}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#ebebeb] mt-2">
            {support.website && (
              <a href={support.website} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF385C] hover:bg-[#e31c5f] text-white font-semibold px-6 py-3.5 transition">
                <ExternalLink className="w-4 h-4" /> Apply on official site
              </a>
            )}
            {support.phone && (
              <a href={`tel:${support.phone.replace(/[^+\d]/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#222222] text-[#222222] font-semibold px-6 py-3.5 hover:bg-[#f7f7f7] transition">
                <Phone className="w-4 h-4" /> {support.phone}
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}