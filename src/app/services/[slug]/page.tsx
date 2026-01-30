import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import ServiceTemplate from "@/components/ServiceTemplate";
import { parseServiceTemplateData } from "@/lib/service-template";
import { getCanonicalUrl } from "@/lib/url-utils";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

// Cache service pages for 60 seconds to improve performance
export const revalidate = 60;

export default async function ServicePage({ params }: ServicePageProps) {
  await connectDB();

  const { slug } = await params;

  // Get service
  const service = await Service.findOne({ slug, isPublished: true })
    .select("title content description metaHeaderTags")
    .lean();

  if (!service) {
    notFound();
  }

  // Parse template data
  const templateData = parseServiceTemplateData(service.content || "");

  if (!templateData) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {service.title}
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p>{service.description || "No content available."}</p>
            {service.content && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Content exists but could not be parsed. Content length:{" "}
                  {service.content.length}
                </p>
              </div>
            )}
          </div>
        </article>
      </main>
    );
  }

  return (
    <>
      <main>
        <ServiceTemplate data={templateData} serviceTitle={service.title} />
      </main>
    </>
  );
}

export async function generateMetadata({ params }: ServicePageProps) {
  await connectDB();
  const { slug } = await params;
  const service = await Service.findOne({ slug, isPublished: true }).lean();

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service page could not be found.",
    };
  }

  const title = service.seoTitle || service.title;
  
  // Ensure description is always a non-empty string
  const seoDesc = (service.seoDescription || "").trim();
  const serviceDesc = (service.description || "").trim();
  const defaultDesc = `Explore our ${service.title} services. Professional solutions tailored to your business needs.`;
  
  // Build description with proper fallback chain
  let description = seoDesc || serviceDesc || defaultDesc;
  
  // Final safety check - ensure description is never empty
  if (!description || description.trim().length === 0) {
    description = defaultDesc;
  }
  
  // Ensure description is properly formatted and within limits
  const metaDescription = description.trim().substring(0, 160);
  
  // Final validation - ensure metaDescription is never empty
  const finalDescription = metaDescription && metaDescription.length > 0 
    ? metaDescription 
    : defaultDesc.substring(0, 160);
  
  const keywords = service.seoKeywords || "";
  const ogTitle = service.ogTitle || service.seoTitle || service.title;
  const ogDescription =
    service.ogDescription ||
    service.seoDescription ||
    service.description ||
    finalDescription;
  const ogImage = service.ogImage || "";
  const canonicalUrl = getCanonicalUrl(`/services/${slug}`);
  const allowIndexing = service.allowIndexing !== undefined ? service.allowIndexing : true;

  return {
    title: title || "Service",
    description: finalDescription,
    keywords: keywords
      ? keywords.split(",").map((k: string) => k.trim())
      : undefined,
    robots: allowIndexing ? undefined : { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle || service.title,
      description: (ogDescription || finalDescription).substring(0, 160),
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || service.title,
      description: (ogDescription || finalDescription).substring(0, 160),
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
