import { LayoutGrid, Zap, Home, HeartHandshake, Baby, Stethoscope, PiggyBank } from "lucide-react";

// value is what grants are tagged with; label is what people see.
export const CATEGORIES = [
  { value: "Any", label: "All", icon: LayoutGrid },
  { value: "Energy", label: "Energy bills", icon: Zap },
  { value: "Housing", label: "Housing", icon: Home },
  { value: "Elderly", label: "Older people", icon: HeartHandshake },
  { value: "Family", label: "Families", icon: Baby },
  { value: "Health", label: "Health and carers", icon: Stethoscope },
  { value: "Money", label: "Money help", icon: PiggyBank },
];

export const categoryLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value || "Support";
