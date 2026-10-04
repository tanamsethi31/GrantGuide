import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useSaved() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [authed, setAuthed] = useState(true);

  useEffect(() => {
    (async () => {
      const ok = await base44.auth.isAuthenticated();
      setAuthed(ok);
      if (ok) setItems(await base44.entities.SavedSupport.list("-created_date"));
      setLoaded(true);
    })();
  }, []);

  const isSaved = (s) => items.some((i) => i.name === s.name);

  const toggle = async (s, county = "") => {
    if (!(await base44.auth.isAuthenticated())) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    const existing = items.find((i) => i.name === s.name);
    if (existing) {
      setItems((cur) => cur.filter((i) => i.name !== s.name));
      if (existing.id) await base44.entities.SavedSupport.delete(existing.id);
      return;
    }
    const data = {
      name: s.name,
      category: s.category || "Other",
      help: s.help || "",
      phone: s.phone || "",
      website: s.website || "",
      county: s.county || county || "",
    };
    setItems((cur) => [data, ...cur]);
    const rec = await base44.entities.SavedSupport.create(data);
    setItems((cur) => cur.map((i) => (i.name === data.name && !i.id ? rec : i)));
  };

  return { items, loaded, authed, isSaved, toggle };
}