import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

// Trust both apex and www — metadata/sitemap use apex, auth client may hit www.
const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:3000"]
    : [
        "https://www.fightembedded.com",
        "https://fightembedded.com",
      ];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    allowSignUp: false,
  },
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});
