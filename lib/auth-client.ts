import { createAuthClient } from "better-auth/react";

const isDevelopment = process.env.NODE_ENV === 'development';

export const authClient = createAuthClient({
  baseURL: isDevelopment 
    ? 'http://localhost:3000'
    : 'https://fightembedded.com',
});