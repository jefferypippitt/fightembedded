import { createAuthClient } from "better-auth/react";

// Same-origin in the browser avoids apex↔www cross-origin auth failures.
// Override with NEXT_PUBLIC_APP_URL when the auth API lives on another host.
const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
});
