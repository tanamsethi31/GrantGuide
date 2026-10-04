import React from "react";
import { ExternalLink, BadgeCheck, TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Section } from "@/components/supports/DetailSection";
import SaveButton from "@/components/supports/SaveButton";
import StatusBadge from "@/components/supports/StatusBadge";
import { categoryLabel } from "@/lib/categories";
import { formatEur, formatDate, typeLabel, meansLabel, isClosed } from "@/lib/grantDisplay";

function Fact({ label, children }) {
  if (!children) return null;
  return (
    <div className="py-3 border-b border-border last:border-0 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="font-bold">{label}</dt>
      <dd className="text-muted-foreground mt-0.5 sm:mt-0">{children}</dd>
    </div>
  );
}

export default function SupportDetailDialog({ open, onOpenChange, support: g, image, saved, onToggle }) {
  const confirmed = g.verification === "Official details checked";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-0 gap-0">
        <div className="relative h-44 sm:h-52 bg-muted">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <span className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-bold shadow-sm">
            {categoryLabel(g.category)}
          </span>
        </div>
        <div className="px-6 sm:px-8 pt-6 pb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge grant={g} className="mb-3" />
              <DialogTitle className="text-2xl sm:text-3xl font-bold leading-tight">{g.name}</DialogTitle>
            </div>
            <SaveButton saved={saved} onToggle={() => onToggle(g)} className="shrink-0 border border-border" />
          </div>
          <DialogDescription className="text-lg text-muted-foreground mt-2">For: {g.audience}</DialogDescription>

          {isClosed(g) && (
            <p className="mt-5 rounded-2xl bg-muted p-4">
              <span className="font-bold">This round is closed{g.deadline ? ` (it closed on ${formatDate(g.deadline)})` : ""}.</span>{" "}
              Check the official page for the next one.
            </p>
          )}
          {!confirmed && (
            <p className="mt-5 flex gap-3 rounded-2xl bg-accent text-accent-foreground p-4">
              <TriangleAlert className="w-5 h-5 shrink-0 mt-1" aria-hidden="true" />
              Some details of this scheme aren't confirmed yet. Check the official page before relying on them.
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-secondary p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-secondary-foreground">
              {g.amountEur != null ? "Amount" : "What you get"}
            </p>
            <p className="text-3xl font-bold mt-1">
              {g.amountEur != null ? formatEur(g.amountEur) : typeLabel(g.benefitType)}
            </p>
            {g.amountBasis && <p className="mt-2">{g.amountBasis}</p>}
          </div>

          {g.eligibility && (
            <Section title="Who can apply">
              <p>{g.eligibility}</p>
            </Section>
          )}

          <Section title="Key facts">
            <dl>
              <Fact label="Run by">{g.administrator}</Fact>
              <Fact label="Type of help">{typeLabel(g.benefitType)}</Fact>
              <Fact label="How often">{g.frequency}</Fact>
              <Fact label="Income checked?">{meansLabel(g.meansTest)}</Fact>
              <Fact label="Where">{g.area}</Fact>
              <Fact label="Deadline">{g.deadline ? formatDate(g.deadline) : null}</Fact>
              <Fact label="Period">{g.effectivePeriod}</Fact>
            </dl>
          </Section>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-border">
            {g.website && (
              <a href={g.website} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-6 py-4 transition">
                <ExternalLink className="w-5 h-5" /> How to apply
              </a>
            )}
            {g.sourceUrl && g.sourceUrl !== g.website && (
              <a href={g.sourceUrl} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-foreground font-bold px-6 py-4 hover:bg-muted transition">
                <ExternalLink className="w-5 h-5" /> Official information
              </a>
            )}
          </div>
          {g.lastChecked && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              Checked against the official source on {formatDate(g.lastChecked)}.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
