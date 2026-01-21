import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import Industry from "@/models/Industry";
import Footer from "./Footer";

// Cache footer data for 60 seconds to improve performance
export const revalidate = 60;

export default async function FooterWrapper() {
  await connectDB();

  // Fetch both in parallel for better performance
  const [services, industries] = await Promise.all([
    Service.find({ isPublished: true })
      .select("title slug order")
      .sort({ order: 1 })
      .lean(),
    Industry.find({ isPublished: true })
      .select("title slug order")
      .sort({ order: 1 })
      .lean(),
  ]);

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
