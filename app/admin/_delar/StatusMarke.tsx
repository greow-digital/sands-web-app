import { STATUS_NAMN, type Status } from "@/lib/backoffice/lead";

const FARG: Record<Status, string> = {
  ny: "bg-accent/15 text-accent",
  kontaktad: "bg-primary/10 text-primary",
  bokad: "bg-primary/10 text-primary",
  offert: "bg-amber-100 text-amber-800",
  vunnen: "bg-trust-green/15 text-trust-green",
  avslutad: "bg-trust-green/15 text-trust-green",
  forlorad: "bg-black/5 text-black/60",
  arkiverad: "bg-black/5 text-black/50",
};

export default function StatusMarke({ status }: { status: Status }) {
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${FARG[status]}`}>
      {STATUS_NAMN[status]}
    </span>
  );
}
