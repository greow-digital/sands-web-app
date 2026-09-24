"use client";

function getSeasonMessage(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 3) {
    return "Våren är bästa tiden för takbyte, boka takkontroll nu för att säkra plats i sommar";
  }
  if (month >= 4 && month <= 7) {
    const summerMessages = [
      // May, säsongen startar, öppen tonalitet
      "Sommarsäsongen är igång, boka kostnadsfri takkontroll och få offert inom 24h",
      // June, kalendern börjar fyllas, mjuk urgency
      "Sommarens kalender börjar fyllas, boka takkontroll så får du snabb start",
      // July, full högsäsong, stark scarcity
      "Få lediga sommartider kvar, boka takkontroll innan vi blir fullbokade",
      // August, pivot mot höst innan säsongen är slut
      "Sommaren går mot sitt slut, boka takkontroll så säkrar vi hösttider åt dig",
    ];
    return summerMessages[month - 4];
  }
  if (month >= 8 && month <= 10) {
    const hostMessages = [
      // September, hösten är här, inte på väg
      "Hösten är här, boka kostnadsfri takkontroll så hinner taket bli klart före vintern",
      // Oktober, sista månaden med pålitligt läggväder
      "Sista månaderna med bra läggväder, boka takkontroll medan hösten håller",
      // November, vänd blicken mot våren i stället för att lova höstjobb
      "Planera takbytet till våren, boka kostnadsfri takkontroll redan nu",
    ];
    return hostMessages[month - 8];
  }
  return "Planera ditt takbyte i tid, boka kostnadsfri takkontroll nu så är du redo till våren.";
}

export default function SeasonBanner() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm mb-6"
      /*
        Plattan är mörk och nästan täckande, inte en svag blå slöja. Tidigare
        låg 15 procents blått ovanpå fotot, vilket gjorde läsbarheten helt
        beroende av vad som råkade ligga bakom. Mot ett soligt tegeltak blev
        texten svagast i hela heron.

        Nu bär plattan sin egen bakgrund, så kontrasten är densamma oavsett
        vilken hero-bild som används. Blått finns kvar i ram och prick så
        pillret fortfarande läses som ett varumärkeselement.
      */
      style={{
        backgroundColor: "rgba(8,20,42,0.62)",
        border: "1px solid rgba(96,150,255,0.45)",
        color: "#D3E2FF",
      }}
    >
      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--color-primary)" }}
      />
      {getSeasonMessage()}
    </div>
  );
}
