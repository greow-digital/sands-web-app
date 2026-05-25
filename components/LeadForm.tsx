"use client";

import { useForm } from "react-hook-form";
import { Phone } from "lucide-react";
import { useState } from "react";

type FormData = {
  name: string;
  phone: string;
  email?: string;
  roofType: string;
  area?: string;
};

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const taktyper = [
  "Betongtak",
  "Tegeltak",
  "Plåttak",
  "Papptak",
  "Eternittak",
  "Vet ej",
];

interface LeadFormProps {
  variant?: "hero" | "section";
}

export default function LeadForm({ variant = "hero" }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source:
            typeof window !== "undefined"
              ? window.location.pathname
              : "sandsab.se",
          gclid: getCookie("gclid"),
          gbraid: getCookie("gbraid"),
          wbraid: getCookie("wbraid"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");

      setSubmitted(true);
      reset();

      if (typeof window !== "undefined") {
        const w = window as unknown as {
          gtag?: (...a: unknown[]) => void;
        };
        if (typeof w.gtag === "function") {
          w.gtag("event", "conversion", {
            send_to: "AW-18004063012",
          });
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
          <a href="tel:0828388" className="font-semibold text-[#2B74FC]">
            08-28 38 88
          </a>
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-3xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] border border-gray-100 ${
        variant === "hero" ? "p-7 lg:p-9" : "p-8"
      }`}
    >
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Namn */}
        <div>
          <label
            className="block text-xs font-semibold mb-1"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-body)" }}
          >
            Namn *
          </label>
          <input
            type="text"
            placeholder="Ditt namn"
            className={`w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors ${
              errors.name
                ? "border-red-400 bg-red-50"
                : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"
            }`}
            {...register("name", { required: "Ange ditt namn" })}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Telefon + E-post */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-body)" }}
            >
              Telefon *
            </label>
            <input
              type="tel"
              placeholder="070-000 00 00"
              className={`w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors ${
                errors.phone
                  ? "border-red-400 bg-red-50"
                  : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"
              }`}
              {...register("phone", {
                required: "Ange telefonnummer",
                pattern: {
                  value: /^[0-9+\s\-]{7,}$/,
                  message: "Ogiltigt nummer",
                },
              })}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label
              className="block text-xs font-semibold mb-1"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-body)" }}
            >
              E-post <span className="text-gray-400 font-normal">(valfritt)</span>
            </label>
            <input
              type="email"
              placeholder="din@epost.se"
              className={`w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors ${
                errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"
              }`}
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ogiltig e-post",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Taktyp */}
        <div>
          <label
            htmlFor="roofType"
            className="block text-xs font-semibold mb-1"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-body)" }}
          >
            Taktyp *
          </label>
          <select
            id="roofType"
            className={`w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors appearance-none ${
              errors.roofType
                ? "border-red-400 bg-red-50"
                : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"
            }`}
            {...register("roofType", { required: "Välj taktyp" })}
            defaultValue=""
          >
            <option value="" disabled>
              Välj taktyp
            </option>
            {taktyper.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.roofType && (
            <p className="text-xs text-red-500 mt-1">
              {errors.roofType.message}
            </p>
          )}
        </div>

        {/* Area (valfritt) */}
        <div>
          <label
            className="block text-xs font-semibold mb-1"
            style={{ color: "var(--color-primary)", fontFamily: "var(--font-body)" }}
          >
            Ungefärlig yta m² <span className="text-gray-400 font-normal">(valfritt)</span>
          </label>
          <input
            type="text"
            placeholder="t.ex. 140 m²"
            className="w-full px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors"
            {...register("area")}
          />
        </div>

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
          {isSubmitting ? "Skickar..." : "Få prisförslag"}
        </button>

        {/* Phone fallback */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-xs text-gray-500">Eller ring oss:</span>
          <a
            href="tel:0828388"
            className="flex items-center gap-1 text-xs font-bold text-[#2B74FC]"
          >
            <Phone size={12} />
            08-28 38 88
          </a>
        </div>
      </form>
    </div>
  );
}
