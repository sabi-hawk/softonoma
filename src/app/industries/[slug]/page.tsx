import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Industry from "@/models/Industry";
import IndustryTemplate from "@/components/IndustryTemplate";
import { parseIndustryTemplateData } from "@/lib/industry-template";
import { getCanonicalUrl } from "@/lib/url-utils";

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

// Cache industry pages for 60 seconds to improve performance
export const revalidate = 60;

export default async function IndustryPage({ params }: IndustryPageProps) {
  await connectDB();

  const { slug } = await params;

  // Get industry
  const industry = await Industry.findOne({ slug, isPublished: true })
    .select("title content description metaHeaderTags")
    .lean();

  if (!industry) {
    notFound();
  }

  // Parse template data
  const templateData = parseIndustryTemplateData(industry.content || "");

  if (!templateData) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {industry.title}
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p>{industry.description || "No content available."}</p>
            {industry.content && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Content exists but could not be parsed. Content length:{" "}
                  {industry.content.length}
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
    <IndustryTemplate data={templateData} industryTitle={industry.title} />
      </main>
    </>
  );
}

export async function generateMetadata({ params }: IndustryPageProps) {
  await connectDB();
  const { slug } = await params;
  const industry = await Industry.findOne({ slug, isPublished: true }).lean();

  if (!industry) {
    return {
      title: "Industry Not Found",
      description: "The requested industry page could not be found.",
    };
  }

  const title = industry.seoTitle || industry.title;
  
  // Ensure description is always a non-empty string
  const seoDesc = (industry.seoDescription || "").trim();
  const industryDesc = (industry.description || "").trim();
  const defaultDesc = `Discover our solutions for the ${industry.title} industry. Expert services designed for your sector.`;
  
  // Build description with proper fallback chain
  let description = seoDesc || industryDesc || defaultDesc;
  
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
  
  const keywords = industry.seoKeywords || "";
  const ogTitle = industry.ogTitle || industry.seoTitle || industry.title;
  const ogDescription =
    industry.ogDescription ||
    industry.seoDescription ||
    industry.description ||
    finalDescription;
  const ogImage = industry.ogImage || "";
  const canonicalUrl = getCanonicalUrl(`/industries/${slug}`);
  const allowIndexing = industry.allowIndexing !== undefined ? industry.allowIndexing : true;

  return {
    title: title || "Industry",
    description: finalDescription,
    keywords: keywords
      ? keywords.split(",").map((k: string) => k.trim())
      : undefined,
    robots: allowIndexing ? undefined : { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle || industry.title,
      description: (ogDescription || finalDescription).substring(0, 160),
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || industry.title,
      description: (ogDescription || finalDescription).substring(0, 160),
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
