import Link from "next/link";
import Image from "next/image";

type Crumb = { label: string; href?: string };

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  breadcrumbs?: Crumb[];
  backgroundImage?: string;
  imageAlt?: string;
}

export default function PageHero({
  eyebrow,
  title,
  titleAccent,
  description,
  breadcrumbs,
  backgroundImage,
  imageAlt,
}: PageHeroProps) {
  const hasImage = Boolean(backgroundImage);

  return (
    <section
      className={`relative overflow-hidden ${hasImage ? "" : "bg-white border-b border-gray-100"}`}
    >
      {hasImage && (
        <>
          <Image
            src={backgroundImage!}
            alt={imageAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(6,6,7,0.82) 0%, rgba(6,6,7,0.70) 25%, rgba(6,6,7,0.45) 55%, rgba(6,6,7,0.20) 100%)",
            }}
          />
        </>
      )}

      {/* BreadcrumbList JSON-LD */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbs.map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: c.label,
                ...(c.href
                  ? { item: `https://www.sandsab.se${c.href}` }
                  : {}),
              })),
            }),
          }}
        />
      )}

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className={`flex items-center gap-2 text-xs mb-6 ${
              hasImage ? "text-gray-300" : "text-gray-400"
            }`}
          >
            {breadcrumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.href ? (
                  <Link
                    href={c.href}
                    className={
                      hasImage ? "hover:text-white" : "hover:text-[#2B74FC]"
                    }
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    className={hasImage ? "text-gray-200" : "text-gray-600"}
                  >
                    {c.label}
                  </span>
                )}
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <p
            className={`text-[13px] font-semibold uppercase tracking-[0.18em] mb-4 ${
              hasImage ? "text-gray-300" : "text-gray-400"
            }`}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className={`text-[40px] sm:text-[52px] lg:text-[68px] font-extrabold leading-[1.02] tracking-[-0.035em] max-w-4xl ${
            hasImage ? "text-white" : ""
          }`}
          style={{
            fontFamily: "var(--font-heading)",
            color: hasImage ? undefined : "var(--color-dark)",
          }}
        >
          {title}
          {titleAccent && (
            <>
              {" "}
              <span style={{ color: "var(--color-primary)" }}>
                {titleAccent}
              </span>
            </>
          )}
        </h1>

        {description && (
          <p
            className={`text-xl leading-relaxed max-w-2xl mt-7 ${
              hasImage ? "text-gray-200" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
