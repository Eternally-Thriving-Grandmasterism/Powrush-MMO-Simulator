export type MercyContext = {
  harvestEffectiveness: number;
  abundanceRate: number;
  valence: number;
  councilEngagement: number;
  stressNearby: number;
};

export function isHarvestViable(ctx: MercyContext): boolean {
  return ctx.harvestEffectiveness >= 0.45 && ctx.abundanceRate > 0.05;
}

export function shouldPlayConservatively(ctx: MercyContext): boolean {
  return ctx.valence < 0.28 || ctx.stressNearby > 0.72 || ctx.councilEngagement < 0.35;
}

export function overallHealth(ctx: MercyContext): number {
  const harvest = Math.min(1, Math.max(0.4, ctx.harvestEffectiveness));
  const abundance = ctx.abundanceRate > 0.4 ? 1 : 0.62;
  const valence = Math.min(1, ctx.valence);
  const council = Math.min(1, ctx.councilEngagement);
  const stress = 1 - Math.min(1, ctx.stressNearby);
  return (harvest + abundance + valence + council + stress) / 5;
}

export function harvestMultiplier(ctx: MercyContext, factionFood: number, typeIsFood: boolean): number {
  let m = 1;
  if (ctx.valence > 0.62) m *= 1.22;
  else if (ctx.valence < 0.28) m *= 0.55;
  if (typeIsFood) m *= factionFood;
  if (shouldPlayConservatively(ctx)) m *= 0.72;
  return m;
}
