import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadForm from "@/components/LeadForm";
import { artiklar, getArtikel } from "@/lib/blogg";

export async function generateStaticParams() {
  return artiklar.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtikel(slug);
  if (!a) return {};
  return {
    title: `${a.titel} | Sands Entreprenad`,
    description: a.ingress,
    openGraph: {
      title: `${a.titel} | Sands Entreprenad`,
      description: a.ingress,
      type: "article",
      publishedTime: a.datum,
    },
  };
}

export default async function ArtikelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArtikel(slug);
  if (!a) notFound();

  const relaterade = artiklar
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 bg-white">
        {/* Header */}
        <section className="border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <Link href="/" className="hover:text-[#2B74FC]">Hem</Link>
              <span>/</span>
              <Link href="/blogg" className="hover:text-[#2B74FC]">Blogg</Link>
              <span>/</span>
              <span className="text-gray-600">{a.kategori}</span>
            </nav>

            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(43,116,252,0.08)",
                  color: "var(--color-primary)",
                }}
              >
                {a.kategori}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={11} />
                {new Date(a.datum).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} />
                {a.lästid}
              </span>
            </div>

            <h1
              className="text-[32px] sm:text-[40px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-0.03em] max-w-4xl"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-dark)",
              }}
            >
              {a.titel}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mt-5">
              {a.ingress}
            </p>
          </div>
        </section>

        {/* Artikel + sidebar */}
        <section className="py-12 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-start">
              {/* Artikelinnehåll */}
              <article className="prose-article">
                {a.innehåll.split("\n\n").map((block, i) => {
                  if (block.startsWith("## ")) {
                    return (
                      <h2
                        key={i}
                        className="text-[22px] lg:text-[26px] font-bold mt-10 mb-4"
                        style={{
                          fontFamily: "var(--font-heading)",
                          color: "var(--color-dark)",
                        }}
                      >
                        {block.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (block.startsWith("| ")) {
                    const rows = block.split("\n").filter((r) => r.trim());
                    const header = rows[0]
                      .split("|")
                      .map((c) => c.trim())
                      .filter(Boolean);
                    const dataRows = rows.slice(2).map((r) =>
                      r
                        .split("|")
                        .map((c) => c.trim())
                        .filter(Boolean)
                    );
                    return (
                      <div key={i} className="my-6 overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b-2 border-gray-200">
                              {header.map((h) => (
                                <th
                                  key={h}
                                  className="text-left py-2 pr-4 font-bold"
                                  style={{ color: "var(--color-dark)" }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataRows.map((row, ri) => (
                              <tr
                                key={ri}
                                className="border-b border-gray-100"
                              >
                                {row.map((cell, ci) => (
                                  <td
                                    key={ci}
                                    className="py-2 pr-4 text-gray-600"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (block.startsWith("- ")) {
                    const items = block.split("\n").filter((l) => l.startsWith("- "));
                    return (
                      <ul key={i} className="space-y-2 my-4">
                        {items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-[15px] text-gray-600 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-2" />
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item
                                  .replace("- ", "")
                                  .replace(
                                    /\*\*([^*]+)\*\*/g,
                                    '<strong class="text-gray-900">$1</strong>'
                                  ),
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className="text-[15px] text-gray-600 leading-[1.75] mb-4"
                      dangerouslySetInnerHTML={{
                        __html: block.replace(
                          /\*\*([^*]+)\*\*/g,
                          '<strong class="text-gray-900">$1</strong>'
                        ),
                      }}
                    />
                  );
                })}
              </article>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-28 space-y-8">
                <LeadForm variant="section" />

                {/* Relaterade artiklar */}
                <div>
                  <h3
                    className="text-base font-bold mb-4"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-dark)",
                    }}
                  >
                    Fler artiklar
                  </h3>
                  <div className="space-y-3">
                    {relaterade.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/blogg/${r.slug}`}
                        className="block p-4 rounded-2xl border border-gray-100 hover:border-[#2B74FC] transition-colors group"
                      >
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "rgba(43,116,252,0.08)",
                            color: "var(--color-primary)",
                          }}
                        >
                          {r.kategori}
                        </span>
                        <p
                          className="text-sm font-bold mt-2 group-hover:text-[#2B74FC] transition-colors"
                          style={{ color: "var(--color-dark)" }}
                        >
                          {r.titel}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-10 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-4">
            <Link
              href="/blogg"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#2B74FC] transition-colors"
            >
              <ArrowLeft size={14} /> Alla artiklar
            </Link>
            <Link
              href="/offert"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Boka takbesiktning <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
