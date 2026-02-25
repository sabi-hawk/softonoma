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
  const [pages, services, industries, blogPage] = await Promise.all([
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
    Page.findOne({ slug: "blogs" }).select("title isPublished").lean(),
  ]);

  // Exclude blog listing page from main nav (it has its own "Blogs" link; avoid duplicate)
  const BLOG_LISTING_SLUGS = ["blog", "blogs"];
  const pagesWithoutBlogListing = pages.filter(
    (p) => !BLOG_LISTING_SLUGS.includes(p.slug)
  );

  // Serialize ObjectIds to strings for client components
  const serializedPages = pagesWithoutBlogListing.map((page) => ({
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

  // Show Blogs in navbar only when the blog listing page is published
  const showBlog = !!(blogPage && blogPage.isPublished);
  const blogTitle = blogPage?.title || "Blogs";

  return (
    <Navbar
      pages={serializedPages}
      services={serializedServices}
      industries={serializedIndustries}
      showBlog={showBlog}
      blogTitle={blogTitle}
    />
  );
}
