"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

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

  // Get athlete data before deletion to check attributes
  const athlete = await prisma.athlete.findUnique({
    where: { id },
  });

  if (!athlete) {
    throw new Error("Athlete not found");
  }

  await prisma.athlete.delete({
    where: {
      id,
    },
  });

  // Revalidate cache tags
  revalidateTag("all-athletes");
  revalidateTag("athlete-by-id");
  revalidateTag("athletes-by-division");
  revalidateTag("division-athletes");

  if (athlete.rank === 1) {
    revalidateTag("champions-data");
    revalidateTag("homepage-champions");
  }

  if (athlete.losses === 0) {
    revalidateTag("undefeated-athletes");
  }

  if (athlete.retired) {
    revalidateTag("retired-athletes-data");
    revalidateTag("retired-page");
  }

  if (athlete.poundForPoundRank > 0) {
    revalidateTag("p4p-rankings-data");
    revalidateTag("homepage-p4p");
  }

  // Only revalidate homepage if athlete affects homepage sections
  if (athlete.rank === 1 || athlete.poundForPoundRank > 0) {
    revalidateTag("homepage-stats");
  }

  // Revalidate paths for dynamic routes that need it
  if (athlete.retired) {
    revalidatePath("/retired");
  }
  // Revalidate the specific division path
  const isWomen = athlete.weightDivision.startsWith("Women's");
  const divisionName = athlete.weightDivision.replace(
    /^(Women's|Men's)\s+/,
    ""
  );
  const divisionSlug = divisionName.toLowerCase().replace(/\s+/g, "-");
  const fullSlug = `${isWomen ? "women" : "men"}-${divisionSlug}`;
  revalidatePath(`/division/${fullSlug}`, "page");

  return true;
}
