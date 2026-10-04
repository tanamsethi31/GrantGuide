import {
  LayoutGrid, HandCoins, Home, Zap, HeartHandshake, Stethoscope, GraduationCap, Receipt, Bus, Users, Briefcase,
} from "lucide-react";

// value matches the catalogue's Category; label is what people see.
// inTabs: false keeps group/business schemes out of the topic tabs (still searchable).
// Listed in the order topics are shown and results are ranked.
export const CATEGORIES = [
  { value: "Any", label: "All", icon: LayoutGrid },
  { value: "Income and family", label: "Family", icon: HandCoins },
  { value: "Housing", label: "Housing", icon: Home },
  { value: "Energy and environment", label: "Energy", icon: Zap },
  { value: "Health", label: "Health", icon: Stethoscope },
  { value: "Disability and caring", label: "Disability and care", icon: HeartHandshake },
  { value: "Education and childcare", label: "Education", icon: GraduationCap },
  { value: "Tax", label: "Tax relief", icon: Receipt },
  { value: "Transport", label: "Transport", icon: Bus },
  { value: "Community", label: "Community groups", icon: Users, inTabs: false },
  { value: "Business", label: "Business", icon: Briefcase, inTabs: false },
];

export const categoryLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value || "Support";

export const categoryRank = (value) => {
  const i = CATEGORIES.findIndex((c) => c.value === value);
  return i === -1 ? CATEGORIES.length : i;
};
