// { pp: 0, gp: 0, sp: 0, cp: 0 }
// Add them up where pp = 10, gp = 1, sp = 0.1, cp = 0.01

export function flattenPrice(price: {
  pp?: number;
  gp?: number;
  sp?: number;
  cp?: number;
}): number {
  let flat = 0;
  if (price.pp) flat += price.pp * 10;
  if (price.gp) flat += price.gp;
  if (price.sp) flat += price.sp / 10;
  if (price.cp) flat += price.cp / 100;
  return flat;
}

export function cleanFoundryDescription(content: string) {
  // TODO
  return content;
}
