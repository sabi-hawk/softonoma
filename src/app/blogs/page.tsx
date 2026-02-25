import connectDB from "@/lib/mongodb";
import Page from "@/models/Page";
import Blog from "@/models/Blog";
import BlogListingPage from "@/components/pages/BlogListingPage";
import { getCanonicalUrl } from "@/lib/url-utils";

// Cache blog listing page for 60 seconds to improve performance
export const revalidate = 60;

export default async function BlogsPage() {
  await connectDB();

  // Get page content (Page slug is "blogs" in DB; URL is /blogs)
  let page = await Page.findOne({ slug: "blogs" })
    .select("_id title slug content templateType pageConfig metaHeaderTags")
    .lean();
  if (!page) {
    page = await Page.findOne({ slug: "blog" })
      .select("_id title slug content templateType pageConfig metaHeaderTags")
      .lean();
  }

  // Fetch all published blogs for listing
  const blogs = await Blog.find({ isPublished: true })
    .select("_id title slug excerpt coverImage author publishedAt createdAt")
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  // If page not found, show default listing
  if (!page) {
    const serializedBlogs = blogs.map((blog) => ({
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      coverImage: blog.coverImage || "",
      author: blog.author || "",
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
    }));

    return (
      <BlogListingPage
        pageConfig={undefined}
        blogs={serializedBlogs}
      />
    );
  }

  // If page has blog-listing template type, use the listing page component
  if (page.templateType === "blog-listing") {
    const serializedBlogs = blogs.map((blog) => ({
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      coverImage: blog.coverImage || "",
      author: blog.author || "",
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
    }));

    return (
      <BlogListingPage
        pageConfig={page.pageConfig as any}
        blogs={serializedBlogs}
      />
    );
  }

  // Fallback for other template types
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {page.title}
        </h1>
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <a
                key={blog._id.toString()}
                href={`/blog/${blog.slug}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {blog.title}
                </h2>
                {blog.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {blog.excerpt}
                  </p>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p>No blog posts available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export async function generateMetadata() {
  await connectDB();
  let page = await Page.findOne({ slug: "blogs" }).lean();
  if (!page) page = await Page.findOne({ slug: "blog" }).lean();

  const canonicalUrl = getCanonicalUrl("/blogs");

  if (!page) {
    return {
      title: "Blogs",
      description: "Read our latest articles, insights, and updates.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: "Blogs",
        description: "Read our latest articles, insights, and updates.",
        type: "website",
        url: canonicalUrl,
      },
      twitter: {
        card: "summary_large_image",
        title: "Blogs",
        description: "Read our latest articles, insights, and updates.",
      },
    };
  }

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || page.content?.substring(0, 160).replace(/<[^>]*>/g, "") || "Read our latest articles, insights, and updates.";
  const keywords = page.seoKeywords || "";
  const ogTitle = page.ogTitle || page.seoTitle || page.title;
  const ogDescription = page.ogDescription || page.seoDescription || description;
  const ogImage = page.ogImage || "";
  const allowIndexing = page.allowIndexing !== undefined ? page.allowIndexing : true;

  return {
    title,
    description: description.substring(0, 160),
    keywords: keywords
      ? keywords.split(",").map((k: string) => k.trim())
      : undefined,
    robots: allowIndexing ? undefined : { index: false, follow: false },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
