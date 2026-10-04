import { useEffect, useState } from "react";
import { readStore, writeStore } from "@/lib/localStore";
import { grantById } from "@/data/grants";

// v2 stores catalogue ids; v1 stored whole objects from the old sample data.
const KEY = "grantguide.saved.v2";

// Saved schemes live in this browser until accounts exist.
export default function useSaved() {
  const [ids, setIds] = useState(() => readStore(KEY, []));

  useEffect(() => writeStore(KEY, ids), [ids]);

  const isSaved = (g) => ids.includes(g.id);
  const toggle = (g) => setIds((cur) => (cur.includes(g.id) ? cur.filter((i) => i !== g.id) : [g.id, ...cur]));
  // Ids that are no longer in the catalogue are skipped rather than shown blank.
  const items = ids.map(grantById).filter(Boolean);

  return { items, isSaved, toggle };
}
