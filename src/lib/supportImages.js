// Photos generated in the original prototype, still hosted on Base44's image CDN.
// TODO: copy these into /public/images so the app doesn't depend on that CDN.
const BASE = "https://media.base44.com/images/public/6ac0e51cd622b222468467a3/";
const u = (f) => BASE + f + "_generated_image.png";

export const IMG = {
  energy: u("a47f3f57f"),
  housing: u("9e5c055cf"),
  elderly: u("2131c3270"),
  family: u("434cafb4f"),
  health: u("130f4d133"),
  travel: u("74cd7451c"),
  money: u("cbf0ac404"),
  community: u("5580c51bd"),
};

const POOLS = {
  Energy: [IMG.energy, u("e429a9156"), u("abb1e4ce1"), u("b51a457ac"), u("5bea659e3"), u("6a965a3e3")],
  Housing: [IMG.housing, u("cfa498184"), IMG.money],
  Elderly: [IMG.elderly, u("ba244538b"), IMG.health, IMG.travel],
  Family: [IMG.family, IMG.community],
  Health: [IMG.health, IMG.community],
  Money: [IMG.money, IMG.community],
  Other: [IMG.family, IMG.community, IMG.health, IMG.money, IMG.travel],
};

// By position, so neighbouring cards in the same topic get different photos.
export function pickImage(support, index = 0) {
  const pool = POOLS[support.category] || POOLS.Other;
  return pool[index % pool.length];
}
