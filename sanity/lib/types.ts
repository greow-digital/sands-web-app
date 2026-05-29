import type { SanityImageSource } from "@sanity/image-url";

export type SanityImageWithMeta = SanityImageSource & {
  _key?: string;
  alt?: string | null;
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string | null;
      dimensions?: { width: number; height: number } | null;
    } | null;
  } | null;
};

export type ProjektCard = {
  _id: string;
  title: string | null;
  slug: string | null;
  ort: string | null;
  typ: string | null;
  kvm: number | null;
  ar: number | null;
  huvudbild: SanityImageWithMeta | null;
  bilder: SanityImageWithMeta[] | null;
};

export type ProjektDetail = ProjektCard & {
  material: string | null;
  beskrivning: string | null;
  taggar: string[] | null;
  bilder: SanityImageWithMeta[] | null;
};
