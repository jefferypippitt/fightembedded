import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new UploadThingError("Unauthorized");
  return session;
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  athleteImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await handleAuth();
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Here you can add additional processing if needed
        // For example, you might want to store the image URL in your database
        return {
          uploadedBy: metadata.userId,
          url: file.ufsUrl,
          name: file.name,
          size: file.size,
        };
      } catch (err) {
        console.error("Failed to process upload:", err);
        throw new UploadThingError("Failed to process upload");
      }
    }),
  eventImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await handleAuth();
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        return {
          uploadedBy: metadata.userId,
          url: file.url,
          name: file.name,
          size: file.size,
        };
      } catch (err) {
        console.error("Failed to process upload:", err);
        throw new UploadThingError("Failed to process upload");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
