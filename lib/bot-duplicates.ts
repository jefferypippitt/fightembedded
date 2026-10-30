import type { Prisma } from "@prisma/client";

/**
 * Duplicate checks for bot writes.
 *
 * A check followed by a write is racy: two requests can both see "no
 * duplicate" and both write. Each check runs inside a transaction that first
 * takes a Postgres advisory lock on the lowercased name, so writers of the
 * same name run one at a time. The lock is released when the transaction
 * ends. Nothing is stored and no schema change is needed.
 */

const LOCK_SCOPE_ATHLETE_NAME = 1;
const LOCK_SCOPE_EVENT_NAME = 2;

export const EVENT_DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

async function lockName(
  tx: Prisma.TransactionClient,
  scope: number,
  name: string
): Promise<void> {
  const key = name.trim().toLowerCase();
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${scope}::int4, hashtext(${key}))`;
}

export async function lockAthleteName(
  tx: Prisma.TransactionClient,
  name: string
): Promise<void> {
  await lockName(tx, LOCK_SCOPE_ATHLETE_NAME, name);
}

export async function lockEventName(
  tx: Prisma.TransactionClient,
  name: string
): Promise<void> {
  await lockName(tx, LOCK_SCOPE_EVENT_NAME, name);
}

/**
 * Another athlete with the same name (case-insensitive), if any
 */
export function findAthleteWithName(
  tx: Prisma.TransactionClient,
  name: string,
  excludeId?: string
) {
  return tx.athlete.findFirst({
    where: {
      ...(excludeId && { id: { not: excludeId } }),
      name: { equals: name, mode: "insensitive" },
    },
    select: { id: true, name: true },
  });
}

/**
 * Another event with the same name (case-insensitive) within a day of date
 */
export function findDuplicateEvent(
  tx: Prisma.TransactionClient,
  name: string,
  date: Date,
  excludeId?: string
) {
  return tx.event.findFirst({
    where: {
      ...(excludeId && { id: { not: excludeId } }),
      name: { equals: name, mode: "insensitive" },
      date: {
        gte: new Date(date.getTime() - EVENT_DUPLICATE_WINDOW_MS),
        lte: new Date(date.getTime() + EVENT_DUPLICATE_WINDOW_MS),
      },
    },
    select: { id: true, name: true, date: true },
  });
}
