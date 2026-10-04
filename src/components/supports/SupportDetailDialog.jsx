import React from "react";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Fact, Section } from "@/components/supports/DetailSection";
import { HeartIcon } from "@/components/supports/SupportCard";
import ApplicationHelper from "@/components/supports/ApplicationHelper";
import { categoryLabel } from "@/lib/categories";
import { formatEur, formatDate, typeLabel, meansLabel, isClosed } from "@/lib/grantDisplay";

export default function SupportDetailDialog({ open, onOpenChange, support: g, image, saved, onToggle }) {
  const confirmed = g.verification === "Official details checked";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-0 gap-0">
        <div className="relative h-56 sm:h-64 bg-[#f2f2f2]">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <span className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
            {categoryLabel(g.category)}
          </span>
        </div>
        <div className="px-6 sm:px-8 pt-6 pb-8">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-[#222222] leading-tight">{g.name}</DialogTitle>
            <button onClick={() => onToggle(g)} aria-label={saved ? "Remove from saved" : "Save"} aria-pressed={saved} className="p-2 rounded-full hover:bg-[#f2f2f2] shrink-0">
              <HeartIcon saved={saved} className="text-[#222222]" />
            </button>
          </div>
          <DialogDescription className="text-base text-[#717171] mt-2">{g.audience}</DialogDescription>

          {(isClosed(g) || !confirmed) && (
            <p className="mt-5 rounded-2xl bg-[#f7f7f7] border border-[#ebebeb] p-4 text-base text-[#222222]">
              {isClosed(g)
                ? `This round is closed${g.deadline ? ` (it closed on ${formatDate(g.deadline)})` : ""}. Check the official page for the next one.`
                : "Some details aren't confirmed yet. Check the official page before relying on them."}
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-[#f7f7f7] border border-[#ebebeb] p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#717171]">
              {g.amountEur != null ? "How much you could get" : "What you get"}
            </p>
            <p className="text-3xl font-bold text-[#222222] mt-1">
              {g.amountEur != null ? formatEur(g.amountEur) : typeLabel(g.benefitType)}
            </p>
            {g.amountBasis && <p className="text-sm text-[#717171] mt-1">{g.amountBasis}</p>}
          </div>

          {g.eligibility && (
            <Section title="Who can apply">
              <p className="text-base text-[#222222]">{g.eligibility}</p>
            </Section>
          )}

          <Section title="Key facts">
            <ul className="space-y-3">
              <Fact label="Run by">{g.administrator}</Fact>
              <Fact label="How often">{g.frequency}</Fact>
              <Fact label="Income checked?">{meansLabel(g.meansTest)}</Fact>
              <Fact label="Deadline">{g.deadline ? formatDate(g.deadline) : null}</Fact>
            </ul>
          </Section>

          <ApplicationHelper support={g} />

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#ebebeb] mt-2">
            {g.website && (
              <a href={g.website} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-6 py-3.5 transition">
                <ExternalLink className="w-4 h-4" /> Apply on official site
              </a>
            )}
            {g.sourceUrl && g.sourceUrl !== g.website && (
              <a href={g.sourceUrl} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#222222] text-[#222222] font-semibold px-6 py-3.5 hover:bg-[#f7f7f7] transition">
                <ExternalLink className="w-4 h-4" /> Official information
              </a>
            )}
          </div>
          {g.lastChecked && (
            <p className="text-sm text-[#717171] mt-4">Checked against the official source on {formatDate(g.lastChecked)}.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
