import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(async () => ({
    rateLimited: false,
    remaining: 10,
    resetAt: Date.now() + 60_000,
    headers: new Headers(),
  })),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    athlete: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    event: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import {
  GET as listAthletes,
  POST as createAthlete,
} from "./athletes/route";
import { GET as getAthlete } from "./athletes/[id]/route";
import { PATCH as patchAthleteStats } from "./athletes/[id]/stats/route";
import { POST as createEvent } from "./events/route";
import { GET as getEvent, PATCH as patchEvent } from "./events/[id]/route";
import { PUT as putDivision } from "./rankings/division/route";
import { PUT as putP4p } from "./rankings/p4p/route";
import {
  GET as getRetiredOrder,
  PUT as putRetiredOrder,
} from "./rankings/retired/route";

const SECRET = "test-secret";
const db = vi.mocked(prisma, true);
const mockRevalidateTag = vi.mocked(revalidateTag);
const mockRevalidatePath = vi.mocked(revalidatePath);

function botRequest(
  path: string,
  init: { method: string; body?: unknown; rawBody?: string }
) {
  return new NextRequest(`http://localhost${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
    },
    body:
      init.rawBody ??
      (init.body === undefined ? undefined : JSON.stringify(init.body)),
  });
}

function idParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function athlete(overrides: Record<string, unknown>) {
  return {
    id: "ath_1",
    name: "Jane Doe",
    gender: "FEMALE",
    age: 27,
    weightDivision: "Women's Strawweight",
    country: "US",
    imageUrl: "",
    wins: 10,
    losses: 0,
    draws: 0,
    winsByKo: 3,
    winsBySubmission: 4,
    followers: 100,
    rank: 0,
    poundForPoundRank: 0,
    retired: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

const eventRecord = {
  id: "evt_1",
  name: "UFC 999",
  date: new Date("2026-12-12T03:00:00.000Z"),
  venue: "T-Mobile Arena",
  location: "Las Vegas, Nevada",
  mainEvent: "A vs B",
  coMainEvent: null,
  imageUrl: null,
  status: "UPCOMING" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.BOT_API_SECRET = SECRET;
});

describe("malformed JSON", () => {
  const cases = [
    ["POST /athletes", () =>
      createAthlete(botRequest("/api/bot/athletes", { method: "POST", rawBody: "{" }))],
    ["PATCH /athletes/{id}/stats", () =>
      patchAthleteStats(
        botRequest("/api/bot/athletes/ath_1/stats", { method: "PATCH", rawBody: "{" }),
        idParams("ath_1")
      )],
    ["POST /events", () =>
      createEvent(botRequest("/api/bot/events", { method: "POST", rawBody: "{" }))],
    ["PATCH /events/{id}", () =>
      patchEvent(
        botRequest("/api/bot/events/evt_1", { method: "PATCH", rawBody: "{" }),
        idParams("evt_1")
      )],
    ["PUT /rankings/division", () =>
      putDivision(botRequest("/api/bot/rankings/division", { method: "PUT", rawBody: "{" }))],
    ["PUT /rankings/p4p", () =>
      putP4p(botRequest("/api/bot/rankings/p4p", { method: "PUT", rawBody: "{" }))],
    ["PUT /rankings/retired", () =>
      putRetiredOrder(botRequest("/api/bot/rankings/retired", { method: "PUT", rawBody: "{" }))],
  ] as const;

  it.each(cases)("%s returns 400", async (_name, call) => {
    const res = await call();
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Request body must be valid JSON.");
  });
});

describe("POST /api/bot/events duplicate guard", () => {
  const body = {
    name: "UFC 999",
    date: "2026-12-12T03:00:00Z",
    venue: "T-Mobile Arena",
    location: "Las Vegas, Nevada",
    mainEvent: "A vs B",
  };

  it("returns 409 with the existing id when the same event exists", async () => {
    db.event.findFirst.mockResolvedValue(eventRecord);

    const res = await createEvent(
      botRequest("/api/bot/events", { method: "POST", body })
    );
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.id).toBe("evt_1");
    expect(db.event.create).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();

    const where = db.event.findFirst.mock.calls[0][0]?.where;
    expect(where?.name).toEqual({ equals: "UFC 999", mode: "insensitive" });
    expect(where?.date).toEqual({
      gte: new Date("2026-12-11T03:00:00.000Z"),
      lte: new Date("2026-12-13T03:00:00.000Z"),
    });
  });

  it("creates the event when there is no duplicate", async () => {
    db.event.findFirst.mockResolvedValue(null);
    db.event.create.mockResolvedValue(eventRecord);

    const res = await createEvent(
      botRequest("/api/bot/events", { method: "POST", body })
    );

    expect(res.status).toBe(201);
    // status is optional and defaults to UPCOMING, as documented
    expect(db.event.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ status: "UPCOMING" }),
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("all-events", "max");
  });
});

describe("GET by id", () => {
  it("returns an athlete", async () => {
    db.athlete.findUnique.mockResolvedValue(athlete({}));

    const res = await getAthlete(
      botRequest("/api/bot/athletes/ath_1", { method: "GET" }),
      idParams("ath_1")
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.athlete.id).toBe("ath_1");
  });

  it("returns 404 for a missing athlete", async () => {
    db.athlete.findUnique.mockResolvedValue(null);

    const res = await getAthlete(
      botRequest("/api/bot/athletes/nope", { method: "GET" }),
      idParams("nope")
    );

    expect(res.status).toBe(404);
  });

  it("returns an event and 404 for a missing one", async () => {
    db.event.findUnique.mockResolvedValueOnce(eventRecord);
    db.event.findUnique.mockResolvedValueOnce(null);

    const found = await getEvent(
      botRequest("/api/bot/events/evt_1", { method: "GET" }),
      idParams("evt_1")
    );
    const missing = await getEvent(
      botRequest("/api/bot/events/nope", { method: "GET" }),
      idParams("nope")
    );

    expect(found.status).toBe(200);
    expect((await found.json()).event.id).toBe("evt_1");
    expect(missing.status).toBe(404);
  });
});

describe("GET /api/bot/athletes listing", () => {
  it("keeps the name-only search working", async () => {
    db.athlete.findMany.mockResolvedValue([athlete({})]);

    const res = await listAthletes(
      botRequest("/api/bot/athletes?name=jane", { method: "GET" })
    );

    expect(res.status).toBe(200);
    expect(db.athlete.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: { contains: "jane", mode: "insensitive" } },
        take: 10,
      })
    );
  });

  it("still returns 404 when a name search finds nothing", async () => {
    db.athlete.findMany.mockResolvedValue([]);

    const res = await listAthletes(
      botRequest("/api/bot/athletes?name=nobody", { method: "GET" })
    );

    expect(res.status).toBe(404);
  });

  it("lists active athletes in a division, ranked first", async () => {
    db.athlete.findMany.mockResolvedValue([
      athlete({ id: "u1", name: "Amy", rank: 0 }),
      athlete({ id: "r2", name: "Bea", rank: 2 }),
      athlete({ id: "r1", name: "Cat", rank: 1 }),
    ]);

    const res = await listAthletes(
      botRequest(
        "/api/bot/athletes?division=Women's%20Strawweight&retired=false",
        { method: "GET" }
      )
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.athletes.map((a: { id: string }) => a.id)).toEqual([
      "r1",
      "r2",
      "u1",
    ]);
    expect(db.athlete.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          weightDivision: "Women's Strawweight",
          retired: { not: true },
        },
        take: 200,
      })
    );
  });

  it("returns 200 with an empty list for an empty division", async () => {
    db.athlete.findMany.mockResolvedValue([]);

    const res = await listAthletes(
      botRequest("/api/bot/athletes?division=Men's%20Flyweight", {
        method: "GET",
      })
    );

    expect(res.status).toBe(200);
    expect((await res.json()).count).toBe(0);
  });

  it("returns 400 without name or division", async () => {
    const res = await listAthletes(
      botRequest("/api/bot/athletes", { method: "GET" })
    );

    expect(res.status).toBe(400);
    expect(db.athlete.findMany).not.toHaveBeenCalled();
  });
});

describe("/api/bot/rankings/retired", () => {
  const retired = [
    { id: "a", name: "A", rank: 1, weightDivision: "Men's Lightweight" },
    { id: "b", name: "B", rank: 2, weightDivision: "Men's Lightweight" },
    { id: "c", name: "C", rank: 3, weightDivision: "Men's Welterweight" },
  ];

  it("GET returns retired athletes in page order", async () => {
    db.athlete.findMany.mockResolvedValue(retired as never);

    const res = await getRetiredOrder(
      botRequest("/api/bot/rankings/retired", { method: "GET" })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.count).toBe(3);
    expect(db.athlete.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { retired: true },
        orderBy: [{ rank: "asc" }, { name: "asc" }],
      })
    );
  });

  it("dry run returns the diff without writing", async () => {
    db.athlete.findMany.mockResolvedValue(retired as never);

    const res = await putRetiredOrder(
      botRequest("/api/bot/rankings/retired", {
        method: "PUT",
        body: { athleteIds: ["c"], dryRun: true },
      })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.changes).toEqual([
      { athleteId: "c", name: "C", before: 3, after: 1 },
      { athleteId: "a", name: "A", before: 1, after: 2 },
      { athleteId: "b", name: "B", before: 2, after: 3 },
    ]);
    expect(db.$transaction).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("writes the new order and revalidates the retired page", async () => {
    db.athlete.findMany.mockResolvedValue(retired as never);
    db.$transaction.mockResolvedValue([]);

    const res = await putRetiredOrder(
      botRequest("/api/bot/rankings/retired", {
        method: "PUT",
        body: { athleteIds: ["b"] },
      })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.updated).toBe(2);
    expect(db.athlete.update).toHaveBeenCalledWith({
      where: { id: "b" },
      data: { rank: 1 },
    });
    expect(db.athlete.update).toHaveBeenCalledWith({
      where: { id: "a" },
      data: { rank: 2 },
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("retired-page", "max");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/retired", "page");
  });

  it("rejects athletes who are not retired", async () => {
    db.athlete.findMany.mockResolvedValue(retired as never);

    const res = await putRetiredOrder(
      botRequest("/api/bot/rankings/retired", {
        method: "PUT",
        body: { athleteIds: ["active_1"] },
      })
    );

    expect(res.status).toBe(400);
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});
