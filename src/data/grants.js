// Turns the catalogue snapshot (exported from the Notion "Schemes & Benefits
// Catalogue", see ./catalogue/README.md) into the shape the UI uses.
// The snapshot is the source of truth: never edit amounts or rules here.
import catalogue from "./catalogue/schemes.json";
import { COUNTIES } from "@/lib/counties";
import { tagsFor } from "@/lib/tags";

export const CATALOGUE_META = catalogue.meta;

// Council-specific schemes name their area ("Limerick City and County"); national
// and nationally-run-but-locally-administered schemes apply everywhere.
function countiesIn(scope, area) {
  if (scope !== "Council-specific") return [];
  return COUNTIES.filter((c) => new RegExp(`\\b${c}\\b`, "i").test(area || ""));
}

export function toGrant(s) {
  return {
    id: s.key,
    name: s.name,
    category: s.category,
    scope: s.scope,
    area: s.area,
    counties: countiesIn(s.scope, s.area),
    administrator: s.administrator,
    audience: s.audience,
    eligibility: s.eligibility,
    benefitType: s.benefitType,
    amountEur: s.amountEur,
    amountBasis: s.amountBasis,
    frequency: s.frequency,
    meansTest: s.meansTest,
    status: s.applicationStatus,
    deadline: s.deadline,
    effectivePeriod: s.effectivePeriod,
    website: s.applyUrl || s.officialSource,
    sourceUrl: s.officialSource,
    lastChecked: s.lastChecked,
    verification: s.verification,
    who: tagsFor(s),
  };
}

export const GRANTS = catalogue.schemes.map(toGrant);

export const grantById = (id) => GRANTS.find((g) => g.id === id);
