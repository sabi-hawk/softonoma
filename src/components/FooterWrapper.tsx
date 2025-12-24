import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Footer from "./Footer";

export default async function FooterWrapper() {
  await connectDB();

  // Try to get footer data from a "footer" page or use defaults
  // For now, we'll use defaults. Later this can be made dynamic through admin panel
  const footerPage = await Page.findOne({ slug: "footer" }).lean();

  // If footer page exists, extract data from it
  // Otherwise use sensible defaults for IT company
  const footerData = footerPage
    ? {
        companyName: footerPage.title || "IT Solutions",
        companyDescription: footerPage.content || undefined,
        email: footerPage.seoDescription || undefined, // Reusing fields for now
        phone: footerPage.seoKeywords || undefined,
        address: footerPage.ogDescription || undefined,
      }
    : undefined;

  return <Footer {...footerData} />;
}

