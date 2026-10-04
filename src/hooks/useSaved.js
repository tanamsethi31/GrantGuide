import { useEffect, useState } from "react";
import { readStore, writeStore } from "@/lib/localStore";

const KEY = "grantguide.saved";

// Saved grants live in this browser until accounts exist.
export default function useSaved() {
  const [items, setItems] = useState(() => readStore(KEY, []));

  useEffect(() => writeStore(KEY, items), [items]);

  const isSaved = (g) => items.some((i) => i.name === g.name);

  const toggle = (g) =>
    setItems((cur) => (cur.some((i) => i.name === g.name) ? cur.filter((i) => i.name !== g.name) : [g, ...cur]));

  return { items, isSaved, toggle };
}
