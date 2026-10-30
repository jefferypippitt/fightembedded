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
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    event: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { POST as createAthlete } from "./athletes/route";
import { DELETE as deleteAthlete } from "./athletes/[id]/route";
import { PATCH as patchAthleteStats } from "./athletes/[id]/stats/route";
import { DELETE as deleteEvent } from "./events/[id]/route";

const SECRET = "test-secret";
const db = vi.mocked(prisma, true);
const mockRevalidateTag = vi.mocked(revalidateTag);
const mockRevalidatePath = vi.mocked(revalidatePath);

function botRequest(
  path: string,
  init: { method: string; body?: unknown; token?: string | null }
) {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (init.token !== null) {
    headers.set("Authorization", `Bearer ${init.token ?? SECRET}`);
  }
  return new NextRequest(`http://localhost${path}`, {
    method: init.method,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

function idParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

const storedAthlete = {
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
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.BOT_API_SECRET = SECRET;
});

describe("POST /api/bot/athletes", () => {
  const body = {
    name: "Jane Doe",
    gender: "FEMALE",
    weightDivision: "Women's Strawweight",
    country: "US",
    age: 27,
    wins: 10,
    winsByKo: 3,
    winsBySubmission: 4,
    followers: 100,
  };

  it("requires the bearer token", async () => {
    const res = await createAthlete(
      botRequest("/api/bot/athletes", { method: "POST", body, token: null })
    );

    expect(res.status).toBe(401);
    expect(db.athlete.create).not.toHaveBeenCalled();
  });

  it("creates an unranked athlete, returns 201, and invalidates caches", async () => {
    db.athlete.findFirst.mockResolvedValue(null);
    db.athlete.create.mockResolvedValue(storedAthlete);

    const res = await createAthlete(
      botRequest("/api/bot/athletes", { method: "POST", body })
    );
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.athlete.id).toBe("ath_1");
    expect(db.athlete.create).toHaveBeenCalledWith({
      data: {
        ...body,
        losses: 0,
        draws: 0,
        retired: false,
        imageUrl: "",
        rank: 0,
        poundForPoundRank: 0,
      },
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("all-athletes", "max");
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      "/division/women-strawweight",
      "page"
    );
  });

  it.each(["rank", "poundForPoundRank"])(
    "rejects %s with 400 and points to the rankings endpoints",
    async (field) => {
      const res = await createAthlete(
        botRequest("/api/bot/athletes", {
          method: "POST",
          body: { ...body, [field]: 0 },
        })
      );
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toContain("/api/bot/rankings/division");
      expect(json.error).toContain("/api/bot/rankings/p4p");
      expect(db.athlete.create).not.toHaveBeenCalled();
    }
  );

  it("rejects a division that does not match gender", async () => {
    const res = await createAthlete(
      botRequest("/api/bot/athletes", {
        method: "POST",
        body: { ...body, weightDivision: "Men's Flyweight" },
      })
    );

    expect(res.status).toBe(400);
    expect(db.athlete.create).not.toHaveBeenCalled();
  });

  it("returns 409 with the existing id for a case-insensitive duplicate", async () => {
    db.athlete.findFirst.mockResolvedValue({
      ...storedAthlete,
      id: "ath_old",
      name: "JANE DOE",
    });

    const res = await createAthlete(
      botRequest("/api/bot/athletes", { method: "POST", body })
    );
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.id).toBe("ath_old");
    expect(db.athlete.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: { equals: "Jane Doe", mode: "insensitive" } },
      })
    );
    expect(db.athlete.create).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/bot/athletes/{id}/stats", () => {
  function patch(body: unknown) {
    return patchAthleteStats(
      botRequest("/api/bot/athletes/ath_1/stats", { method: "PATCH", body }),
      idParams("ath_1")
    );
  }

  it("updates name, country, and imageUrl", async () => {
    db.athlete.findUnique.mockResolvedValue(storedAthlete);
    db.athlete.findFirst.mockResolvedValue(null);
    db.athlete.update.mockResolvedValue({ ...storedAthlete, name: "Janet Doe" });

    const res = await patch({
      name: "Janet Doe",
      country: "CA",
      imageUrl: "https://example.com/janet.png",
    });

    expect(res.status).toBe(200);
    expect(db.athlete.update).toHaveBeenCalledWith({
      where: { id: "ath_1" },
      data: {
        name: "Janet Doe",
        country: "CA",
        imageUrl: "https://example.com/janet.png",
      },
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("athlete-ath_1", "max");
    expect(mockRevalidateTag).toHaveBeenCalledWith("athlete-images", "max");
  });

  it("still rejects rank fields", async () => {
    const res = await patch({ name: "Janet Doe", rank: 2 });

    expect(res.status).toBe(400);
    expect(db.athlete.update).not.toHaveBeenCalled();
  });

  it("rejects a gender change that no longer matches the division", async () => {
    db.athlete.findUnique.mockResolvedValue(storedAthlete);

    const res = await patch({ gender: "MALE" });

    expect(res.status).toBe(400);
    expect(db.athlete.update).not.toHaveBeenCalled();
  });

  it("allows gender and division to change together", async () => {
    db.athlete.findUnique.mockResolvedValue(storedAthlete);
    db.athlete.update.mockResolvedValue(storedAthlete);

    const res = await patch({
      gender: "MALE",
      weightDivision: "Men's Flyweight",
    });

    expect(res.status).toBe(200);
  });

  it("returns 409 when changing gender while holding a pound-for-pound rank", async () => {
    db.athlete.findUnique.mockResolvedValue({
      ...storedAthlete,
      poundForPoundRank: 2,
    });

    const res = await patch({
      gender: "MALE",
      weightDivision: "Men's Flyweight",
    });

    expect(res.status).toBe(409);
    expect(db.athlete.update).not.toHaveBeenCalled();
  });

  it("returns 409 when renaming to another athlete's name", async () => {
    db.athlete.findUnique.mockResolvedValue(storedAthlete);
    db.athlete.findFirst.mockResolvedValue({
      ...storedAthlete,
      id: "ath_2",
      name: "John Doe",
    });

    const res = await patch({ name: "john doe" });
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.id).toBe("ath_2");
    expect(db.athlete.update).not.toHaveBeenCalled();
  });

  it("keeps existing stats updates working", async () => {
    db.athlete.findUnique.mockResolvedValue(storedAthlete);
    db.athlete.update.mockResolvedValue({ ...storedAthlete, wins: 11 });

    const res = await patch({ wins: 11 });

    expect(res.status).toBe(200);
    expect(db.athlete.findFirst).not.toHaveBeenCalled();
  });
});

describe("DELETE /api/bot/athletes/{id}", () => {
  function del(query = "") {
    return deleteAthlete(
      botRequest(`/api/bot/athletes/ath_1${query}`, { method: "DELETE" }),
      idParams("ath_1")
    );
  }

  it("returns 404 when the athlete does not exist", async () => {
    db.athlete.findUnique.mockResolvedValue(null);

    const res = await del();

    expect(res.status).toBe(404);
    expect(db.athlete.delete).not.toHaveBeenCalled();
  });

  it("returns 409 for a ranked athlete without force", async () => {
    db.athlete.findUnique.mockResolvedValue({ ...storedAthlete, rank: 3 });

    const res = await del();

    expect(res.status).toBe(409);
    expect(db.athlete.delete).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it("deletes a ranked athlete with ?force=true", async () => {
    db.athlete.findUnique.mockResolvedValue({
      ...storedAthlete,
      rank: 1,
      poundForPoundRank: 4,
    });

    const res = await del("?force=true");
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.athlete).toEqual({
      id: "ath_1",
      name: "Jane Doe",
      weightDivision: "Women's Strawweight",
      rank: 1,
      poundForPoundRank: 4,
    });
    expect(db.athlete.delete).toHaveBeenCalledWith({ where: { id: "ath_1" } });
    expect(mockRevalidateTag).toHaveBeenCalledWith("champions-data", "max");
    expect(mockRevalidateTag).toHaveBeenCalledWith("p4p-rankings-data", "max");
  });

  it("deletes an unranked athlete and invalidates caches", async () => {
    db.athlete.findUnique.mockResolvedValue(storedAthlete);

    const res = await del();

    expect(res.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledWith("athlete-ath_1", "max");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/athletes", "page");
  });
});

describe("DELETE /api/bot/events/{id}", () => {
  function del() {
    return deleteEvent(
      botRequest("/api/bot/events/evt_1", { method: "DELETE" }),
      idParams("evt_1")
    );
  }

  it("returns 404 when the event does not exist", async () => {
    db.event.findUnique.mockResolvedValue(null);

    const res = await del();

    expect(res.status).toBe(404);
    expect(db.event.delete).not.toHaveBeenCalled();
  });

  it("deletes the event, returns its summary, and invalidates caches", async () => {
    const date = new Date("2026-12-12T03:00:00.000Z");
    db.event.findUnique.mockResolvedValue({
      id: "evt_1",
      name: "UFC 999",
      date,
      venue: "Arena",
      location: "Las Vegas",
      mainEvent: "A vs B",
      coMainEvent: null,
      imageUrl: null,
      status: "UPCOMING",
      createdAt: date,
      updatedAt: date,
    });

    const res = await del();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.event).toEqual({
      id: "evt_1",
      name: "UFC 999",
      date: date.toISOString(),
      status: "UPCOMING",
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("all-events", "max");
    expect(mockRevalidateTag).toHaveBeenCalledWith("event-evt_1", "max");
    expect(mockRevalidatePath).toHaveBeenCalledWith("/events", "page");
  });
});
