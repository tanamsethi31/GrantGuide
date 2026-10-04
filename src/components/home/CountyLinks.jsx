import React from "react";
import { Link } from "react-router-dom";
import { COUNTIES } from "@/lib/counties";
import { CATALOGUE_META } from "@/data/grants";
import { formatDate } from "@/lib/grantDisplay";

export default function CountyLinks() {
  return (
    <section className="bg-[#f7f7f7] border-t border-[#ebebeb] mt-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 py-10">
        <h2 className="text-xl font-semibold text-[#222222] mb-5">Find help in your county</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-y-3 gap-x-4">
          {COUNTIES.map((c) => (
            <Link key={c} to={`/search?location=${c}`} className="text-sm text-[#222222] hover:underline">
              Co. {c}
            </Link>
          ))}
        </div>
        <p className="text-sm text-[#717171] mt-8">
          Details checked against official sources on {formatDate(CATALOGUE_META.exportedOn)}. Always confirm on the official website before you apply.
        </p>
      </div>
    </section>
  );
}
