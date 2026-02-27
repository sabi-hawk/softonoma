/**
 * Get base URL for sitemap, robots, and canonical links.
 * Prefers canonical/production domain so search engines index the real site,
 * not Vercel preview URLs.
 */
export function getBaseUrl(): string {
  const canonical = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (canonical) {
    return canonical;
  }
  // Production deployment: use canonical domain so sitemap/robots use the real URL
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.softonoma.com";
  }
  // Preview/deployments and local: use Vercel URL or default
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://www.softonoma.com";
}

/**
 * Generate canonical URL for a given path
 * @param path - The path (e.g., "/about", "/services/web-development")
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // Remove trailing slash except for root
  const cleanPath = normalizedPath === "/" ? "/" : normalizedPath.replace(/\/$/, "");
  return `${baseUrl}${cleanPath}`;
}

