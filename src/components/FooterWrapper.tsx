import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import Industry from "@/models/Industry";
import Footer from "./Footer";

// Force dynamic rendering to always fetch fresh data from MongoDB
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FooterWrapper() {
  await connectDB();

  // Fetch all published services, sorted by order
  const services = await Service.find({ isPublished: true })
    .sort({ order: 1 })
    .select("title slug order")
    .lean();

  // Fetch all published industries, sorted by order
  const industries = await Industry.find({ isPublished: true })
    .sort({ order: 1 })
    .select("title slug order")
    .lean();

  // Serialize ObjectIds to strings
  const serializedServices = services.map((service) => ({
    title: service.title,
    href: `/services/${service.slug}`,
  }));

  const serializedIndustries = industries.map((industry) => ({
    title: industry.title,
    href: `/industries/${industry.slug}`,
  }));

  return (
    <Footer
      services={serializedServices}
      industries={serializedIndustries}
    />
  );
}
