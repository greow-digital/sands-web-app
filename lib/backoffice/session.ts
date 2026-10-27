/*
  Enkel inloggning till backofficet.

  Användarna ligger i BACKOFFICE_ANVANDARE som "Namn:lösenord", flera
  separerade med kommatecken. Namnet står sedan i loggen på varje ändring.
  Sessionen är en signerad kaka (HMAC med BACKOFFICE_SESSION_SECRET) som
  gäller i 30 dagar. Byts hemligheten loggas alla ut.

  Tills vidare krävs inloggning bara i Vercel Production. Överallt annars
  (Preview och lokalt) släpps alla in utan lösenord, och loggen får namnet
  i BACKOFFICE_UTAN_INLOGGNING, eller "Test". Previewn skyddas då bara av
  Vercels egen inloggning.
*/
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { demolage } from "./ark";

const KAKA = "sands_bo";
const GILTIG_DAGAR = 30;

function hemlighet(): string {
  const s = process.env.BACKOFFICE_SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (demolage()) return "demo-hemlighet-som-bara-galler-lokalt-0000";
  throw new Error("BACKOFFICE_SESSION_SECRET saknas eller är kortare än 32 tecken");
}

const DEMO_LOSEN = "demo-losen";

/** Lösenordet i demoläget, eller null när demoläget är av eller riktiga användare finns. */
export function demoLosen(): string | null {
  return demolage() && anvandare()[0]?.losen === DEMO_LOSEN ? DEMO_LOSEN : null;
}

function anvandare(): { namn: string; losen: string }[] {
  // Citattecken runt hela värdet och mellanslag runt kolon följer lätt med
  // när värdet klistras in i Vercel. De tas bort så att inloggningen ändå går.
  const lista = (process.env.BACKOFFICE_ANVANDARE ?? "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const i = p.indexOf(":");
      return { namn: p.slice(0, i).trim(), losen: p.slice(i + 1).trim() };
    })
    .filter((a) => a.namn && a.losen.length >= 8);
  if (!lista.length && demolage()) return [{ namn: "Demo", losen: DEMO_LOSEN }];
  return lista;
}

function lika(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function signera(data: string) {
  return createHmac("sha256", hemlighet()).update(data).digest("base64url");
}

/** Visas på inloggningssidan när ingen kan logga in alls. */
export function saknarAnvandare(): boolean {
  return anvandare().length === 0;
}

/** Namnet på användaren om lösenordet stämmer. */
export function kontrollera(losen: string): string | null {
  losen = losen.trim();
  // Jämför mot alla så att svarstiden inte avslöjar något.
  let traff: string | null = null;
  for (const a of anvandare()) if (lika(losen, a.losen)) traff = a.namn;
  return traff;
}

export async function skapaSession(namn: string) {
  const exp = Date.now() + GILTIG_DAGAR * 864e5;
  const data = Buffer.from(JSON.stringify({ n: namn, exp })).toString("base64url");
  (await cookies()).set(KAKA, `${data}.${signera(data)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: GILTIG_DAGAR * 86400,
  });
}

export async function avslutaSession() {
  (await cookies()).delete({ name: KAKA, path: "/admin" });
}

/** Namnet som används när inloggningen är avslagen, null i Production. */
export function utanInloggning(): string | null {
  if (process.env.VERCEL_ENV === "production") return null;
  return process.env.BACKOFFICE_UTAN_INLOGGNING?.replace(/[·,:]/g, "").trim() || "Test";
}

/** Inloggad användares namn, eller null. */
export async function inloggad(): Promise<string | null> {
  // Demoläget visar bara påhittad data, så där behövs ingen inloggning.
  if (demoLosen()) return "Demo";
  const utan = utanInloggning();
  if (utan) return utan;
  const varde = (await cookies()).get(KAKA)?.value;
  if (!varde) return null;
  const [data, sig] = varde.split(".");
  if (!data || !sig || !lika(sig, signera(data))) return null;
  try {
    const { n, exp } = JSON.parse(Buffer.from(data, "base64url").toString());
    if (typeof n !== "string" || typeof exp !== "number" || exp < Date.now()) return null;
    // Användaren kan ha tagits bort ur BACKOFFICE_ANVANDARE sedan inloggningen.
    return anvandare().some((a) => a.namn === n) ? n : null;
  } catch {
    return null;
  }
}

/** För sidor och server actions. Skickar till inloggningen om ingen session finns. */
export async function kravInloggning(): Promise<string> {
  const namn = await inloggad();
  if (!namn) redirect("/admin/logga-in");
  return namn;
}
