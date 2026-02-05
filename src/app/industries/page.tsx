import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";
import Industry from "@/models/Industry";
import SectionRenderer from "@/components/sections/SectionRenderer";
import IndustriesListingSection from "@/components/sections/IndustriesListingSection";
import IndustriesListingPage from "@/components/pages/IndustriesListingPage";
import { getCanonicalUrl } from "@/lib/url-utils";

// Cache industries listing page for 60 seconds to improve performance
export const revalidate = 60;

export default async function IndustriesPage() {
  await connectDB();

  // Get page content
  const page = await Page.findOne({ slug: "industries" })
    .select("_id title slug content templateType pageConfig metaHeaderTags")
    .lean();

  // Fetch all published industries for default listing
  const industries = await Industry.find({ isPublished: true })
    .select("_id title slug description icon order")
    .sort({ order: 1 })
    .lean();

  // If page not found, show default listing
  if (!page) {
    return (
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Industries
          </h1>
          {industries.length > 0 ? (
            <IndustriesListingSection
              section={{
                _id: "default",
                type: "industries-listing",
                content: {
                  title: "Our Industries",
                  industries: industries.map((i) => ({
                    name: i.title,
                    icon: i.icon || "",
                    slug: i.slug,
                  })),
                },
                order: 0,
                isActive: true,
              } as any}
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>No industries available yet.</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // If page has industries-listing template type, use the new listing page component
  if (page.templateType === "industries-listing") {
    // Convert industries to the format expected by IndustriesListingPage
    const serializedIndustries = industries.map((industry) => ({
      _id: industry._id.toString(),
      title: industry.title,
      slug: industry.slug,
      description: industry.description || "",
      icon: industry.icon || "",
      order: industry.order,
    }));

    return (
      <IndustriesListingPage
        pageConfig={page.pageConfig as any}
        industries={serializedIndustries}
      />
    );
  }

  // Fetch sections for the page (for standard template type)
  const sections = await Section.find({
    pageId: page._id,
    isActive: true,
  })
    .select("_id pageId serviceId type content order isActive")
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
    <main className="min-h-screen">
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
        /* Fallback to default listing if no sections */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {page.title}
          </h1>
          {industries.length > 0 ? (
            <IndustriesListingSection
              section={{
                _id: "default",
                type: "industries-listing",
                content: {
                  title: "Our Industries",
                  industries: industries.map((i) => ({
                    name: i.title,
                    icon: i.icon || "",
                    slug: i.slug,
                  })),
                },
                order: 0,
                isActive: true,
              } as any}
            />
          ) : (
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{
                __html: page.content || "<p>No content available.</p>",
              }}
            />
          )}
        </div>
      )}
    </main>
  );
}

export async function generateMetadata() {
  await connectDB();
  const page = await Page.findOne({ slug: "industries" }).lean();

  const canonicalUrl = getCanonicalUrl("/industries");

  if (!page) {
    return {
      title: "Industries",
      description: "Discover our solutions for various industries. Expert services designed for your sector.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: "Industries",
        description: "Discover our solutions for various industries. Expert services designed for your sector.",
        type: "website",
        url: canonicalUrl,
      },
      twitter: {
        card: "summary_large_image",
        title: "Industries",
        description: "Discover our solutions for various industries. Expert services designed for your sector.",
      },
    };
  }

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || page.content?.substring(0, 160).replace(/<[^>]*>/g, "") || "Discover our solutions for various industries. Expert services designed for your sector.";
  const keywords = page.seoKeywords || "";
  const ogTitle = page.ogTitle || page.seoTitle || page.title;
  const ogDescription = page.ogDescription || page.seoDescription || description;
  const ogImage = page.ogImage || "";
  const allowIndexing = page.allowIndexing !== undefined ? page.allowIndexing : true;

  return {
    title,
    description: description.substring(0, 160),
    keywords: keywords
      ? keywords.split(",").map((k: string) => k.trim())
      : undefined,
    robots: allowIndexing ? undefined : { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
