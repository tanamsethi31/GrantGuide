import React from "react";
import { Link } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";

export default function PageNotFound() {
  return (
    <PageShell>
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-7xl font-bold text-primary/30">404</p>
        <h1 className="text-3xl font-bold mt-4">We couldn't find that page</h1>
        <p className="text-lg text-muted-foreground mt-3">The link may be old, or the address may have a typo.</p>
        <Link
          to="/"
          className="inline-flex mt-8 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-lg font-bold px-6 py-3 transition"
        >
          Go to the home page
        </Link>
      </div>
    </PageShell>
  );
}
