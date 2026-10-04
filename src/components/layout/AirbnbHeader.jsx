import React from "react";
import { Link } from "react-router-dom";
import { Compass, Zap, Home, HeartHandshake, Menu, User, Heart } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TABS = [
  { label: "All", value: "Any", icon: Compass },
  { label: "Energy", value: "Energy", icon: Zap },
  { label: "Housing", value: "Housing", icon: Home },
  { label: "Elderly", value: "Elderly", icon: HeartHandshake },
];

export default function AirbnbHeader({ tab, onTab, children }) {
  return (
    <header className="bg-gradient-to-b from-white to-[#f7f7f7] border-b border-[#ebebeb]">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-[#FF385C] w-40">
            <span className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-white" />
            </span>
            <span className="text-2xl font-bold tracking-tight">localhelp</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-8">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => onTab(t.value)}
                className={`flex items-center gap-2 pb-3 pt-1 text-sm border-b-2 transition ${
                  tab === t.value ? "border-[#222222] text-[#222222] font-semibold" : "border-transparent text-[#717171] hover:text-[#222222]"
                }`}
              >
                <t.icon className="w-5 h-5" /> {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 w-40 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Menu" className="flex items-center gap-2 rounded-full border border-[#dddddd] bg-white pl-3 pr-1.5 py-1.5 hover:shadow-md transition">
                  <Menu className="w-4 h-4 text-[#222222]" />
                  <span className="w-7 h-7 rounded-full bg-[#717171] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-44">
                <DropdownMenuItem asChild><Link to="/profile"><User className="w-4 h-4 mr-2" /> My profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/saved"><Heart className="w-4 h-4 mr-2" /> Saved</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/">Home</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex sm:hidden gap-5 overflow-x-auto pt-3">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => onTab(t.value)}
              className={`pb-2 text-sm border-b-2 whitespace-nowrap ${
                tab === t.value ? "border-[#222222] text-[#222222] font-semibold" : "border-transparent text-[#717171]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="py-5">{children}</div>
      </div>
    </header>
  );
}