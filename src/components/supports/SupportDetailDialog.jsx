import React from "react";
import { Phone, ExternalLink, Clock, FileText, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Criteria, Steps, Section } from "@/components/supports/DetailSection";
import SaveButton from "@/components/supports/SaveButton";
import { categoryLabel } from "@/lib/categories";

// Shows whatever detail a grant record has. The sample data only has the basics;
// amount, criteria, steps and documents render once the database provides them.
export default function SupportDetailDialog({ open, onOpenChange, support, image, saved, onToggle }) {
  const hasDetail = support.amount || support.criteria?.length || support.steps?.length;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-0 gap-0">
        <div className="relative h-52 sm:h-60 bg-muted">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <span className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-bold shadow-sm">
            {categoryLabel(support.category)}
          </span>
        </div>
        <div className="px-6 sm:px-8 pt-6 pb-8">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl sm:text-3xl font-bold leading-tight">{support.name}</DialogTitle>
            <SaveButton saved={saved} onToggle={() => onToggle(support)} className="shrink-0 border border-border" />
          </div>
          <DialogDescription className="text-lg text-muted-foreground mt-2">{support.help}</DialogDescription>

          {support.who?.length > 0 && (
            <Section title="Often useful if you are">
              <div className="flex flex-wrap gap-2">
                {support.who.map((w) => (
                  <span key={w} className="rounded-full bg-secondary text-secondary-foreground px-3 py-1">{w}</span>
                ))}
              </div>
            </Section>
          )}

          {support.amount && (
            <div className="mt-6 rounded-2xl bg-accent p-5">
              <p className="text-sm font-bold uppercase tracking-wide text-accent-foreground">How much you could get</p>
              <p className="text-3xl font-bold mt-1">{support.amount}</p>
              {support.amount_note && <p className="text-muted-foreground mt-1">{support.amount_note}</p>}
            </div>
          )}
          {support.criteria?.length > 0 && <Section title="Who can apply"><Criteria items={support.criteria} /></Section>}
          {support.steps?.length > 0 && (
            <Section title="How it works">
              <Steps items={support.steps} />
              {support.timeline && (
                <p className="flex items-center gap-2 text-muted-foreground mt-5"><Clock className="w-5 h-5" /> {support.timeline}</p>
              )}
            </Section>
          )}
          {support.documents?.length > 0 && (
            <Section title="What to have ready">
              <ul className="space-y-2">
                {support.documents.map((d, i) => (
                  <li key={i} className="flex gap-3"><FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-1" /> {d}</li>
                ))}
              </ul>
            </Section>
          )}

          {!hasDetail && (
            <p className="mt-6 flex gap-3 rounded-2xl bg-muted p-4 text-muted-foreground">
              <Info className="w-5 h-5 shrink-0 mt-1" aria-hidden="true" />
              Full rules, amounts and how to apply are coming soon. For now, the official website has everything you need.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-border">
            {support.website && (
              <a href={support.website} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-6 py-4 transition">
                <ExternalLink className="w-5 h-5" /> Go to the official website
              </a>
            )}
            {support.phone && (
              <a href={`tel:${support.phone.replace(/[^+\d]/g, "")}`} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-foreground font-bold px-6 py-4 hover:bg-muted transition">
                <Phone className="w-5 h-5" /> {support.phone}
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
