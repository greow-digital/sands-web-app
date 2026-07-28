import { NextResponse } from "next/server";

// Hämtar en autentiserad signed URL för voice-agenten server-side, så att
// ElevenLabs-API-nyckeln aldrig exponeras i klienten. Vi använder websocket-
// transporten (signed URL) istället för webrtc, eftersom WebRTC/LiveKit kräver
// UDP som ofta blockeras i nätverksmiljöer (createOffer failar då). Klienten
// (VoiceSession) hämtar url:en härifrån och startar websocket-sessionen med den.

export const runtime = "edge";
export const dynamic = "force-dynamic";

const AGENT_ID = "agent_6001kykxzdsqfhnafwc9hp5z535s";

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("ELEVENLABS_API_KEY saknas");
    return NextResponse.json(
      { error: "Röstagenten är inte konfigurerad" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`,
      { headers: { "xi-api-key": apiKey }, cache: "no-store" }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Signed URL icke-OK:", res.status, detail);
      return NextResponse.json(
        { error: "Kunde inte hämta röst-url" },
        { status: 502 }
      );
    }
    const data = (await res.json()) as { signed_url?: string };
    if (!data.signed_url) {
      return NextResponse.json(
        { error: "Ingen signed_url i svaret" },
        { status: 502 }
      );
    }
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (err) {
    console.error("Signed URL-fel:", err);
    return NextResponse.json(
      { error: "Kunde inte hämta röst-token" },
      { status: 502 }
    );
  }
}
