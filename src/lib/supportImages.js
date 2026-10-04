// Photos generated for the original prototype, served from public/images.
const u = (name) => `/images/${name}.jpg`;

export const IMG = {
  energy: u("energy"),
  housing: u("housing"),
  elderly: u("elderly"),
  family: u("family"),
  health: u("health"),
  travel: u("travel"),
  money: u("money"),
  community: u("community"),
};

// Keyed by catalogue category.
const POOLS = {
  "Energy and environment": [IMG.energy, u("energy-2"), u("energy-3"), u("energy-4"), u("energy-5"), u("energy-6")],
  Housing: [IMG.housing, u("housing-2")],
  "Disability and caring": [IMG.elderly, u("elderly-2"), IMG.health],
  Health: [IMG.health, u("elderly-2")],
  "Income and family": [IMG.family, IMG.money],
  "Education and childcare": [IMG.family, IMG.community],
  Tax: [IMG.money, IMG.housing],
  Transport: [IMG.travel],
  Community: [IMG.community],
  Business: [IMG.money],
  Other: [IMG.family, IMG.community, IMG.health, IMG.money, IMG.travel],
};

// By position, so neighbouring cards in the same topic get different photos.
export function pickImage(support, index = 0) {
  const pool = POOLS[support.category] || POOLS.Other;
  return pool[index % pool.length];
}
