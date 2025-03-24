import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : 'https://www.fightembedded.com';

export const authClient = createAuthClient({
  baseURL,
});