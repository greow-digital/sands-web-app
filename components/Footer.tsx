import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const tjänsterLinks = [
  { href: "/tjanster/taklaggning", label: "Takläggning" },
  { href: "/tjanster/tegeltak", label: "Tegeltak" },
  { href: "/tjanster/betongtak", label: "Betongtak" },
  { href: "/tjanster/plattak", label: "Plåttak" },
  { href: "/tjanster/papptak", label: "Papptak" },
  { href: "/tjanster/eternittak", label: "Eternittak" },
];

const områdenLinks = [
  { href: "/omraden/stockholm", label: "Stockholm" },
  { href: "/omraden/taby", label: "Täby" },
  { href: "/omraden/nacka", label: "Nacka" },
  { href: "/omraden/jarfalla", label: "Järfälla" },
  { href: "/omraden/huddinge", label: "Huddinge" },
  { href: "/omraden", label: "Alla områden →" },
];

const omOssLinks = [
  { href: "/om-oss", label: "Om Sands" },
  { href: "/projekt", label: "Projekt" },
  { href: "/omdomen", label: "Omdömen" },
  { href: "/faq", label: "FAQ" },
  { href: "/blogg", label: "Blogg" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--color-dark)", color: "white" }}>
      {/* Karta + kontaktinfo */}
      <div className="border-b border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-stretch">
            {/* Google Maps */}
            <div className="rounded-2xl overflow-hidden h-[280px] lg:h-auto lg:min-h-[320px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2031.035199725121!2d17.841366677071356!3d59.39912520543202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f9f9b45658faf%3A0x459732f28abbf9ae!2zU3BqdXR2w6RnZW4gNUEsIDE3NSA2MSBKw6RyZsOkbGxh!5e0!3m2!1sen!2sse!4v1776412905017!5m2!1sen!2sse"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 280 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sands Entreprenad kontor — Spjutvägen 5A, Järfälla"
              />
            </div>

            {/* Kontaktinfo */}
            <div className="flex flex-col justify-center">
              <h2
                className="text-2xl lg:text-3xl font-extrabold mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Hitta till oss
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                    Adress
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Spjutv%C3%A4gen+5A,+175+61+J%C3%A4rf%C3%A4lla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-gray-200 hover:text-white transition-colors"
                  >
                    <MapPin size={15} className="mt-0.5 shrink-0" />
                    <span>
                      Spjutvägen 5A<br />
                      175 61 Järfälla
                    </span>
                  </a>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                    Telefon
                  </div>
                  <a
                    href="tel:0828388"
                    className="flex items-center gap-2 text-xl font-bold text-white hover:text-[#2B74FC] transition-colors"
                  >
                    <Phone size={16} />
                    08-28 38 88
                  </a>
                </div>
                <div>
                  <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                    E-post
                  </div>
                  <a
                    href="mailto:info@sandsab.se"
                    className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors"
                  >
                    <Mail size={15} />
                    info@sandsab.se
                  </a>
                </div>
                <div className="pt-2">
                  <p className="text-gray-500 text-xs">
                    Sands Entreprenad Stockholm AB · Org.nr: 559063-8135
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Kolumn 1: Logo + kontakt */}
          <div>
            <Link href="/" className="inline-block mb-5" aria-label="Sands Entreprenad – startsida">
              <Image
                src="/images/logo-sandsentreprenad.svg"
                alt="Sands Entreprenad"
                width={337}
                height={44}
                className="h-8 w-auto invert brightness-200"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Sands Entreprenad Stockholm AB
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500" />
                <span>Spjutvägen 5A, 175 61 Järfälla</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-gray-500" />
                <a
                  href="mailto:info@sandsab.se"
                  className="hover:text-white transition-colors"
                >
                  info@sandsab.se
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-gray-500" />
                <a
                  href="tel:0828388"
                  className="hover:text-white transition-colors font-semibold"
                >
                  08-28 38 88
                </a>
              </div>
              <p className="text-gray-500 text-xs pt-1">
                Org.nr: 559063-8135
              </p>
            </div>
          </div>

          {/* Kolumn 2: Tjänster */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tjänster
            </h3>
            <ul className="space-y-2">
              {tjänsterLinks.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumn 3: Områden */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Områden
            </h3>
            <ul className="space-y-2">
              {områdenLinks.map((o) => (
                <li key={o.href}>
                  <Link
                    href={o.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumn 4: Om oss */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Om oss
            </h3>
            <ul className="space-y-2">
              {omOssLinks.map((o) => (
                <li key={o.href}>
                  <Link
                    href={o.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {o.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm">
            <Image
              src="/images/monier-tatt-tak.jpg"
              alt="Monier Tätt tak-garanti"
              width={100}
              height={140}
              className="h-12 w-auto rounded-sm bg-white p-1"
            />
            {[
              "F-skattsedel",
              "Fullförsäkrade",
              "Monier Takpartner",
              "BraByggare 4.8 ★",
            ].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-gray-300"
              >
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  ✓
                </span>
                {badge}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Sands Entreprenad Stockholm AB
          </p>
        </div>
      </div>
    </footer>
  );
}
