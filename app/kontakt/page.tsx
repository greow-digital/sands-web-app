"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

function KontaktForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "/kontakt" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
      reset();
    } catch {
      alert("Något gick fel. Försök igen eller ring oss på 08-28 38 88.");
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-[10px] p-8 text-center shadow-sm">
        <CheckCircle size={40} className="mx-auto mb-3" style={{ color: "var(--color-primary)" }} />
        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Tack! Vi återkommer snart.
        </h3>
        <p className="text-sm text-gray-600">Normalt svarar vi inom 24 timmar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-[10px] p-8 shadow-sm" noValidate>
      <h2
        className="text-xl font-bold mb-5"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
      >
        Skicka ett meddelande
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
            Namn *
          </label>
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"}`}
            {...register("name", { required: true })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
            Telefon *
          </label>
          <input
            type="tel"
            className={`w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"}`}
            {...register("phone", { required: true })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
          E-post
        </label>
        <input
          type="email"
          className="w-full px-4 py-3 rounded-[5px] text-sm outline-none border border-transparent bg-[#F1F4F7] focus:border-[#2B74FC] transition-colors"
          {...register("email")}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-primary)" }}>
          Meddelande *
        </label>
        <textarea
          rows={5}
          placeholder="Beskriv ditt ärende..."
          className={`w-full px-4 py-3 rounded-[5px] text-sm outline-none border transition-colors resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-transparent bg-[#F1F4F7] focus:border-[#2B74FC]"}`}
          {...register("message", { required: true })}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-[5px] text-white font-semibold text-sm transition-colors disabled:opacity-70"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {isSubmitting ? "Skickar..." : "Skicka meddelande"}
      </button>
    </form>
  );
}

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        <PageHero
          eyebrow="Kontakt"
          title="Kontakta"
          titleAccent="oss"
          description="Vi svarar normalt sett inom 24 timmar. Hellre ringa? Slå oss en signal direkt."
          breadcrumbs={[{ label: "Hem", href: "/" }, { label: "Kontakt" }]}
        />

        {/* Grid */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Kontaktinfo */}
              <div>
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <Phone size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold mb-0.5" style={{ color: "var(--color-dark)" }}>
                        Telefon
                      </div>
                      <a
                        href="tel:0828388"
                        className="text-xl font-extrabold"
                        style={{ color: "var(--color-primary)", fontFamily: "var(--font-heading)" }}
                      >
                        08-28 38 88
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <Mail size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold mb-0.5" style={{ color: "var(--color-dark)" }}>
                        E-post
                      </div>
                      <a
                        href="mailto:info@sandsab.se"
                        className="text-base font-semibold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        info@sandsab.se
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold mb-0.5" style={{ color: "var(--color-dark)" }}>
                        Adress
                      </div>
                      <p className="text-sm text-gray-600">
                        Spjutvägen 5A<br />
                        175 61 Järfälla<br />
                        Org.nr: 559063-8135
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <Clock size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold mb-0.5" style={{ color: "var(--color-dark)" }}>
                        Svarstid
                      </div>
                      <p className="text-sm text-gray-600">Normalt sett inom 24 timmar</p>
                    </div>
                  </div>
                </div>

                {/* Karta placeholder */}
                <div
                  className="rounded-[10px] h-48 flex items-center justify-center text-gray-400 text-sm"
                  style={{ backgroundColor: "var(--color-dark)" }}
                >
                  Järfälla — Stockholms län
                </div>
              </div>

              {/* Formulär */}
              <KontaktForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
