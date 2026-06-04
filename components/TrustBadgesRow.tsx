import Image from "next/image";

interface TrustBadgesRowProps {
  className?: string;
}

/**
 * Tre trust-badges som vita pills med skugga: BraByggare, Kundfavorit
 * 2025, Monier Tätt tak-garanti. Self-contained kort som funkar mot
 * vilken bakgrund som helst, inget theme-prop behövs.
 */
export default function TrustBadgesRow({
  className = "",
}: TrustBadgesRowProps) {
  return (
    <div className={`flex items-center gap-4 flex-wrap ${className}`}>
      <div className="flex items-center gap-2.5 bg-white rounded-full px-5 py-2.5 shadow-lg">
        <Image
          src="/images/brabyggare-badge.svg"
          alt="BraByggare 4.8 av 5, 54 omdömen"
          width={217}
          height={85}
          className="h-9 w-auto"
        />
      </div>
      <div className="flex items-center gap-2.5 bg-white rounded-full px-3 py-1.5 shadow-lg">
        <Image
          src="/images/kundfavorit-2025.png"
          alt="Offerta Kundfavorit 2025"
          width={200}
          height={200}
          className="h-10 w-auto"
        />
        <span
          className="text-xs font-bold pr-2 leading-tight"
          style={{ color: "var(--color-dark)" }}
        >
          Kundfavorit<br />2025
        </span>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-lg">
        <Image
          src="/images/monier-tatt-tak.jpg"
          alt="Monier Tätt tak-garanti"
          width={100}
          height={140}
          className="h-10 w-auto rounded-sm"
        />
        <span
          className="text-xs font-bold pr-2 leading-tight"
          style={{ color: "var(--color-dark)" }}
        >
          Upp till 30 års<br />garanti
        </span>
      </div>
    </div>
  );
}
