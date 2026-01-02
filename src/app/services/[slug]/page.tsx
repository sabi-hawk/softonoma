import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import ServiceTemplate from "@/components/ServiceTemplate";
import { parseServiceTemplateData } from "@/lib/service-template";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering to always fetch fresh data from MongoDB
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicePage({ params }: ServicePageProps) {
  await connectDB();

  const { slug } = await params;

  // Get service
  const service = await Service.findOne({ slug, isPublished: true }).lean();

  if (!service) {
    notFound();
  }

  // Debug logging
  console.log("Service found:", service.title);
  console.log("Service content:", service.content);
  console.log("Service content type:", typeof service.content);
  console.log("Service content length:", service.content?.length || 0);

  // Parse template data
  const templateData = parseServiceTemplateData(service.content || "");

  console.log("Parsed template data:", templateData ? "Success" : "Failed");

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

  return <ServiceTemplate data={templateData} serviceTitle={service.title} />;
}

export async function generateMetadata({ params }: ServicePageProps) {
  await connectDB();
  const { slug } = await params;
  const service = await Service.findOne({ slug, isPublished: true }).lean();

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const title = service.seoTitle || service.title;
  const description = service.seoDescription || service.description || "";
  const keywords = service.seoKeywords || "";
  const ogTitle = service.ogTitle || service.seoTitle || service.title;
  const ogDescription =
    service.ogDescription ||
    service.seoDescription ||
    service.description ||
    "";
  const ogImage = service.ogImage || "";

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
