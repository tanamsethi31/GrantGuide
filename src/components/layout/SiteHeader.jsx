import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Home, Heart, User } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/profile", label: "My profile", icon: User },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="GrantGuide home">
      <img src="/favicon.svg" alt="" className="w-9 h-9" />
      <span className="text-2xl font-bold tracking-tight text-foreground">
        Grant<span className="text-primary">Guide</span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-[4.5rem] flex items-center justify-between gap-4">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 font-bold transition ${
                  isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sr-only sm:hidden">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
