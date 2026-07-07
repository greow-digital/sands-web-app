"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

// "Personlig service"-kontakt-popup. Visas vid inaktivitet eller
// exit-intent, med strikta spärregler så den inte stör återkommande
// besökare eller någon som redan konverterat.

const EXCLUDED = ["/offert", "/tack", "/integritetspolicy"];
const MIN_TIME_MS = 20000; // aldrig före 20 sek total sidtid
const SHOW_AFTER_MS = 35000; // visas efter 35 sek total sidtid (oavsett aktivitet)
const MAX_PER_30D = 2;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const SESSION_SHOWN = "sands_popup_shown";
const SHOWS_KEY = "sands_popup_shows"; // localStorage: array av timestamps

type GtagFn = (event: string, name: string, params: object) => void;

function fireGtag(name: string, params: object = {}) {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  (window as unknown as { gtag: GtagFn }).gtag("event", name, params);
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function parseGcl(name: string): string | undefined {
  const raw = getCookie(name);
  if (!raw) return undefined;
  const parts = raw.split(".");
  return parts.length >= 3 ? parts.slice(2).join(".") : undefined;
}

function clickId(our: string, gtag: string): string | undefined {
  return getCookie(our) || parseGcl(gtag);
}

function recentShowCount(): number {
  try {
    const raw = localStorage.getItem(SHOWS_KEY);
    if (!raw) return 0;
    const arr: number[] = JSON.parse(raw);
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    return arr.filter((t) => t > cutoff).length;
  } catch {
    return 0;
  }
}

function recordShow() {
  try {
    const raw = localStorage.getItem(SHOWS_KEY);
    const arr: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const next = arr.filter((t) => t > cutoff);
    next.push(Date.now());
    localStorage.setItem(SHOWS_KEY, JSON.stringify(next));
    sessionStorage.setItem(SESSION_SHOWN, "1");
  } catch {
    // storage blockerat: visas inte igen i denna vy ändå (shownRef)
  }
}

export default function ExitPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shownRef = useRef(false);
  const startedRef = useRef(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const excluded = EXCLUDED.includes(pathname);

  const show = useCallback(() => {
    if (shownRef.current) return;
    // Koordinering med taktest-widgeten: visa inte popupen medan chatt-
    // widgeten är öppen (undviker två överlappande dialoger).
    if (
      typeof window !== "undefined" &&
      (window as unknown as { __sandsWidgetOpen?: boolean }).__sandsWidgetOpen
    )
      return;
    shownRef.current = true;
    recordShow();
    setOpen(true);
    fireGtag("popup_view", { form_id: "popup" });
  }, []);

  const close = useCallback(
    (reason: "dismiss" | "success") => {
      if (reason === "dismiss" && !success) {
        fireGtag("popup_dismiss", { form_id: "popup" });
      }
      setOpen(false);
    },
    [success]
  );

  // Trigger-logik: inaktivitet eller exit-intent, med spärrar.
  useEffect(() => {
    if (excluded) return;
    // Suppression-kontroller
    if (getCookie("sands_submitted")) return;
    try {
      if (sessionStorage.getItem(SESSION_SHOWN)) return;
      // Taktest genomfört i sessionen: besökaren har redan fått en
      // lead-möjlighet via widgeten, trigga inte exit-popupen ovanpå.
      if (sessionStorage.getItem("sands_taktest_done")) return;
    } catch {
      // ignore
    }
    if (recentShowCount() >= MAX_PER_30D) return;

    const pageStart = Date.now();

    const eligible = () =>
      !shownRef.current && Date.now() - pageStart >= MIN_TIME_MS;

    const trigger = () => {
      if (eligible()) show();
    };

    // Visas efter 35 sek total sidtid, oavsett om besökaren är aktiv.
    const timer = setTimeout(trigger, SHOW_AFTER_MS);

    // Exit-intent endast på desktop (fin pekare).
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    if (isDesktop) document.addEventListener("mouseout", onMouseOut);

    return () => {
      clearTimeout(timer);
      if (isDesktop) document.removeEventListener("mouseout", onMouseOut);
    };
  }, [excluded, show]);

  // ESC stänger
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close("dismiss");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  function onFirstFocus() {
    if (startedRef.current) return;
    startedRef.current = true;
    fireGtag("form_start", {
      event_category: "engagement",
      event_label: "leadform",
      form_id: "popup",
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = emailRef.current?.value.trim() || "";
    const phone = phoneRef.current?.value.trim() || "";
    if (!email && !phone) {
      setError("Fyll i e-post eller telefonnummer");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Popup-kontakt",
          email,
          phone,
          formId: "popup",
          tag: "popup/kontakt",
          source: "popup/kontakt",
          message: "Inaktivitets-popup: vill bli kontaktad",
          gclid: clickId("gclid", "_gcl_aw"),
          gbraid: clickId("gbraid", "_gcl_gb"),
          wbraid: clickId("wbraid", "_gcl_wb"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");

      // Suppression efter submit
      document.cookie =
        "sands_submitted=1; max-age=2592000; path=/; samesite=lax";

      // Eftersom popupen INTE redirectar till /tack måste konverterings-
      // eventen fyras programmatiskt här, annars missas de i
      // GA4 -> Google Ads-importen.
      const txn = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const params = {
        currency: "SEK",
        value: 1500,
        transaction_id: txn,
        form_source: "popup/kontakt",
        form_id: "popup",
      };
      fireGtag("popup_submit", { form_id: "popup" });
      fireGtag("form_submit", params);
      fireGtag("generate_lead", params);

      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => close("success"), 4000);
    } catch {
      setSubmitting(false);
      setError("Något gick fel. Försök igen eller ring 08-28 38 88.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Kontakta oss"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Stäng"
        onClick={() => close("dismiss")}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative w-full max-w-md max-h-[70vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-6 sm:p-7">
        <button
          type="button"
          onClick={() => close("dismiss")}
          aria-label="Stäng"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div
              className="text-4xl mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              ✓
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
            >
              Tack!
            </h2>
            <p className="text-sm text-gray-600">
              Vi hör av oss inom 2–4 timmar på vardagar.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-sandsentreprenad-icon.svg"
                alt="Sands Entreprenad"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
              <span
                className="text-sm font-bold"
                style={{ color: "var(--color-dark)" }}
              >
                Sands Entreprenad
              </span>
            </div>

            <h2
              className="text-xl sm:text-2xl font-extrabold tracking-[-0.02em] mb-2"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
            >
              Vi tror på personlig service
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              Lämna din e-post eller ditt telefonnummer så hör vi av oss inom
              2–4 timmar på vardagar.
            </p>

            <form onSubmit={onSubmit} onFocus={onFirstFocus} noValidate>
              <div className="space-y-3">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="E-post"
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors"
                />
                <input
                  ref={phoneRef}
                  type="tel"
                  placeholder="Telefonnummer"
                  autoComplete="tel"
                  className="w-full px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3.5 rounded-[5px] text-white font-semibold text-sm transition-colors disabled:opacity-70"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {submitting ? "Skickar..." : "Kontakta mig"}
              </button>

              <p className="text-[11px] leading-relaxed text-gray-400 text-center mt-3">
                Vi hanterar dina uppgifter enligt GDPR och delar dem aldrig med
                tredje part.{" "}
                <Link
                  href="/integritetspolicy"
                  className="underline hover:text-gray-600"
                >
                  Integritetspolicy
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
