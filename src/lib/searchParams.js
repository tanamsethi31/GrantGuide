// The search state lives in the URL, so results pages can be shared and
// the back button works: /search?q=heating&category=Energy&location=Cork&who=Renting,Over 66

export function readSearchParams(params) {
  return {
    query: params.get("q") || "",
    category: params.get("category") || "Any",
    location: params.get("location") || "",
    who: (params.get("who") || "").split(",").filter(Boolean),
  };
}

export function toSearchParams({ query, category, location, who }) {
  const p = new URLSearchParams();
  if (query) p.set("q", query);
  if (category && category !== "Any") p.set("category", category);
  if (location) p.set("location", location);
  if (who?.length) p.set("who", who.join(","));
  return p;
}
