import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Service from "@/models/Service";
import Industry from "@/models/Industry";
import { getBaseUrl } from "@/lib/url-utils";

// Force dynamic rendering - sitemap should be generated at request time
export const dynamic = 'force-dynamic';

// Generate XML sitemap
function generateSitemap(urls: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: string }>): string {
  const baseUrl = getBaseUrl();
  
  const urlEntries = urls.map(({ url, lastmod, changefreq, priority }) => {
    let entry = `    <url>
        <loc>${baseUrl}${url}</loc>`;
    
    if (lastmod) {
      entry += `\n        <lastmod>${lastmod}</lastmod>`;
    }
    
    if (changefreq) {
      entry += `\n        <changefreq>${changefreq}</changefreq>`;
    }
    
    if (priority) {
      entry += `\n        <priority>${priority}</priority>`;
    }
    
    entry += `\n    </url>`;
    return entry;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export async function GET() {
  try {
    await connectDB();

    const baseUrl = getBaseUrl();
    const urls: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: string }> = [];

    // Add homepage
    urls.push({
      url: "/",
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "daily",
      priority: "1.0",
    });

    // Fetch all published pages
    const pages = await Page.find({ isPublished: true })
      .select("slug updatedAt")
      .lean();

    pages.forEach((page) => {
      urls.push({
        url: `/${page.slug}`,
        lastmod: page.updatedAt
          ? new Date(page.updatedAt).toISOString().split("T")[0]
          : undefined,
        changefreq: "weekly",
        priority: page.slug === "home" ? "1.0" : "0.8",
      });
    });

    // Fetch all published services
    const services = await Service.find({ isPublished: true })
      .select("slug updatedAt")
      .lean();

    services.forEach((service) => {
      urls.push({
        url: `/services/${service.slug}`,
        lastmod: service.updatedAt
          ? new Date(service.updatedAt).toISOString().split("T")[0]
          : undefined,
        changefreq: "monthly",
        priority: "0.7",
      });
    });

    // Fetch all published industries
    const industries = await Industry.find({ isPublished: true })
      .select("slug updatedAt")
      .lean();

    industries.forEach((industry) => {
      urls.push({
        url: `/industries/${industry.slug}`,
        lastmod: industry.updatedAt
          ? new Date(industry.updatedAt).toISOString().split("T")[0]
          : undefined,
        changefreq: "monthly",
        priority: "0.7",
      });
    });

    // Generate XML sitemap
    const sitemap = generateSitemap(urls);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Return a minimal sitemap with just the homepage on error
    const minimalSitemap = generateSitemap([
      {
        url: "/",
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "daily",
        priority: "1.0",
      },
    ]);

    return new NextResponse(minimalSitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}

