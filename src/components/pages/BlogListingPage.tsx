"use client";

import Link from "next/link";
import Image from "next/image";
import { IPageConfig } from "@/models/Page";
import { getImageUrl } from "@/lib/image-utils";
import ListingHero from "./ListingHero";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: Date;
  createdAt: Date;
}

interface BlogListingPageProps {
  pageConfig?: IPageConfig;
  blogs: Blog[];
}

export default function BlogListingPage({ pageConfig, blogs }: BlogListingPageProps) {
  const hero = pageConfig?.hero;
  const display = pageConfig?.display as (Record<string, unknown> | undefined);

  const showHero = !!(hero && hero.showHero !== false && (hero.title || hero.description));
  const showExcerpts = display?.showExcerpts !== false;
  const showCoverImages = display?.showCoverImages !== false;
  const showAuthor = display?.showAuthor !== false;
  const showDate = display?.showDate !== false;

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen">
      <ListingHero hero={hero} subtitle="Our Blogs" />

      {/* Blog cards - same layout and styling as BlogSection */}
      <section className={`px-4 sm:px-6 lg:px-8 ${showHero ? "py-12 sm:py-16 md:py-24" : "pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-12 sm:pb-16 md:pb-24"}`}>
        <div className="max-w-7xl mx-auto">
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="group bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
                  style={{
                    borderColor: "var(--color-border-default-20)",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Link href={`/blog/${blog.slug}`} className="block">
                    {/* Cover Image - same as BlogSection */}
                    {showCoverImages && blog.coverImage ? (
                      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                        <Image
                          src={getImageUrl(blog.coverImage)}
                          alt={blog.title || "Blog post"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : null}

                    {/* Post Content - same structure as BlogSection */}
                    <div className="p-5 sm:p-6">
                      {/* Post Title */}
                      {blog.title && (
                        <h3 className="text-lg sm:text-xl font-bold theme-text-primary mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                      )}

                      {/* Post Excerpt */}
                      {showExcerpts && blog.excerpt && (
                        <p
                          className="theme-text-muted mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-2"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                          {blog.excerpt}
                        </p>
                      )}

                      {/* Author and Date */}
                      <div className="flex items-center gap-4 mb-3">
                        {showAuthor && blog.author && (
                          <span
                            className="text-xs sm:text-sm theme-text-muted"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            {blog.author}
                          </span>
                        )}
                        {showDate && (
                          <span
                            className="text-xs sm:text-sm theme-text-muted"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        )}
                      </div>

                      {/* Read More Link */}
                      <span className="theme-primary-end font-semibold hover:underline theme-hover-primary text-sm sm:text-base">
                        Read More →
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg theme-text-muted">No blog posts available yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
