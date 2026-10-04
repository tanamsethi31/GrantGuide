import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AirbnbHeader from "@/components/layout/AirbnbHeader";
import ResultsGrid from "@/components/supports/ResultsGrid";
import useSaved from "@/hooks/useSaved";

export default function Saved() {
  const navigate = useNavigate();
  const saved = useSaved();
  const onTab = (c) => navigate(c === "Any" ? "/search?q=support" : `/search?category=${c}`);

  return (
    <div className="min-h-screen bg-white font-body text-[#222222]">
      <AirbnbHeader tab="" onTab={onTab} />
      <main className="max-w-7xl mx-auto px-5 sm:px-10 py-10 pb-20">
        <h1 className="text-3xl font-bold mb-8">Saved supports</h1>
        {!saved.loaded ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#717171]" /></div>
        ) : !saved.authed ? (
          <div className="py-16">
            <p className="text-[#717171] mb-4">Log in to see the supports you have saved.</p>
            <button
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="rounded-lg bg-[#FF385C] hover:bg-[#e31c5f] text-white font-semibold px-6 py-3 transition"
            >
              Log in
            </button>
          </div>
        ) : (
          <ResultsGrid
            loading={false}
            supports={saved.items}
            saved={saved}
            emptyText="Nothing saved yet. Tap the heart on any support to keep it here."
          />
        )}
      </main>
    </div>
  );
}