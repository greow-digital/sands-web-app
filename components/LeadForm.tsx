"use client";

import {
  useForm,
  type RegisterOptions,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { useId, useRef, useState } from "react";
import { leadSourceFor } from "@/lib/lead-source";
import { telefonFel } from "@/lib/telefon";

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
  /** "minimal" = endast Namn + kontaktväg (för kalkylator-bron). */
  fields?: "full" | "minimal";
  /**
   * "phone-or-email" gör telefon frivilligt: användaren fyller i telefon
   * ELLER e-post och väljer själv hur vi hör av oss. Den som researchar
   * pris är sällan redo för ett säljsamtal, och krav på telefonnummer är
   * den dyraste friktionen i formuläret.
   */
  contact?: "phone" | "phone-or-email";
  /**
   * Renderar formuläret utan egen kort-chrome (bakgrund, ram, skugga,
   * padding). Används när det ligger inuti ett annat kort, t.ex. sista
   * steget i Takräknaren.
   */
  flat?: boolean;
  /**
   * Telefon och e-post på var sin rad under sm. Två kolumner på en
   * mobilskärm klipper exempeltexten i telefonfältet.
   */
  stapla?: boolean;
  /** Visar fritextfältet även i minimal-läge. */
  showMessage?: boolean;
  /** Extra data som följer med i leadens payload, t.ex. taktyp + yta. */
  extraPayload?: Record<string, string | undefined>;
  /** Override för submit-knappens text. */
  ctaText?: string;
  /**
   * Dölj formulärets egen rubrik (när omslaget redan har en). "mobile"
   * döljer den bara under lg, där heron annars trycker ner första fältet
   * under vikningen och sidans H1 redan säger vad formuläret gäller.
   */
  hideHeader?: boolean | "mobile";
  /** Liten bekräftelserad ovanför fälten, t.ex. "Gäller: betongpannor, ca 150 m²". */
  confirmation?: string;
  /** "Prisförslaget är kostnadsfritt och inte bindande." under knappen. */
  notBindingNote?: boolean;
  /** Körs efter lyckad submit, innan redirect (t.ex. för calc_bridge_submit). */
  onSubmitSuccess?: () => void;
  /**
   * Med contact="phone-or-email": visa bara telefon och lägg e-post bakom
   * länken "Hellre e-post?". Formuläret ser ut som två fält, men ingen
   * tvingas lämna sitt nummer.
   */
  epostSomLank?: boolean;
  /** Med showMessage: fritexten ligger bakom en länk i stället för öppen. */
  meddelandeSomLank?: boolean;
  /** Innehåll direkt ovanför knappen, t.ex. betyg och ett kundcitat. */
  ovanforKnapp?: React.ReactNode;
}

