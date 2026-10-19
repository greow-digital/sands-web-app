/**
 * Takform-illustrationer, rena linje-SVG:er. Flyttade ur taktestet när det
 * slogs ihop med priskalkylatorn till offertflödet.
 */
export default function RoofSvg({ shape }: { shape: string }) {
  const common = {
    width: 72,
    height: 56,
    viewBox: "0 0 72 56",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  const body = <path d="M14 54V30h44v24" />;
  switch (shape) {
    case "sadel":
      return (
        <svg {...common}>
          {body}
          <path d="M8 30 36 10l28 20" />
        </svg>
      );
    case "valmat":
      return (
        <svg {...common}>
          {body}
          <path d="M8 30 24 12h24l16 18" />
          <path d="M24 12 36 30 48 12" />
        </svg>
      );
    case "pulpet":
      return (
        <svg {...common}>
          {body}
          <path d="M10 30 62 14" />
        </svg>
      );
    case "mansard":
      return (
        <svg {...common}>
          {body}
          <path d="M10 30 20 18h32l10 12" />
          <path d="M20 18 36 8l16 10" />
        </svg>
      );
    default: // platt / annan
      return (
        <svg {...common}>
          {body}
          <path d="M10 30h52" />
        </svg>
      );
  }
}
