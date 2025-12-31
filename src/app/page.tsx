import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";
import SectionRenderer from "@/components/sections/SectionRenderer";

export default async function Home() {
  await connectDB();

  // Look for a page with slug "home" or empty string
  let page = await Page.findOne({
    $or: [{ slug: "home" }, { slug: "" }],
    isPublished: true,
  }).lean();

  // If no home page exists, try to create it or show a message
  if (!page) {
    // Check if there's an unpublished home page
    page = await Page.findOne({
      $or: [{ slug: "home" }, { slug: "" }],
    }).lean();

    if (!page) {
      // No home page at all - redirect to admin or show setup message
  return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your IT Company Website
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Your homepage hasn't been set up yet. Please initialize it from
              the admin panel.
          </p>
            <a
              href="/api/init-homepage"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors mr-4"
            >
              Initialize Homepage
            </a>
            <a
              href="/admin"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Go to Admin Panel
            </a>
          </div>
        </div>
      );
    }
  }

  // Get sections for the homepage
  const sections = await Section.find({ pageId: page._id, isActive: true })
    .sort({ order: 1 })
    .lean();

  // Convert ObjectIds to strings for client components
  const serializedSections = sections.map((section) => ({
    ...section,
    _id: section._id.toString(),
    pageId: section.pageId ? section.pageId.toString() : undefined,
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
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>No sections yet. Add sections from the admin panel to build your homepage.</p>
            </div>
          </article>
      </main>
      )}
    </div>
  );
}

export async function generateMetadata() {
  await connectDB();
  // Prefer published home page, but allow unpublished as fallback
  let page = await Page.findOne({
    $or: [{ slug: "home" }, { slug: "" }],
    isPublished: true,
  }).lean();

  if (!page) {
    page = await Page.findOne({
      $or: [{ slug: "home" }, { slug: "" }],
    }).lean();
  }

  if (!page) {
    return {
      title: "IT Solutions - Home",
      description: "Leading IT solutions provider",
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
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
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
