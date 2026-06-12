"use client";

import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { Phone } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

type FormData = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
};

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Google gtag stores click IDs as: _gcl_aw / _gcl_gb / _gcl_wb
// Format: "GCL.<timestamp>.<clickId>", we want the click ID part.
function parseGclCookie(name: string): string | undefined {
  const raw = getCookie(name);
  if (!raw) return undefined;
  const parts = raw.split(".");
  return parts.length >= 3 ? parts.slice(2).join(".") : undefined;
}

function getClickId(ourCookie: string, gtagCookie: string): string | undefined {
  return getCookie(ourCookie) || parseGclCookie(gtagCookie);
}

interface LeadFormProps {
  variant?: "hero" | "section";
  /** Identifierar formulärinstansen i GA4 (form_start/field/submit). */
  formId?: string;
  /** "minimal" = endast Namn + Telefon (för kalkylator-bron). */
  fields?: "full" | "minimal";
  /** Extra data som följer med i leadens payload, t.ex. taktyp + yta. */
  extraPayload?: Record<string, string | undefined>;
  /** Override för submit-knappens text. */
  ctaText?: string;
  /** Dölj formulärets egen rubrik (när omslaget redan har en). */
  hideHeader?: boolean;
  /** Liten bekräftelserad ovanför fälten, t.ex. "Gäller: betongpannor, ca 150 m²". */
  confirmation?: string;
  /** "Prisförslaget är kostnadsfritt och inte bindande." under knappen. */
  notBindingNote?: boolean;
  /** GDPR-rad med länk till integritetspolicy. */
  privacyNote?: boolean;
  /** Körs efter lyckad submit, innan redirect (t.ex. för calc_bridge_submit). */
  onSubmitSuccess?: () => void;
}

