/**
 * Get base URL from environment or default to production domain
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
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

