import { describe, expect, it } from "vitest";
import { computeTierSlices, mergeAndPaginate } from "./paginate-athletes";

type Item = { id: string; name: string };

describe("mergeAndPaginate", () => {
  const tier1: Item[] = [
    { id: "1", name: "a" },
    { id: "2", name: "b" },
    { id: "3", name: "c" },
  ];
  const tier2: Item[] = [
    { id: "4", name: "d" },
    { id: "5", name: "e" },
    { id: "6", name: "f" },
  ];

  it("returns only tier-1 items on page 1 when pageSize is smaller than tier 1", () => {
    expect(mergeAndPaginate([tier1, tier2], 1, 2)).toEqual([
      { id: "1", name: "a" },
      { id: "2", name: "b" },
    ]);
  });

  it("spans tier boundary with tier-1 tail then tier-2 head", () => {
    expect(mergeAndPaginate([tier1, tier2], 2, 2)).toEqual([
      { id: "3", name: "c" },
      { id: "4", name: "d" },
    ]);
  });

  it("returns only tier-2 items when page lies entirely in tier 2", () => {
    expect(mergeAndPaginate([tier1, tier2], 3, 2)).toEqual([
      { id: "5", name: "e" },
      { id: "6", name: "f" },
    ]);
  });

  it("preserves three-tier priority order across boundaries", () => {
    const t1 = [{ id: "1", name: "p4p1" }];
    const t2 = [{ id: "2", name: "div1" }, { id: "3", name: "div2" }];
    const t3 = [{ id: "4", name: "un1" }, { id: "5", name: "un2" }];

    expect(mergeAndPaginate([t1, t2, t3], 1, 3)).toEqual([
      { id: "1", name: "p4p1" },
      { id: "2", name: "div1" },
      { id: "3", name: "div2" },
    ]);
    expect(mergeAndPaginate([t1, t2, t3], 2, 2)).toEqual([
      { id: "3", name: "div2" },
      { id: "4", name: "un1" },
    ]);
  });

  it("returns an empty array when page is past the end", () => {
    expect(mergeAndPaginate([tier1, tier2], 10, 2)).toEqual([]);
  });

  it("returns an empty array for empty tiers", () => {
    expect(mergeAndPaginate([[], []], 1, 10)).toEqual([]);
  });
});

describe("computeTierSlices", () => {
  it("maps a page fully inside tier 1", () => {
    expect(computeTierSlices([5, 3], 1, 2)).toEqual([
      { tierIndex: 0, skip: 0, take: 2 },
    ]);
  });

  it("maps a page spanning tiers 1 and 2", () => {
    expect(computeTierSlices([3, 3], 2, 2)).toEqual([
      { tierIndex: 0, skip: 2, take: 1 },
      { tierIndex: 1, skip: 0, take: 1 },
    ]);
  });

  it("maps a page fully inside tier 2", () => {
    expect(computeTierSlices([3, 5], 3, 2)).toEqual([
      { tierIndex: 1, skip: 1, take: 2 },
    ]);
  });
});
