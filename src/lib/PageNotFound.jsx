import React from "react";
import { Link } from "react-router-dom";
import AirbnbHeader from "@/components/layout/AirbnbHeader";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader />
      <main className="max-w-md mx-auto px-5 py-24 text-center">
        <p className="text-7xl font-light text-[#dddddd]">404</p>
        <h1 className="text-2xl font-semibold mt-4">We couldn't find that page</h1>
        <p className="text-[#717171] mt-2">The link may be old, or the address may have a typo.</p>
        <Link to="/" className="inline-flex mt-8 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-semibold px-6 py-3 transition">
          Go home
        </Link>
      </main>
    </div>
  );
}
