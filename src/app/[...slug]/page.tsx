import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";
import SectionRenderer from "@/components/sections/SectionRenderer";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DynamicPage({ params }: PageProps) {
  await connectDB();

  const { slug } = await params;
  const pageSlug = slug.join("/");

  // Get page content
  const page = await Page.findOne({ slug: pageSlug, isPublished: true }).lean();

  // If not found, check if page exists but is unpublished (for debugging)
  if (!page) {
    const unpublishedPage = await Page.findOne({ slug: pageSlug }).lean();
    if (unpublishedPage) {
      console.log(
        "Page exists but is unpublished:",
        pageSlug,
        "isPublished:",
        unpublishedPage.isPublished
      );
    } else {
      console.log("Page not found at all:", pageSlug);
      // List all pages with similar slugs for debugging
      const similarPages = await Page.find({
        slug: { $regex: pageSlug.replace(/\//g, "\\/") },
      }).lean();
      console.log(
        "Similar pages found:",
        similarPages.map((p) => ({ slug: p.slug, isPublished: p.isPublished }))
      );
    }
    notFound();
  }

  // All pages use sections approach - get sections
  const sections = await Section.find({ pageId: page._id, isActive: true })
    .sort({ order: 1 })
    .lean();

  // Convert ObjectIds to strings for client components
  const serializedSections = sections.map((section) => ({
    ...section,
    _id: section._id.toString(),
    pageId: section.pageId ? section.pageId.toString() : undefined,
    serviceId: section.serviceId ? section.serviceId.toString() : undefined,
  }));

  return (
    <div className="min-h-screen">
      {/* Render sections if they exist */}
      {serializedSections && serializedSections.length > 0 ? (
        <div>
          {serializedSections.map((section) => (
            <SectionRenderer
              key={section._id}
              section={
                section as unknown as import("@/models/Section").ISection
              }
            />
          ))}
        </div>
      ) : (
        /* Fallback to traditional content if no sections */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {page.title}
            </h1>
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{
                __html: page.content || "<p>No content available.</p>",
              }}
            />
          </article>
        </main>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  await connectDB();
  const { slug } = await params;
  const pageSlug = slug.join("/");
  const page = await Page.findOne({ slug: pageSlug, isPublished: true }).lean();

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || "";
  const keywords = page.seoKeywords || "";
  const ogTitle = page.ogTitle || page.seoTitle || page.title;
  const ogDescription = page.ogDescription || page.seoDescription || "";
  const ogImage = page.ogImage || "";

  return {
    title,
    description,
    keywords: keywords
      ? keywords.split(",").map((k: string) => k.trim())
      : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
