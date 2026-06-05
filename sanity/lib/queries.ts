import { defineQuery } from "next-sanity";

const PROJEKT_CARD_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  ort,
  typ,
  kvm,
  ar,
  huvudbild {
    ...,
    asset->{
      _id,
      url,
      metadata { lqip, dimensions { width, height } }
    }
  },
  "bilder": bilder[0...2] {
    ...,
    _key,
    asset->{
      _id,
      url,
      metadata { lqip, dimensions { width, height } }
    }
  }
`;

const PROJEKT_DETAIL_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  ort,
  typ,
  kvm,
  ar,
  material,
  beskrivning,
  taggar,
  huvudbild {
    ...,
    asset->{
      _id,
      url,
      metadata { lqip, dimensions { width, height } }
    }
  },
  bilder[] {
    ...,
    _key,
    asset->{
      _id,
      url,
      metadata { lqip, dimensions { width, height } }
    }
  }
`;

export const ALL_PROJEKT_QUERY = defineQuery(/* groq */ `
  *[_type == "projekt" && defined(slug.current)]
  | order(ar desc, _createdAt desc) {
    ${PROJEKT_CARD_FIELDS}
  }
`);

export const PROJEKT_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "projekt" && slug.current == $slug][0] {
    ${PROJEKT_DETAIL_FIELDS}
  }
`);

export const PROJEKT_BY_ORT_QUERY = defineQuery(/* groq */ `
  *[_type == "projekt" && ort == $ort && defined(slug.current)]
  | order(ar desc, _createdAt desc) {
    ${PROJEKT_CARD_FIELDS}
  }
`);

export const PROJEKT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "projekt" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const PROJEKT_COUNT_QUERY = defineQuery(/* groq */ `
  count(*[_type == "projekt" && defined(slug.current)])
`);

export const LATEST_PROJEKT_QUERY = defineQuery(/* groq */ `
  *[_type == "projekt" && defined(slug.current)]
  | order(ar desc, _createdAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    ort,
    typ,
    ar,
    huvudbild {
      ...,
      asset->{ _id, url, metadata { lqip } }
    },
    foreImage {
      ...,
      asset->{ _id, url, metadata { lqip } }
    },
    efterImage {
      ...,
      asset->{ _id, url, metadata { lqip } }
    }
  }
`);
