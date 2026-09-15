export const siteConfig = {
  name: "Vaqueroil",
  shortName: "Vaqueroil",
  // Cambia el dominio cuando el despliegue final esté decidido
  // o define NEXT_PUBLIC_SITE_URL en el entorno.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://vaqueroil.es",
  description:
    "Vaqueroil, taller multimarca en Logroño (La Rioja). Mantenimiento, cambio de aceite, frenos, neumáticos, diagnosis electrónica y pre-ITV. Pide cita online.",
  locale: "es_ES",
  phone: "+34941047695",
  phoneDisplay: "941 04 76 95",
  email: "info@vaqueroil.es",
  address: {
    street: "C. Calahorra, 12, Pab. 1",
    city: "Logroño",
    region: "La Rioja",
    postalCode: "26006",
    country: "ES",
  },
  geo: { lat: 42.462, lng: -2.428 },
  hours: "Lunes a viernes: 9:00–13:30 y 16:00–19:30",
} as const;

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${siteConfig.url}/#negocio`,
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/hero_background.jpg`,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "16:00",
        closes: "19:30",
      },
    ],
    sameAs: [],
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
