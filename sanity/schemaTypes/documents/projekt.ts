import { defineType, defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons";

const TAK_TYPER = [
  { title: "Betongtak", value: "Betongtak" },
  { title: "Tegeltak", value: "Tegeltak" },
  { title: "Plåttak", value: "Plåttak" },
  { title: "Papptak", value: "Papptak" },
] as const;

const ORTER = [
  "Stockholm",
  "Bromma",
  "Täby",
  "Sollentuna",
  "Danderyd",
  "Lidingö",
  "Vallentuna",
  "Vaxholm",
  "Värmdö",
  "Österåker",
  "Upplands Väsby",
  "Upplands-Bro",
  "Sigtuna",
  "Nacka",
  "Huddinge",
  "Tyresö",
  "Haninge",
  "Botkyrka",
  "Nynäshamn",
  "Salem",
  "Järfälla",
  "Solna",
  "Sundbyberg",
  "Ekerö",
  "Norrtälje",
  "Södertälje",
  "Nykvarn",
  "Nyköping",
  "Köping",
  "Strängnäs",
  "Enköping",
  "Gnesta",
  "Håbo",
  "Uttran",
] as const;

export const projekt = defineType({
  name: "projekt",
  title: "Projekt",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      description: "Visas som rubrik, t.ex. \"Plommonvägen, Bromma\"",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-del, t.ex. \"plommonvagen-bromma\". Genereras automatiskt från titeln.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/å/g, "a")
            .replace(/ä/g, "a")
            .replace(/ö/g, "o")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 96),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ort",
      title: "Ort",
      type: "string",
      description: "Måste matcha en kommun i lib/omraden.ts för att projektet ska visas på rätt områdessida.",
      options: {
        list: ORTER.map((o) => ({ title: o, value: o })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "typ",
      title: "Taktyp",
      type: "string",
      options: {
        list: TAK_TYPER as unknown as { title: string; value: string }[],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kvm",
      title: "Storlek (kvm)",
      type: "number",
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: "ar",
      title: "År",
      type: "number",
      description: "Året projektet färdigställdes",
      validation: (rule) => rule.required().min(2000).max(2100),
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "string",
      description: 'T.ex. "Monier betongtakpannor"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "beskrivning",
      title: "Beskrivning",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "taggar",
      title: "Taggar",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "huvudbild",
      title: "Huvudbild",
      type: "image",
      description: "Visas i översiktslistor och som första bild på projektsidan.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-text",
          type: "string",
          description: "Beskriv bilden för synskadade och sökmotorer.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bilder",
      title: "Bildgalleri",
      type: "array",
      description: "Resterande projektbilder.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt-text",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "foreImage",
      title: "Före-bild",
      type: "image",
      description:
        "Valfri. Om både Före- och Efter-bild fylls i visas projektet med en före/efter-jämförelse i 'Senaste projekt'-listan på startsidan.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "efterImage",
      title: "Efter-bild",
      type: "image",
      description:
        "Valfri. Används i kombination med Före-bild för före/efter-jämförelse på startsidan. Kan vara samma som huvudbilden.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-text",
          type: "string",
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "År (nyast först)",
      name: "arDesc",
      by: [{ field: "ar", direction: "desc" }],
    },
    {
      title: "Titel (A–Ö)",
      name: "titelAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "typ",
      kvm: "kvm",
      ar: "ar",
      media: "huvudbild",
    },
    prepare({ title, subtitle, kvm, ar, media }) {
      return {
        title,
        subtitle: [subtitle, kvm && `${kvm} kvm`, ar].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
