export function mergeAndPaginate<T>(
  tiers: T[][],
  page: number,
  pageSize: number
): T[] {
  const all = tiers.flat();
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return all.slice(startIndex, endIndex);
}

export type TierSlice = {
  tierIndex: number;
  skip: number;
  take: number;
};

/** Maps a global page window onto per-tier skip/take slices (for bounded DB fetches). */
export function computeTierSlices(
  tierCounts: number[],
  page: number,
  pageSize: number
): TierSlice[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const slices: TierSlice[] = [];
  let tierStart = 0;

  for (let tierIndex = 0; tierIndex < tierCounts.length; tierIndex++) {
    const tierSize = tierCounts[tierIndex] ?? 0;
    const tierEnd = tierStart + tierSize;
    const overlapStart = Math.max(startIndex, tierStart);
    const overlapEnd = Math.min(endIndex, tierEnd);

    if (overlapStart < overlapEnd) {
      slices.push({
        tierIndex,
        skip: overlapStart - tierStart,
        take: overlapEnd - overlapStart,
      });
    }

    tierStart = tierEnd;
  }

  return slices;
}
