import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { sanitizeHtml } from "@/lib/sanitize";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

function formatBlogDate(date: Date | string | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  await connectDB();

  const { slug } = await params;

  const post = await Blog.findOne({ slug, isPublished: true }).lean();

  if (!post) {
    notFound();
  }

  const cleanContent = sanitizeHtml(post.content || "");
  const coverImage = post.coverImage ? getImageUrl(post.coverImage) : null;
  const displayDate = formatBlogDate(post.publishedAt || post.updatedAt);
  const showByline = !!(post.author || displayDate);

  return (
    <main className="min-h-screen theme-bg-secondary">
      {/* Hero – blog title; extra top padding below 768px so title clears fixed navbar */}
      <section className="relative pt-32 sm:pt-28 md:pt-32 lg:pt-36 pb-24 md:pb-32 lg:pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden theme-bg-black">
        {/* Background Pattern - Same as Contact / Footer */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        {/* Subtle Accent Overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom right, var(--color-primary-end-rgba-10), transparent, var(--color-primary-end-rgba-5))" }} />
        {/* Content */}
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Card: cover image + title + author + date */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 md:-mt-24">
        <article className="rounded-xl border border-[var(--color-border-default-20)] bg-white shadow-sm overflow-hidden">
          {coverImage && (
            <div className="relative w-full aspect-[3/1] min-h-[120px] sm:min-h-[160px] overflow-hidden rounded-t-xl bg-gray-100">
              <Image
                src={coverImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" aria-hidden />
            </div>
          )}
          <div className="p-4 sm:p-6 md:p-8">
            {showByline && (
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {post.author && (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 overflow-hidden"
                      aria-hidden
                    >
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Author
                      </p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {post.author}
                      </p>
                    </div>
                  </div>
                )}
                {post.author && displayDate && (
                  <div className="hidden sm:block w-px h-8 bg-gray-200" aria-hidden />
                )}
                {displayDate && (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Published
                      </p>
                      <time
                        dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}
                        className="text-sm font-medium text-gray-900"
                      >
                        {displayDate}
                      </time>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </article>

        {/* Content container */}
        <div className="mt-6 rounded-xl border border-[var(--color-border-default-20)] bg-white shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            {post.excerpt && (
              <p className="text-base sm:text-lg theme-text-muted leading-relaxed mb-6 sm:mb-8">
                {post.excerpt}
              </p>
            )}
            <div
              className="blog-post-content theme-text-primary"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </div>
        </div>
      </div>

      <div className="h-12" />
    </main>
  );
}

export async function generateMetadata({ params }: BlogPageProps) {
  await connectDB();
  const { slug } = await params;
  const post = await Blog.findOne({ slug, isPublished: true }).lean();

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || post.content?.replaceAll(/<[^>]*>/g, "").slice(0, 160) || "";

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title: post.ogTitle || title,
      description: post.ogDescription || post.seoDescription || description.slice(0, 160),
      images: post.ogImage ? [getImageUrl(post.ogImage)] : undefined,
    },
    robots: post.allowIndexing === false ? "noindex, nofollow" : "index, follow",
  };
}
