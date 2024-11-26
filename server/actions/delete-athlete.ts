"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function deleteAthlete(id: string) {
  await checkAuth();

  await prisma.athlete.delete({
    where: {
      id,
    },
  });

  return true;
} 