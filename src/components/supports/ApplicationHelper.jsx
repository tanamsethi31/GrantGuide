import React from "react";
import { Link } from "react-router-dom";
import { FileText, Mic } from "lucide-react";

/**
 * "Get ready to apply" card in the grant details pop-up. Leads into the one
 * application flow at /apply/:id: talk it through (spoken questions) or fill in
 * the form (with a "Use voice" button on each field).
 */
export default function ApplicationHelper({ support }) {
  const base = `/apply/${encodeURIComponent(support.id)}`;
  return (
    <section className="mt-8 border-t border-[#ebebeb] pt-7" aria-labelledby="application-helper-title">
      <div className="rounded-2xl border border-[#d1fae5] bg-[#f0fdf4] p-5 sm:p-6">
        <h2 id="application-helper-title" className="text-xl font-bold text-[#222222]">
          Get ready to apply for {support.name}
        </h2>
        <p className="mt-2 text-base text-[#222222]">
          Answer a few questions before going to the official application. You can talk it through, or fill in a short form and use the microphone for any answer.
        </p>
        <p className="mt-2 text-sm text-[#525252]">
          GrantGuide does not send or save this information.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Link
            to={`${base}?mode=chat`}
            className="flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#166534] px-5 py-3 text-base font-semibold text-white transition"
          >
            <Mic className="h-5 w-5" /> Talk it through
          </Link>
          <Link
            to={`${base}?mode=form`}
            className="flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#222222] bg-white hover:bg-[#f7f7f7] px-5 py-3 text-base font-semibold text-[#222222] transition"
          >
            <FileText className="h-5 w-5" /> Fill in the form
          </Link>
        </div>
      </div>
    </section>
  );
}
