import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

const allowedOrigins = process.env.NODE_ENV === 'development'
  ? ['http://localhost:3000']
  : ['https://www.fightembedded.com'];

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
