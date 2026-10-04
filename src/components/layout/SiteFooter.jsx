import React from "react";
import { CATALOGUE_META } from "@/data/grants";
import { formatDate } from "@/lib/grantDisplay";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 text-muted-foreground">
        <p className="font-bold text-foreground">GrantGuide is in early development.</p>
        <p className="mt-1">
          Scheme details were checked against official sources on {formatDate(CATALOGUE_META.exportedOn)}. Rates and rules
          change, so always confirm on the official website before you apply.
        </p>
      </div>
    </footer>
  );
}