export default function LeadForm({
  variant = "hero",
  formId = "offert",
  fields = "full",
  contact = "phone",
  flat = false,
  showMessage = false,
  stapla = false,
  extraPayload,
  ctaText,
  hideHeader = false,
  confirmation,
  notBindingNote = false,
  onSubmitSuccess,
  epostSomLank = false,
  meddelandeSomLank = false,
  ovanforKnapp,
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  // LeadForm renderas flera gånger på samma sida (hero + sektion), så id:n
  // måste vara unika per instans. Utan det pekar två label htmlFor på samma
  // id och webbläsaren kopplar fel fält, vilket både bryter etiketten och
  // försvagar autofyllens gissning.
  const uid = useId();
  const fid = (namn: string) => `${uid}-${namn}`;

  const valfriKontakt = contact === "phone-or-email";
  const [visaEpost, setVisaEpost] = useState(!epostSomLank);
  const [visaMeddelande, setVisaMeddelande] = useState(!meddelandeSomLank);
  // Läses i valideringen, som inte ser renderingens state.
  const epostSynlig = useRef(!epostSomLank);

  // Minst en kontaktväg måste vara ifylld, men användaren väljer vilken.
  function harKontaktvag() {
    const { phone, email } = getValues();
    return Boolean(phone?.trim() || email?.trim());
  }

  const KONTAKT_KRAV = "Fyll i telefon eller e-post, du väljer själv";
  // När e-post ligger bakom länken pekar felet dit i stället.
  const kontaktKrav = () =>
    epostSynlig.current ? KONTAKT_KRAV : "Ange telefonnummer, eller välj e-post nedan";

  const telefonFormat = (v?: string) => telefonFel(v) ?? true;

  // Numret kontrolleras redan när fältet lämnas, inte först vid submit, så
  // att ett nummer med en siffra för lite syns medan användaren är kvar i
  // formuläret. Tomt fält lämnas i fred tills submit, annars får den som
  // hoppar förbi telefon för att fylla i e-post ett fel i onödan. När ett
  // fel väl visas kontrolleras fältet om vid varje ändring, så att
  // meddelandet försvinner så fort numret är rätt.
  const telefonLive = {
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value.trim()) trigger("phone");
    },
  };

  const telefonRegler: RegisterOptions<FormData, "phone"> = valfriKontakt
    ? {
        validate: {
          kontakt: () => harKontaktvag() || kontaktKrav(),
          format: telefonFormat,
        },
      }
    : {
        required: "Ange telefonnummer",
        validate: { format: telefonFormat },
      };

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
          // Ett meddelande från omslaget (t.ex. frågeflödets svar) och det
          // kunden själv skrivit slås ihop. Annars skrev det ena över det andra.
          message:
            [extraPayload?.message, data.message?.trim()]
              .filter(Boolean)
              .join("\n\n") || undefined,
          formId,
          leadSource: leadSourceFor(formId),
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
          // Kanal-dimension, läses av /tack och skickas som lead_source till GA4.
          sessionStorage.setItem("sands_lead_leadsource", leadSourceFor(formId));
          // Suppression: visa inte inaktivitets-popupen för någon som
          // redan skickat ett formulär (30 dagar).
          document.cookie =
            "sands_submitted=1; max-age=2592000; path=/; samesite=lax";
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
      className={
        flat
          ? ""
          : `bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-gray-100 ${
              variant === "hero" ? "p-7 lg:p-9" : "p-5 sm:p-7 lg:p-8"
            }`
      }
    >
      {hideHeader !== true && (
        <div className={hideHeader === "mobile" ? "hidden lg:block mb-6" : "mb-6"}>
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
          <label htmlFor={fid("name")} className={labelCls} style={labelStyle}>
            Namn *
          </label>
          <input
            id={fid("name")}
            type="text"
            autoComplete="name"
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
          <div
            className={
              valfriKontakt && visaEpost
                ? stapla
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                  : "grid grid-cols-2 gap-3"
                : ""
            }
          >
            <div className="min-w-0">
              <label
                htmlFor={fid("phone")}
                className={labelCls}
                style={labelStyle}
              >
                Telefon {valfriKontakt ? "" : "*"}
              </label>
              <input
                id={fid("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="070-000 00 00"
                className={inputCls(Boolean(errors.phone))}
                {...trackField(
                  "phone",
                  register("phone", {
                    ...telefonRegler,
                    ...telefonLive,
                    onChange: () => {
                      if (errors.phone) trigger("phone");
                      if (valfriKontakt && errors.email) trigger("email");
                    },
                  })
                )}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
              {valfriKontakt && !visaEpost && (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-[#2B74FC] hover:underline"
                  onClick={() => {
                    epostSynlig.current = true;
                    setVisaEpost(true);
                    // Fokus flyttas till e-postfältet när det har renderats.
                    setTimeout(() => document.getElementById(fid("email"))?.focus(), 0);
                  }}
                >
                  Hellre e-post?
                </button>
              )}
            </div>
            {valfriKontakt && visaEpost && (
              <div className="min-w-0">
                <label
                  htmlFor={fid("email")}
                  className={labelCls}
                  style={labelStyle}
                >
                  E-post
                </label>
                <input
                  id={fid("email")}
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="din@epost.se"
                  className={inputCls(Boolean(errors.email))}
                  {...trackField(
                    "email",
                    register("email", {
                      validate: {
                        kontakt: () => harKontaktvag() || KONTAKT_KRAV,
                        format: (v?: string) =>
                          !v?.trim() ||
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
                          "Ogiltig e-post",
                      },
                      onChange: () => {
                        if (errors.phone) trigger("phone");
                      },
                    })
                  )}
                />
                {/* Kravet på minst en kontaktväg visas bara en gång, under
                    telefonfältet, annars står samma mening två gånger. */}
                {errors.email && errors.email.type !== "kontakt" && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}
            {/* Ingen hjälptext under fälten. Att telefon och e-post saknar
                asterisk säger redan att de är valfria, och den som lämnar
                båda tomma får kravet som felmeddelande precis när det
                behövs. */}
            {showMessage && !visaMeddelande && (
              <div className="col-span-full">
                <button
                  type="button"
                  className="text-xs font-semibold text-[#2B74FC] hover:underline"
                  onClick={() => {
                    setVisaMeddelande(true);
                    setTimeout(() => document.getElementById(fid("message"))?.focus(), 0);
                  }}
                >
                  + Lägg till ett meddelande (valfritt)
                </button>
              </div>
            )}
            {showMessage && visaMeddelande && (
              <div className="col-span-full">
                <label
                  htmlFor={fid("message")}
                  className={labelCls}
                  style={labelStyle}
                >
                  Något vi bör veta{" "}
                  <span className="text-gray-400 font-normal">(valfritt)</span>
                </label>
                <textarea
                  id={fid("message")}
                  rows={2}
                  placeholder="Kupor, läckage, eternit eller annat"
                  className="w-full px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors resize-none"
                  {...trackField("message", register("message"))}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Telefon + E-post */}
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0">
                <label
                  htmlFor={fid("phone")}
                  className={labelCls}
                  style={labelStyle}
                >
                  Telefon *
                </label>
                <input
                  id={fid("phone")}
                  type="tel"
                  autoComplete="tel"
                  placeholder="070-000 00 00"
                  className={inputCls(Boolean(errors.phone))}
                  {...trackField(
                    "phone",
                    register("phone", {
                      required: "Ange telefonnummer",
                      validate: { format: telefonFormat },
                      ...telefonLive,
                      onChange: () => {
                        if (errors.phone) trigger("phone");
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
              <div className="min-w-0">
                <label
                  htmlFor={fid("email")}
                  className={labelCls}
                  style={labelStyle}
                >
                  E-post{" "}
                  <span className="text-gray-400 font-normal">(valfritt)</span>
                </label>
                <input
                  id={fid("email")}
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
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
              <label
                htmlFor={fid("message")}
                className={labelCls}
                style={labelStyle}
              >
                Detaljer{" "}
                <span className="text-gray-400 font-normal">(valfritt)</span>
              </label>
              <textarea
                id={fid("message")}
                rows={2}
                placeholder="Ange taktyp, kvm eller annat"
                className="w-full px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors resize-none"
                {...trackField("message", register("message"))}
              />
            </div>
          </>
        )}

        {ovanforKnapp}

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
            : ctaText || "Få prisförslag"}
        </button>

        {notBindingNote && (
          <p className="text-xs text-gray-500 text-center">
            Prisförslaget är kostnadsfritt och inte bindande.
          </p>
        )}

        {/* Ingen GDPR-rad och ingen "Eller ring oss" under formulären.
            Integritetspolicyn nås från footern på varje sida, och
            telefonnumret står i headern. Två rader smått under varje
            knapp gjorde formulären plottriga utan att tillföra något. */}
      </form>
    </div>
  );
}
