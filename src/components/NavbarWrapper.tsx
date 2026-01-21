import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Service from "@/models/Service";
import Industry from "@/models/Industry";
import Navbar from "./Navbar";

// Cache navigation data for 60 seconds to improve performance
export const revalidate = 60;

export default async function NavbarWrapper() {
  await connectDB();

  // Fetch all data in parallel for better performance
  const [pages, services, industries] = await Promise.all([
    Page.find({ isPublished: true })
      .select("_id title slug order")
      .sort({ order: 1 })
      .lean(),
    Service.find({ isPublished: true })
      .select("_id title slug order navOrder description icon")
      .sort({ order: 1 })
      .lean(),
    Industry.find({ isPublished: true })
      .select("_id title slug order navOrder description icon")
      .sort({ order: 1 })
      .lean(),
  ]);

  // Serialize ObjectIds to strings for client components
  const serializedPages = pages.map((page) => ({
    _id: page._id.toString(),
    title: page.title,
    slug: page.slug,
    order: page.order,
  }));

  const serializedServices = services.map((service) => ({
    _id: service._id.toString(),
    title: service.title,
    slug: service.slug,
    order: service.order,
    navOrder: service.navOrder ?? null,
    description: service.description || "",
    icon: service.icon || "",
  }));

  const serializedIndustries = industries.map((industry) => ({
    _id: industry._id.toString(),
    title: industry.title,
    slug: industry.slug,
    order: industry.order,
    navOrder: industry.navOrder ?? null,
    description: industry.description || "",
    icon: industry.icon || "",
  }));

  return (
    <Navbar
      pages={serializedPages}
      services={serializedServices}
      industries={serializedIndustries}
    />
  );
}
