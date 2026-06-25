import type { Metadata } from "next";
import { ORGANIZER_NAME } from "@/app/constants";
import { getSiteUrl } from "@/lib/site-url";
import type { Faq, SiteSettings } from "@/lib/types/site";

const SITE_NAME = "Lecathon 2.0";
const DEFAULT_DESCRIPTION = `Join Lecathon 2.0 — Nepal's flagship open-theme hackathon by ${ORGANIZER_NAME} at LEMSC, Rupandehi. Build innovative solutions, compete for prizes, and launch your tech career.`;

export const SEO_KEYWORDS = [
  "Lecathon",
  "Lecathon 2.0",
  "hackathon Nepal",
  "hackathon Rupandehi",
  "LEMSC hackathon",
  "college hackathon Nepal",
  "open theme hackathon",
  "Robotics Club LEMSC",
  ORGANIZER_NAME,
  "Lumbini Engineering Management and Science College",
  "tech competition Nepal",
  "innovation hackathon",
  "student hackathon",
];

export function buildSiteMetadata(settings?: Partial<SiteSettings>): Metadata {
  const siteUrl = getSiteUrl();
  const prizePool = settings?.prizePool?.trim();
  const venue = settings?.venueName?.trim();
  const description = [
    DEFAULT_DESCRIPTION,
    prizePool ? `Prize pool: ${prizePool}.` : "",
    venue ? `Venue: ${venue}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${SITE_NAME} — Hack. Build. Innovate.`,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: SEO_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: ORGANIZER_NAME }],
    creator: ORGANIZER_NAME,
    publisher: ORGANIZER_NAME,
    category: "technology",
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: "google19ffc417fe610fd8",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: SITE_NAME,
      title: `${SITE_NAME} — Nepal's Open Theme Hackathon`,
      description:
        "Learn, build, and innovate at Lecathon 2.0. Register your team for Nepal's premier student hackathon at LEMSC.",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Hack. Build. Innovate.`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — Hack. Build. Innovate.`,
      description: `Flagship hackathon by ${ORGANIZER_NAME} at LEMSC, Nepal.`,
      images: ["/opengraph-image"],
    },
    icons: {
      icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
      shortcut: "/icon.png",
    },
  };
}

export function buildOrganizationJsonLd(settings: SiteSettings) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZER_NAME,
    url: siteUrl,
    email: settings.contactEmail || undefined,
    sameAs: [
      settings.socialFacebook,
      settings.socialInstagram,
      settings.socialGithub,
      settings.socialWebsite,
    ].filter((url) => url?.trim()),
  };
}

export function buildEventJsonLd(settings: SiteSettings) {
  const siteUrl = getSiteUrl();
  const startDate = settings.hackathonDate;
  const locationName = settings.venueName?.trim() || "LEMSC";
  const locationAddress = settings.venueAddress?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Lecathon 2.0",
    description: DEFAULT_DESCRIPTION,
    startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: [`${siteUrl}/opengraph-image`],
    url: siteUrl,
    organizer: {
      "@type": "Organization",
      name: ORGANIZER_NAME,
      url: siteUrl,
    },
    location: {
      "@type": "Place",
      name: locationName,
      address: locationAddress
        ? {
            "@type": "PostalAddress",
            streetAddress: locationAddress,
            addressCountry: "NP",
          }
        : undefined,
    },
    offers: settings.registrationOpen
      ? {
          "@type": "Offer",
          url: `${siteUrl}/#about`,
          availability: "https://schema.org/InStock",
          price: "0",
          priceCurrency: "NPR",
        }
      : undefined,
  };
}

export function buildFaqJsonLd(faqs: Faq[]) {
  if (faqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lecathon 2.0",
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: ORGANIZER_NAME,
    },
  };
}
