import { Helmet } from "react-helmet-async";

/**
 * StructuredData Component
 * 
 * Renders JSON-LD structured data for SEO purposes.
 * Helps search engines understand page content better.
 * 
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export const StructuredData = ({ data }: StructuredDataProps) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

// ============================================================
// Product Structured Data
// ============================================================

interface ProductStructuredDataProps {
  name: string;
  description: string;
  image: string | string[];
  sku?: string;
  brand?: string;
  price: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
  rating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  url?: string;
}

export const ProductStructuredData = ({
  name,
  description,
  image,
  sku,
  brand = "Dua Insan Story",
  price,
  priceCurrency = "IDR",
  availability = "InStock",
  condition = "NewCondition",
  rating,
  url,
}: ProductStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    ...(sku && { sku }),
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency,
      availability: `https://schema.org/${availability}`,
      itemCondition: `https://schema.org/${condition}`,
      ...(url && { url }),
    },
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.ratingValue,
        reviewCount: rating.reviewCount,
        bestRating: rating.bestRating || 5,
        worstRating: rating.worstRating || 1,
      },
    }),
  };

  return <StructuredData data={data} />;
};

// ============================================================
// Review Structured Data
// ============================================================

interface ReviewStructuredDataProps {
  productName: string;
  reviewBody: string;
  reviewRating: number;
  authorName: string;
  datePublished: string;
  bestRating?: number;
  worstRating?: number;
}

export const ReviewStructuredData = ({
  productName,
  reviewBody,
  reviewRating,
  authorName,
  datePublished,
  bestRating = 5,
  worstRating = 1,
}: ReviewStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: productName,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: reviewRating,
      bestRating,
      worstRating,
    },
    author: {
      "@type": "Person",
      name: authorName,
    },
    reviewBody,
    datePublished,
  };

  return <StructuredData data={data} />;
};

// ============================================================
// Breadcrumb Structured Data
// ============================================================

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbStructuredData = ({
  items,
}: BreadcrumbStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={data} />;
};

// ============================================================
// Organization Structured Data
// ============================================================

interface OrganizationStructuredDataProps {
  name?: string;
  url?: string;
  logo?: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
    areaServed?: string;
    availableLanguage?: string[];
  };
  sameAs?: string[]; // Social media URLs
}

export const OrganizationStructuredData = ({
  name = "Dua Insan Story",
  url = "https://duainsanstory.eproject.tech",
  logo = "https://duainsanstory.eproject.tech/newlogo.png",
  contactPoint,
  sameAs = [],
}: OrganizationStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    ...(contactPoint && { contactPoint }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return <StructuredData data={data} />;
};

// ============================================================
// Website Structured Data
// ============================================================

interface WebsiteStructuredDataProps {
  name?: string;
  url?: string;
  description?: string;
  searchUrl?: string;
}

export const WebsiteStructuredData = ({
  name = "Dua Insan Story",
  url = "https://duainsanstory.eproject.tech",
  description = "Platform undangan pernikahan digital dan cetak terbaik di Indonesia",
  searchUrl = "https://duainsanstory.eproject.tech/products?search={search_term_string}",
}: WebsiteStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: searchUrl,
      "query-input": "required name=search_term_string",
    },
  };

  return <StructuredData data={data} />;
};

// ============================================================
// Local Business Structured Data (if applicable)
// ============================================================

interface LocalBusinessStructuredDataProps {
  name?: string;
  image?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  priceRange?: string;
  openingHours?: string[];
}

export const LocalBusinessStructuredData = ({
  name = "Dua Insan Story",
  image = "https://duainsanstory.eproject.tech/newlogo.png",
  address,
  geo,
  telephone,
  priceRange = "Rp 50.000 - Rp 5.000.000",
  openingHours = ["Mo-Sa 09:00-18:00"],
}: LocalBusinessStructuredDataProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    image,
    ...(address && { address }),
    ...(geo && { geo: { "@type": "GeoCoordinates", ...geo } }),
    ...(telephone && { telephone }),
    priceRange,
    openingHoursSpecification: openingHours.map((hours) => {
      const [days, time] = hours.split(" ");
      const [opens, closes] = time.split("-");
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days,
        opens,
        closes,
      };
    }),
  };

  return <StructuredData data={data} />;
};
