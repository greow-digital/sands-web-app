// Single shared-password gate. Growthship is a one-user MVP, so there is
// no account system, just a cookie proving the visitor typed the right
// password. Uses Web Crypto (not node:crypto) so the same code runs in
// the Edge middleware and in route handlers.

export const SESSION_COOKIE = "gs_session";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The cookie value a correct login should produce. */
export async function expectedSessionToken(): Promise<string | null> {
  const password = process.env.GROWTHSHIP_PASSWORD;
  if (!password) return null;
  return sha256Hex(`growthship:${password}`);
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const password = process.env.GROWTHSHIP_PASSWORD;
  if (!password) return false;
  return candidate === password;
}

/**
 * Whether a request cookie value proves the visitor is authorized.
 * With no GROWTHSHIP_PASSWORD configured, Growthship is only reachable
 * outside production, so a local `npm run dev` still works without setup.
 */
export async function isAuthorized(cookieValue: string | undefined): Promise<boolean> {
  const expected = await expectedSessionToken();
  if (!expected) return process.env.NODE_ENV !== "production";
  return cookieValue === expected;
}
