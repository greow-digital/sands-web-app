"use client";

function getSeasonMessage(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 3) {
    return "Våren är bästa tiden för takbyte, boka takkontroll nu för att säkra plats i sommar";
  }
  if (month >= 4 && month <= 7) {
    const summerMessages = [
      // May — säsongen startar, öppen tonalitet
      "Sommarsäsongen är igång, boka kostnadsfri takkontroll och få offert inom 24h",
      // June — kalendern börjar fyllas, mjuk urgency
      "Sommarens kalender börjar fyllas, boka takkontroll så får du snabb start",
      // July — full högsäsong, stark scarcity
      "Få lediga sommartider kvar, boka takkontroll innan vi blir fullbokade",
      // August — pivot mot höst innan säsongen är slut
      "Sommaren går mot sitt slut, boka takkontroll så säkrar vi hösttider åt dig",
    ];
    return summerMessages[month - 4];
  }
  if (month >= 8 && month <= 10) {
    return "Hösten närmar sig, se till att ditt tak är klart innan vintern. Boka takkontroll nu.";
  }
  return "Planera ditt takbyte i tid, boka kostnadsfri takkontroll nu så är du redo till våren.";
}

export default function SeasonBanner() {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm mb-6"
      style={{
        backgroundColor: "rgba(43,116,252,0.15)",
        border: "1px solid rgba(43,116,252,0.3)",
        color: "#93B8FD",
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
