import { NextResponse, type NextRequest } from "next/server";

/*
  Sökordsstyrd landningssida (beslut 19 okt 2026).

  Annonserna kan skicka med vilket av kontots sökord som matchade, via
  slutlig URL-suffix "kw={keyword}". Här översätts sökordet till rätt
  variant av /lp, så att rubrik och förval i frågeflödet speglar det.
  Varianterna är statiska sidor, så det här är en rewrite och ingen
  rendering per besök. Adressen i webbläsaren ändras inte.

  OBS: Google skickar sökordet i kontot, inte det besökaren skrev. Ett brett
  sökord som "takläggare" ger alltid takläggarvarianten, oavsett sökning.
  Styrningen gör därför mest nytta när annonsgrupperna har egna sökord per
  tema (takbyte, lägga om tak och så vidare).

  Slugsen måste finnas i VARIANTER i app/lp/[variant]/page.tsx. Logiken
  ligger här och inte i en delad modul, eftersom proxy ska kunna köras
  separat från resten av appen.
*/

const REGLER: [RegExp, string][] = [
  [/l[äa]gga nytt|nytt tak/, "nytt-tak"],
  [/takoml[äa]ggning|oml[äa]ggning/, "takomlaggning"],
  [/l[äa]gga om/, "lagga-om-tak"],
  [/byta tak|byta taket|byte av tak/, "byta-tak"],
  [/takbyte/, "takbyte"],
  [/takfirm|takf[öo]retag/, "takfirma"],
  [/takl[äa]ggare|takl[äa]ggning/, "taklaggare"],
];

function varianterForSokord(kw: string): string | undefined {
  const s = kw.toLowerCase().replace(/[+"[\]]/g, " ").replace(/\s+/g, " ").trim();
  return REGLER.find(([re]) => re.test(s))?.[1];
}

export function proxy(request: NextRequest) {
  const kw = request.nextUrl.searchParams.get("kw");
  if (!kw) return NextResponse.next();

  const variant = varianterForSokord(kw);
  const nuvarande = request.nextUrl.pathname.split("/")[2];
  if (!variant || variant === nuvarande) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/lp/${variant}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/lp/:path*",
};
