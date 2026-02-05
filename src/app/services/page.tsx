import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Section from "@/models/Section";
import Service from "@/models/Service";
import SectionRenderer from "@/components/sections/SectionRenderer";
import ServicesListingSection from "@/components/sections/ServicesListingSection";
import ServicesListingPage from "@/components/pages/ServicesListingPage";
import { getCanonicalUrl } from "@/lib/url-utils";

// Cache services listing page for 60 seconds to improve performance
export const revalidate = 60;

export default async function ServicesPage() {
  await connectDB();

  // Get page content
  const page = await Page.findOne({ slug: "services" })
    .select("_id title slug content templateType pageConfig metaHeaderTags")
    .lean();

  // Fetch all published services for default listing
  const services = await Service.find({ isPublished: true })
    .select("_id title slug description icon order")
    .sort({ order: 1 })
    .lean();

  // If page not found, show default listing
  if (!page) {
    return (
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Services
          </h1>
          {services.length > 0 ? (
            <ServicesListingSection
              section={{
                _id: "default",
                type: "services-listing",
                content: {
                  title: "Our Services",
                  services: services.map((s) => ({
                    title: s.title,
                    description: s.description || "",
                    icon: s.icon || "",
                    slug: s.slug,
                  })),
                },
                order: 0,
                isActive: true,
              } as any}
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>No services available yet.</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  // If page has services-listing template type, use the new listing page component
  if (page.templateType === "services-listing") {
    // Convert services to the format expected by ServicesListingPage
    const serializedServices = services.map((service) => ({
      _id: service._id.toString(),
      title: service.title,
      slug: service.slug,
      description: service.description || "",
      icon: service.icon || "",
      order: service.order,
    }));

    return (
      <ServicesListingPage
        pageConfig={page.pageConfig as any}
        services={serializedServices}
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
          {services.length > 0 ? (
            <ServicesListingSection
              section={{
                _id: "default",
                type: "services-listing",
                content: {
                  title: "Our Services",
                  services: services.map((s) => ({
                    title: s.title,
                    description: s.description || "",
                    icon: s.icon || "",
                    slug: s.slug,
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
  const page = await Page.findOne({ slug: "services" }).lean();

  const canonicalUrl = getCanonicalUrl("/services");

  if (!page) {
    return {
      title: "Services",
      description: "Explore our range of professional services tailored to your business needs.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: "Services",
        description: "Explore our range of professional services tailored to your business needs.",
        type: "website",
        url: canonicalUrl,
      },
      twitter: {
        card: "summary_large_image",
        title: "Services",
        description: "Explore our range of professional services tailored to your business needs.",
      },
    };
  }

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || page.content?.substring(0, 160).replace(/<[^>]*>/g, "") || "Explore our range of professional services tailored to your business needs.";
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
