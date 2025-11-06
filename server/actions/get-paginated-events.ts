"use server";

import prisma from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";
import { Prisma } from "@prisma/client";

const eventSelect = {
  id: true,
  name: true,
  date: true,
  venue: true,
  location: true,
  mainEvent: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getPaginatedEvents(params: {
  page: number;
  pageSize: number;
  q?: string;
  view?: string;
  sort?: string;
  columnFilters?: { id: string; value: string[] }[];
}) {
  "use cache";
  cacheLife("hours");
  cacheTag("paginated-events");

  const { page, pageSize, q, view, sort, columnFilters } = params;

  const where: Prisma.EventWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { venue: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
      { mainEvent: { contains: q, mode: "insensitive" } },
    ];
  }

  const statusFilter = columnFilters?.find(
    (filter) => filter.id === "status"
  );

  if (statusFilter && statusFilter.value.length > 0) {
    where.status = {
      in: statusFilter.value as ("UPCOMING" | "COMPLETED" | "CANCELLED")[],
    };
  } else if (view === "upcoming") {
    where.status = "UPCOMING";
  } else if (view === "completed") {
    where.status = "COMPLETED";
  } else if (view === "cancelled") {
    where.status = "CANCELLED";
  }

  const sortOrder = sort?.split(".")?.[1] || "desc";
  const sortColumn = sort?.split(".")?.[0] || "date";

  let orderBy: Prisma.EventOrderByWithRelationInput;

  // Use explicit sorting instead of dynamic keys to avoid Prisma issues
  switch (sortColumn) {
    case "name":
      orderBy = { name: sortOrder as "asc" | "desc" };
      break;
    case "date":
      orderBy = { date: sortOrder as "asc" | "desc" };
      break;
    case "venue":
      orderBy = { venue: sortOrder as "asc" | "desc" };
      break;
    case "location":
      orderBy = { location: sortOrder as "asc" | "desc" };
      break;
    case "mainEvent":
      orderBy = { mainEvent: sortOrder as "asc" | "desc" };
      break;
    case "status":
      orderBy = { status: sortOrder as "asc" | "desc" };
      break;
    default:
      orderBy = { date: "desc" };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      select: eventSelect,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total };
}
