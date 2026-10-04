import { GRANTS } from "@/data/grants";

const STOP = new Set([
  "a", "an", "and", "the", "i", "im", "i'm", "me", "my", "for", "to", "of", "in", "on", "with",
  "is", "am", "are", "can", "get", "help", "need", "want", "any", "what", "how", "do", "there",
  "some", "support", "supports", "grant", "grants", "money", "please", "it", "be", "at", "or",
]);

const words = (text) =>
  String(text || "").toLowerCase().replace(/[^a-z0-9' -]/g, " ").split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));

const hits = (haystack, terms) => terms.filter((t) => haystack.includes(t)).length;

/**
 * Local search over the sample grants. Returns grants ranked by how well they
 * match the typed question and the "about you" tags.
 *  - category "Any" or "" means every category.
 *  - location is a county name; nationwide grants (counties: []) match any county.
 *  - when the question has real words, a grant must match at least one of them.
 */
export function searchGrants({ query = "", category = "Any", location = "", who = [] } = {}, grants = GRANTS) {
  const terms = words(query);
  return grants
    .filter((g) => !category || category === "Any" || g.category === category)
    .filter((g) => !location || !g.counties.length || g.counties.includes(location))
    .map((g) => {
      const textScore = terms.length
        ? hits(g.name.toLowerCase(), terms) * 3 +
          hits(g.keywords.join(" "), terms) * 2 +
          hits(g.help.toLowerCase(), terms)
        : 0;
      const whoScore = who.filter((w) => g.who.includes(w)).length * 2;
      return { grant: g, textScore, score: textScore + whoScore };
    })
    .filter((r) => !terms.length || r.textScore > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.grant);
}

/** Grants that share at least one "about you" tag, best matches first. */
export function matchGrants({ location = "", who = [] } = {}, grants = GRANTS) {
  if (!who.length) return [];
  return searchGrants({ location, who }, grants).filter((g) => who.some((w) => g.who.includes(w)));
}
