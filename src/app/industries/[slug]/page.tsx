import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Industry from "@/models/Industry";
import IndustryTemplate from "@/components/IndustryTemplate";
import { parseIndustryTemplateData } from "@/lib/industry-template";

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering to always fetch fresh data from MongoDB
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function IndustryPage({ params }: IndustryPageProps) {
  await connectDB();

  const { slug } = await params;

  // Get industry
  const industry = await Industry.findOne({ slug, isPublished: true }).lean();

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
    <IndustryTemplate data={templateData} industryTitle={industry.title} />
  );
}

export async function generateMetadata({ params }: IndustryPageProps) {
  await connectDB();
  const { slug } = await params;
  const industry = await Industry.findOne({ slug, isPublished: true }).lean();

  if (!industry) {
    return {
      title: "Industry Not Found",
    };
  }

  const title = industry.seoTitle || industry.title;
  const description = industry.seoDescription || industry.description || "";
  const keywords = industry.seoKeywords || "";
  const ogTitle = industry.ogTitle || industry.seoTitle || industry.title;
  const ogDescription =
    industry.ogDescription ||
    industry.seoDescription ||
    industry.description ||
    "";
  const ogImage = industry.ogImage || "";

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
