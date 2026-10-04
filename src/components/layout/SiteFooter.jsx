import React from "react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 text-muted-foreground">
        <p className="font-bold text-foreground">GrantGuide is in early development.</p>
        <p className="mt-1">
          The grants shown are a small sample. Always check the official website before you apply.
        </p>
      </div>
    </footer>
  );
}
