import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Service from "@/models/Service";
import Industry from "@/models/Industry";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  await connectDB();

  // Fetch all published pages, sorted by order
  const pages = await Page.find({ isPublished: true })
    .sort({ order: 1 })
    .lean();

  // Fetch all published services, sorted by order
  const services = await Service.find({ isPublished: true })
    .sort({ order: 1 })
    .lean();

  // Fetch all published industries, sorted by order
  const industries = await Industry.find({ isPublished: true })
    .sort({ order: 1 })
    .lean();

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
  }));

  const serializedIndustries = industries.map((industry) => ({
    _id: industry._id.toString(),
    title: industry.title,
    slug: industry.slug,
    order: industry.order,
    navOrder: industry.navOrder ?? null,
  }));

  return (
    <Navbar
      pages={serializedPages}
      services={serializedServices}
      industries={serializedIndustries}
    />
  );
}
