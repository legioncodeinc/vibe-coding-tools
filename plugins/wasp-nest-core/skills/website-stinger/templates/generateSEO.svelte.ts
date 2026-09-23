// templates/generateSEO.svelte.ts
// Drop into: apps/web/src/lib/seo/generateSEO.ts
//
// SvelteKit metadata helper. Returns a typed object consumed by <svelte:head> in +page.svelte.
// Uses SvelteKit's PUBLIC_* env convention (not NEXT_PUBLIC_*).
// Called from +page.ts load functions.
//
// Usage:
//   // +page.ts
//   export const load: PageLoad = ({ params }) => {
//     return {
//       seo: generateSEO({ title: 'Blog', description: 'Our latest articles', url: '/blog' }),
//     };
//   };
//
//   // +page.svelte
//   <svelte:head>
//     <title>{data.seo.title}</title>
//     <meta name="description" content={data.seo.description} />
//     <!-- etc. -->
//   </svelte:head>

import { PUBLIC_SITE_URL, PUBLIC_SITE_NAME } from '$env/static/public';

export interface SEOProps {
  /** Page-level title. The site name is appended automatically. */
  title: string;
  description: string;
  /** URL path (e.g. '/blog/my-post') or full URL. Full URL constructed from PUBLIC_SITE_URL if path only. */
  url?: string;
  type?: 'website' | 'article';
  /** Absolute URL to the OG image. Defaults to /og-default.png. */
  image?: string;
  imageAlt?: string;
  publishedTime?: string;  // ISO 8601 — for article type
  modifiedTime?: string;   // ISO 8601 — for article type
  author?: string;
  /** Set true for staging, admin, or intentionally excluded pages. */
  noindex?: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  ogImage: string;
  ogImageAlt: string;
  twitterCard: 'summary_large_image' | 'summary';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex: boolean;
}

const DEFAULT_OG_IMAGE = `${PUBLIC_SITE_URL}/og-default.png`;

export function generateSEO(props: SEOProps): SEOData {
  const {
    title,
    description,
    url = '/',
    type = 'website',
    image = DEFAULT_OG_IMAGE,
    imageAlt,
    publishedTime,
    modifiedTime,
    author,
    noindex = false,
  } = props;

  const fullTitle = title.includes(PUBLIC_SITE_NAME)
    ? title
    : `${title} | ${PUBLIC_SITE_NAME}`;

  const canonical = url.startsWith('http') ? url : `${PUBLIC_SITE_URL}${url}`;

  return {
    title: fullTitle,
    description,
    canonical,
    ogTitle: fullTitle,
    ogDescription: description,
    ogUrl: canonical,
    ogType: type,
    ogImage: image,
    ogImageAlt: imageAlt ?? title,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: image,
    publishedTime,
    modifiedTime,
    author,
    noindex,
  };
}
