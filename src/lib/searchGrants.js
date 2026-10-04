import { GRANTS } from "@/data/grants";
import { categoryRank } from "@/lib/categories";
import { isClosed } from "@/lib/grantDisplay";

const STOP = new Set([
  "a", "an", "and", "the", "i", "im", "i'm", "me", "my", "for", "to", "of", "in", "on", "with",
  "is", "am", "are", "can", "get", "help", "need", "want", "any", "what", "how", "do", "there",
  "some", "support", "supports", "grant", "grants", "money", "please", "it", "be", "at", "or",
  "too", "high", "so", "much", "very", "have", "has", "our", "we", "us",
]);

// Everyday words people type, mapped to words the official scheme text uses.
const SYNONYMS = {
  heating: ["heat", "fuel", "energy", "insulat"],
  heat: ["heat", "fuel"],
  bills: ["electricity", "gas", "fuel", "energy"],
  bill: ["electricity", "gas", "fuel", "energy"],
  cold: ["fuel", "insulat", "heat"],
  doctor: ["gp", "medical"],
  gp: ["gp"],
  medicine: ["drugs", "prescri", "medicines"],
  prescriptions: ["drugs", "prescri"],
  rent: ["rent", "hap"],
  renting: ["rent", "hap"],
  house: ["home", "housing", "property"],
  home: ["home", "housing"],
  school: ["school", "education"],
  college: ["susi", "student", "course"],
  university: ["susi", "student"],
  baby: ["newborn", "maternity", "birth", "child"],
  pregnant: ["maternity", "birth"],
  kids: ["child", "famil"],
  children: ["child", "famil"],
  old: ["66", "70", "older", "pension"],
  older: ["66", "70", "older", "pension"],
  elderly: ["66", "70", "older", "pension"],
  pension: ["pension"],
  retired: ["pension", "66"],
  disabled: ["disab"],
  disability: ["disab"],
  carer: ["carer", "caring"],
  caring: ["carer", "caring"],
  job: ["jobseek", "employ"],
  unemployed: ["jobseek"],
  bus: ["travel", "transport"],
  train: ["travel", "transport"],
  travel: ["travel"],
  solar: ["solar"],
  water: ["water", "well", "lead"],
  childcare: ["childcare", "ecce", "preschool"],
  tax: ["tax", "relief", "credit"],
};

const words = (text) =>
  String(text || "").toLowerCase().replace(/[^a-z0-9' -]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

// Each typed word becomes a group of alternatives; a group matches if any alternative does.
const termGroups = (query) =>
  words(query).map((w) => {
    const base = w.length > 4 ? w.replace(/(ies|es|s)$/, "") : w;
    return [...new Set([w, base, ...(SYNONYMS[w] || [])])];
  });

const groupHits = (haystack, groups) => groups.filter((alts) => alts.some((a) => haystack.includes(a))).length;

// Default order: open schemes before closed ones, then by topic, then name.
const baseOrder = (a, b) =>
  Number(isClosed(a)) - Number(isClosed(b)) ||
  categoryRank(a.category) - categoryRank(b.category) ||
  a.name.localeCompare(b.name);

/**
 * Local search over the catalogue snapshot. Ranks schemes by how well they match
 * the typed question and the "about you" tags.
 *  - category "Any" or "" means every category.
 *  - location is a county; schemes with no counties apply nationally.
 *  - when the question has real words, a scheme must match at least one of them.
 */
export function searchGrants({ query = "", category = "Any", location = "", who = [] } = {}, grants = GRANTS) {
  const groups = termGroups(query);
  return grants
    .filter((g) => !category || category === "Any" || g.category === category)
    .filter((g) => !location || !g.counties.length || g.counties.includes(location))
    .map((g) => {
      const name = g.name.toLowerCase();
      const body = [g.audience, g.eligibility, g.administrator, g.benefitType, g.category].join(" ").toLowerCase();
      const textScore = groups.length ? groupHits(name, groups) * 3 + groupHits(body, groups) : 0;
      const whoScore = who.filter((w) => g.who.includes(w)).length * 2;
      return { grant: g, textScore, score: textScore + whoScore - (isClosed(g) ? 100 : 0) };
    })
    .filter((r) => !groups.length || r.textScore > 0)
    .sort((a, b) => b.score - a.score || baseOrder(a.grant, b.grant))
    .map((r) => r.grant);
}

/** Open schemes whose wording relates to at least one "about you" tag, most related first. */
export function matchGrants({ location = "", who = [] } = {}, grants = GRANTS) {
  if (!who.length) return [];
  return searchGrants({ location, who }, grants).filter((g) => !isClosed(g) && who.some((w) => g.who.includes(w)));
}