export default function LeadForm({
  variant = "hero",
  formId = "offert",
  fields = "full",
  extraPayload,
  ctaText,
  hideHeader = false,
  confirmation,
  notBindingNote = false,
  privacyNote = false,
  onSubmitSuccess,
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const [submitted, setSubmitted] = useState(false);

  // Field-by-field tracking: fire form_field_complete för varje fält
  // när det förlorar fokus med ett ifyllt värde. completedFields-ref
  // ser till att samma fält bara räknas en gång per session — om
  // användaren redigerar och blurrar igen registreras det inte två
  // gånger. Identifierar var användare droppar av i formuläret.
  const completedFields = useRef(new Set<string>());

  // form_start: fyras en gång när användaren först interagerar med
  // formuläret (fokuserar valfritt fält). Markerar toppen av
  // formulär-funneln i GA4, så drop-off mellan start och submit kan mätas.
  const formStarted = useRef(false);

  function fireEvent(name: string, params: object) {
    if (typeof window === "undefined" || !("gtag" in window)) return;
    const w = window as unknown as {
      gtag: (event: string, name: string, params: object) => void;
    };
    w.gtag("event", name, {
      event_category: "engagement",
      event_label: "leadform",
      form_id: formId,
      form_variant: variant,
      ...params,
    });
  }

  function fireFormStart() {
    if (formStarted.current) return;
    formStarted.current = true;
    fireEvent("form_start", {});
  }

  function fireFieldComplete(fieldName: string) {
    if (completedFields.current.has(fieldName)) return;
    completedFields.current.add(fieldName);
    fireEvent("form_field_complete", { field_name: fieldName });
  }

  function trackField(
    fieldName: string,
    reg: UseFormRegisterReturn
  ): UseFormRegisterReturn {
    const originalOnBlur = reg.onBlur;
    return {
      ...reg,
      onBlur: async (e) => {
        const result = await originalOnBlur(e);
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (target.value?.trim()) fireFieldComplete(fieldName);
        return result;
      },
    };
  }

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          ...extraPayload,
          formId,
          source:
            typeof window !== "undefined"
              ? window.location.pathname
              : "sandsab.se",
          gclid: getClickId("gclid", "_gcl_aw"),
          gbraid: getClickId("gbraid", "_gcl_gb"),
          wbraid: getClickId("wbraid", "_gcl_wb"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");

      setSubmitted(true);
      reset();
      onSubmitSuccess?.();

      // Generera unikt transaction_id för konverteringen och spara i
      // sessionStorage. /tack-sidan läser samma id, så refresh på /tack
      // räknas som SAMMA konvertering (Google deduplicerar på matching
      // transaction_id). Ny formulär-submit ger nytt id automatiskt
      // eftersom sessionStorage skrivs över här.
      if (typeof window !== "undefined") {
        const txn = `lead_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 9)}`;
        try {
          sessionStorage.setItem("sands_lead_txn", txn);
          // Source-tracking: /tack laser denna och skickar med pa
          // form_submit + generate_lead - sa vi kan i GA4 se vilken
          // yta som driver konverteringar (hero vs offert-sida).
          sessionStorage.setItem("sands_lead_source", window.location.pathname);
          sessionStorage.setItem("sands_lead_variant", variant);
          sessionStorage.setItem("sands_lead_formid", formId);
        } catch {
          // sessionStorage kan vara blockerat (privat läge etc).
          // /tack faller då tillbaka på client-side-genererat id.
        }
      }
      window.location.href = "/tack";
    } catch {
      alert(
        "Något gick fel. Försök igen eller ring oss direkt på 08-28 38 88."
      );
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-[10px] shadow-lg p-8 text-center">
        <div
          className="text-4xl mb-3"
          style={{ color: "var(--color-primary)" }}
        >
          ✓
        </div>
        <h3
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Tack! Vi återkommer inom 24h.
        </h3>
        <p className="text-gray-600 text-sm">
          Du kan även nå oss direkt på{" "}
          <a href="tel:08283888" className="font-semibold text-[#2B74FC]">
            08-28 38 88
          </a>
        </p>
      </div>
    );
  }

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors ${
      hasError
        ? "border-red-400 bg-red-50"
        : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"
    }`;
  const labelCls = "block text-xs font-semibold mb-1";
  const labelStyle = {
    color: "var(--color-primary)",
    fontFamily: "var(--font-body)",
  };

  return (
    <div
      className={`bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-gray-100 ${
        variant === "hero" ? "p-7 lg:p-9" : "p-5 sm:p-7 lg:p-8"
      }`}
    >
      {!hideHeader && (
        <div className="mb-6">
          <p
            className="text-xs font-semibold uppercase tracking-[0.15em] mb-2"
            style={{ color: "var(--color-primary)" }}
          >
            Kostnadsfri takkontroll
          </p>
          <h2
            className="text-2xl lg:text-[28px] font-extrabold leading-tight tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-dark)",
            }}
          >
            Få prisförslag på ditt tak
          </h2>
        </div>
      )}

      {confirmation && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F1F4F7] px-3 py-1.5 text-xs font-medium text-gray-600">
          {confirmation}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        onFocus={fireFormStart}
        className="space-y-4"
        noValidate
      >
        {/* Namn */}
        <div>
          <label className={labelCls} style={labelStyle}>
            Namn *
          </label>
          <input
            type="text"
            placeholder="Ditt namn"
            className={inputCls(Boolean(errors.name))}
            {...trackField(
              "name",
              register("name", { required: "Ange ditt namn" })
            )}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {fields === "minimal" ? (
          /* Telefon (eget fält i minimal-läge) */
          <div>
            <label className={labelCls} style={labelStyle}>
              Telefon *
            </label>
            <input
              type="tel"
              placeholder="070-000 00 00"
              className={inputCls(Boolean(errors.phone))}
              {...trackField(
                "phone",
                register("phone", {
                  required: "Ange telefonnummer",
                  pattern: {
                    value: /^[0-9+\s\-]{7,}$/,
                    message: "Ogiltigt nummer",
                  },
                })
              )}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
        ) : (
          <>
            {/* Telefon + E-post */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} style={labelStyle}>
                  Telefon *
                </label>
                <input
                  type="tel"
                  placeholder="070-000 00 00"
                  className={inputCls(Boolean(errors.phone))}
                  {...trackField(
                    "phone",
                    register("phone", {
                      required: "Ange telefonnummer",
                      pattern: {
                        value: /^[0-9+\s\-]{7,}$/,
                        message: "Ogiltigt nummer",
                      },
                    })
                  )}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>
                  E-post{" "}
                  <span className="text-gray-400 font-normal">(valfritt)</span>
                </label>
                <input
                  type="email"
                  placeholder="din@epost.se"
                  className={inputCls(Boolean(errors.email))}
                  {...trackField(
                    "email",
                    register("email", {
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Ogiltig e-post",
                      },
                    })
                  )}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Detaljer (valfritt) */}
            <div>
              <label htmlFor="message" className={labelCls} style={labelStyle}>
                Detaljer{" "}
                <span className="text-gray-400 font-normal">(valfritt)</span>
              </label>
              <textarea
                id="message"
                rows={2}
                placeholder="Ange taktyp, kvm eller annat"
                className="w-full px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors resize-none"
                {...trackField("message", register("message"))}
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-[5px] text-white font-semibold text-sm transition-colors disabled:opacity-70"
          style={{ backgroundColor: "var(--color-primary)" }}
          onMouseOver={(e) =>
            !isSubmitting &&
            (e.currentTarget.style.backgroundColor =
              "var(--color-primary-hover)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-primary)")
          }
        >
          {isSubmitting
            ? "Skickar..."
            : ctaText ||
              (variant === "hero" ? "Få prisförslag" : "Få mitt prisförslag")}
        </button>

        {notBindingNote && (
          <p className="text-xs text-gray-500 text-center">
            Prisförslaget är kostnadsfritt och inte bindande.
          </p>
        )}

        {privacyNote && (
          <p className="text-[11px] leading-relaxed text-gray-400 text-center">
            Vi hanterar dina uppgifter enligt GDPR och delar dem aldrig med
            tredje part.{" "}
            <Link href="/integritetspolicy" className="underline hover:text-gray-600">
              Integritetspolicy
            </Link>
          </p>
        )}

        {/* Telefon som diskret sekundär fallback */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="text-xs text-gray-500">Eller ring oss:</span>
          <a
            href="tel:08283888"
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-[#2B74FC]"
          >
            <Phone size={12} />
            08-28 38 88
          </a>
        </div>
      </form>
    </div>
  );
}
