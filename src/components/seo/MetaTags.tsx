import { Helmet } from "react-helmet-async";

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  twitterCard?: "summary" | "summary_large_image";
}

export const MetaTags = ({
  title,
  description,
  image = "/placeholder.svg",
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
  twitterCard = "summary_large_image",
}: MetaTagsProps) => {
  // Ensure image URL is absolute
  const getAbsoluteUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const absoluteImageUrl = getAbsoluteUrl(image);
  const absoluteUrl = url || window.location.href;

  // Truncate description if too long (recommended: 155-160 chars for SEO)
  const truncatedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={truncatedDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="DuaInsan.Story" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={absoluteUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={truncatedDescription} />
      <meta property="twitter:image" content={absoluteImageUrl} />

      {/* Additional Meta Tags */}
      <link rel="canonical" href={absoluteUrl} />
    </Helmet>
  );
};
