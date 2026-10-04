import React from "react";
import { Link } from "react-router-dom";
import { Menu, User, Heart, Info } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AirbnbHeader({ children }) {
  return (
    <header className="bg-gradient-to-b from-white to-[#f7f7f7] border-b border-[#ebebeb]">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 pt-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-[#15803D]">
            <span className="w-8 h-8 rounded-full bg-[#15803D] flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-white" />
            </span>
            <span className="text-2xl font-bold tracking-tight">GrantGuide</span>
          </Link>
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
              <DropdownMenuItem asChild><Link to="/about"><Info className="w-4 h-4 mr-2" /> Why GrantGuide</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/">Home</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="py-5">{children}</div>
      </div>
    </header>
  );
}
