/**
 * All image URLs go through this so production uses CloudFront only (never direct S3).
 * Set NEXT_PUBLIC_CDN_URL to CloudFront distribution URL (e.g. https://d123.cloudfront.net).
 */

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "";
const S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "";
const S3_REGION = process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION || "eu-north-1";

function getS3Origin(): string {
  return S3_BUCKET ? `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com` : "";
}

/** Always returns CloudFront URL when CDN_URL is set; otherwise S3 (dev fallback). */
export function getImageUrl(urlOrKey: string): string {
  if (!urlOrKey) return urlOrKey;

  const isFullUrl = urlOrKey.startsWith("http://") || urlOrKey.startsWith("https://");

  if (isFullUrl) {
    if (!CDN_URL) return urlOrKey;
    try {
      const u = new URL(urlOrKey);
      const s3Origin = getS3Origin();
      if (s3Origin && u.origin === s3Origin) {
        const path = u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
        const base = CDN_URL.endsWith("/") ? CDN_URL.slice(0, -1) : CDN_URL;
        return `${base}${path}`;
      }
      if (u.hostname.includes("s3") && u.hostname.includes("amazonaws.com")) {
        const path = u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
        const base = CDN_URL.endsWith("/") ? CDN_URL.slice(0, -1) : CDN_URL;
        return `${base}${path}`;
      }
    } catch {
      // ignore
    }
    return urlOrKey;
  }

  const key = urlOrKey.startsWith("/") ? urlOrKey.slice(1) : urlOrKey;
  if (!key || (!key.includes("/") && !key.includes("."))) return urlOrKey;

  if (CDN_URL) {
    const base = CDN_URL.endsWith("/") ? CDN_URL.slice(0, -1) : CDN_URL;
    return `${base}/${key}`;
  }
  if (S3_BUCKET) {
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
  }
  return urlOrKey;
}
