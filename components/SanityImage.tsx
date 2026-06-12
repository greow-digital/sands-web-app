import Image, { type ImageProps } from "next/image";

/**
 * Wrapper för bilder som kommer från Sanity (byggda via urlFor()).
 *
 * Sanitys CDN gör redan storleksändring och formatkonvertering, så vi
 * sätter `unoptimized` för att hindra Vercel Image Optimization från att
 * optimera om en redan färdig bild. Det förbrukade transformationskvoten
 * (5 000/mån på gratisplanen) och fick bilder att sluta renderas när
 * taket nåddes.
 *
 * OBS: använd INTE denna för lokala /images-bilder. De optimeras fortsatt
 * av Vercel (få till antalet, långt under taket) och drar nytta av
 * AVIF/WebP-konvertering. Använd vanliga next/image för dem.
 */
export default function SanityImage(props: ImageProps) {
  return <Image {...props} unoptimized />;
}
