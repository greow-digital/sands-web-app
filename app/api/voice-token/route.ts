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
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${AGENT_ID}`,
      { headers: { "xi-api-key": apiKey }, cache: "no-store" }
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Token-hämtning icke-OK:", res.status, detail);
      return NextResponse.json(
        { error: "Kunde inte hämta röst-token" },
        { status: 502 }
      );
    }
    const data = (await res.json()) as { token?: string };
    if (!data.token) {
      return NextResponse.json(
        { error: "Ingen token i svaret" },
        { status: 502 }
      );
    }
    return NextResponse.json({ token: data.token });
  } catch (err) {
    console.error("Token-fel:", err);
    return NextResponse.json(
      { error: "Kunde inte hämta röst-token" },
      { status: 502 }
    );
  }
}
