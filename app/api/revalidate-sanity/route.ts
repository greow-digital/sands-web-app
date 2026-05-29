import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Sanity webhook target. Konfigurera i Sanity Manage → API → Webhooks
 * med:
 *   - URL: https://www.sandsab.se/api/revalidate-sanity
 *   - Trigger on: Create, Update, Delete
 *   - Filter (GROQ): _type == "projekt"
 *   - Secret: matchande SANITY_REVALIDATE_SECRET i Vercel env
 *
 * Vi använder next-sanity webhook-helpern som verifierar signaturen
 * mot secret för att förhindra spoofade requests. Vid match
 * revaliderar vi alla sidor som kan rendera projekt-data.
 */

type SanityWebhookBody = {
  _type?: string;
  slug?: { current?: string };
  ort?: string;
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 500 }
    );
  }

  let body: SanityWebhookBody;
  let isValidSignature: boolean;
  try {
    const parsed = await parseBody<SanityWebhookBody>(req, secret);
    body = parsed.body ?? {};
    isValidSignature = parsed.isValidSignature ?? false;
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid webhook payload", details: String(err) },
      { status: 400 }
    );
  }

  if (!isValidSignature) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  if (body._type !== "projekt") {
    return NextResponse.json({ ignored: true, type: body._type });
  }

  // Alla sidor som kan rendera projekt-data
  revalidatePath("/projekt");
  revalidatePath("/projekt/[slug]", "page");
  revalidatePath("/omraden/[slug]", "page");
  revalidatePath("/basta-taklaggare-stockholm");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    revalidated: true,
    type: body._type,
    slug: body.slug?.current ?? null,
    now: Date.now(),
  });
}
