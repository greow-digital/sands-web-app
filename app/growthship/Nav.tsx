"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/growthship", title: "Overview", desc: "Morgonbriefen", exact: true },
  { href: "/growthship/bridge", title: "The Bridge", desc: "Förstå läget", exact: false },
  { href: "/growthship/radar", title: "The Radar", desc: "Hitta möjligheter", exact: false },
  { href: "/growthship/launchpad", title: "The Launchpad", desc: "Gör till handling", exact: false },
  { href: "/growthship/engine-room", title: "The Engine Room", desc: "Bygg & automatisera", exact: false },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="gs-nav">
      <div className="gs-nav-brand">The Growthship</div>
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className="gs-nav-link" data-active={active}>
            <span className="gs-nav-link-title">{link.title}</span>
            <span className="gs-nav-link-desc">{link.desc}</span>
          </Link>
        );
      })}
    </nav>
  );
}
