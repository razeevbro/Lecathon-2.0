import {
  buildEventJsonLd,
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";
import type { Faq, SiteSettings } from "@/lib/types/site";

export default function StructuredData({
  settings,
  faqs,
}: {
  settings: SiteSettings;
  faqs: Faq[];
}) {
  const schemas = [
    buildWebSiteJsonLd(),
    buildOrganizationJsonLd(settings),
    buildEventJsonLd(settings),
    buildFaqJsonLd(faqs),
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
