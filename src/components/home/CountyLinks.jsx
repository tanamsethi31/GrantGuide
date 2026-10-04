import React from "react";
import { Link } from "react-router-dom";
import { COUNTIES } from "@/lib/counties";

export default function CountyLinks() {
  return (
    <section className="bg-secondary mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Find help in your county</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-y-4 gap-x-4">
          {COUNTIES.map((c) => (
            <Link key={c} to={`/search?location=${c}`} className="text-lg hover:underline hover:text-primary">
              Co. {c}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
