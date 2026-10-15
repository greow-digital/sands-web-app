import type { Metadata } from "next";
import "./growthship.css";

export const metadata: Metadata = {
  title: { template: "%s | The Growthship", default: "The Growthship" },
  robots: { index: false, follow: false },
};

export default function GrowthshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="gs">{children}</div>;
}
