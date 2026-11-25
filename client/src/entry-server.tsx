// Build-time render: tools/prerender.mjs writes this HTML into index.html so search engines and
// link previews see the full page without running JavaScript. The browser then hydrates it.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { FAQ } from "./content";
import { GALLERY, SHOP } from "./config";

export const SITE = "https://buildit3d.in";

export function render() {
  return renderToString(<StrictMode><App /></StrictMode>);
}

export function jsonLd() {
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE}/#business`,
    name: SHOP.name,
    description: "Custom 3D printing in Thane West: gifts, name signs, idols, college projects and functional parts. Send a 3D file or a photo; we reply on WhatsApp with a price.",
    url: SITE,
    telephone: `+${SHOP.phoneIntl}`,
    email: SHOP.email,
    image: [`${SITE}/og.jpg`, ...GALLERY.slice(0, 4).map((g) => `${SITE}${g.image}`)],
    logo: `${SITE}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SHOP.street,
      addressLocality: "Thane West",
      addressRegion: "Maharashtra",
      postalCode: SHOP.postcode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: SHOP.geo[0], longitude: SHOP.geo[1] },
    hasMap: SHOP.mapsUrl,
    sameAs: [SHOP.mapsUrl],
    areaServed: ["Thane", "Mumbai"],
    priceRange: "₹₹",
    knowsAbout: ["3D printing", "FDM printing", "PLA", "PETG", "ABS", "3D design", "custom gifts", "prototypes"],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return [business, faq];
}
