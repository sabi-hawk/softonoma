"use client";

import { ISection } from "@/models/Section";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface BlogSectionProps {
  readonly section: ISection;
}

// Helper to check if image is a URL
const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

export default function BlogSection({ section }: BlogSectionProps) {
  const { content } = section;
  const backgroundColor = (content.backgroundColor as string) || getDefaultBackground("blog");
  const background = getBackgroundStyle(backgroundColor, content.backgroundColorOpacity as number);
  const posts = Array.isArray(content.posts) ? content.posts : [];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  // Constants
  const BLOGS_PER_PAGE_DESKTOP = 12; // 3 columns × 4 rows
  const BLOGS_PER_PAGE_MOBILE = 8; // 1 column × 8 rows
  
  // Handle responsive pagination
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.window.innerWidth < 768);
    };
    
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    
    return () => {
      globalThis.window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Calculate pagination
  const totalBlogs = posts.length;
  const blogsPerPage = isMobile ? BLOGS_PER_PAGE_MOBILE : BLOGS_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const displayedPosts = posts.slice(startIndex, endIndex);
  
  // Reset to page 1 when switching between mobile/desktop
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile]);
  
  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    globalThis.window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <section className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${background.className || ""}`} style={background.style}>
      <div className="max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
              {content.title}
            </h2>
            {content.description && (
              <p className="text-base sm:text-lg md:text-xl theme-text-muted max-w-3xl mx-auto px-2">
                {content.description}
              </p>
            )}
          </div>
        )}

        {totalBlogs > 0 && (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {displayedPosts.map((post, index) => {
                // Ensure unique key by combining index with post data
                const uniqueKey = `post-${startIndex + index}-${post.link || post.title || index}`;
                return (
                  <article
                    key={uniqueKey}
                    className="group bg-white rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
                    style={{ 
                      borderColor: "var(--color-border-default-20)",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    {/* Post Image - Center of Attention */}
                    {post.image && isImageUrl(post.image) ? (
                      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                        <Image
                          src={getImageUrl(post.image)}
                          alt={post.title || "Blog post"}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : post.image ? (
                      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden theme-gradient flex items-center justify-center">
                        <div className="theme-text-white text-4xl sm:text-5xl">
                          {post.image}
                        </div>
                      </div>
                    ) : null}

                    {/* Post Content */}
                    <div className="p-5 sm:p-6">
                      {/* Category */}
                      {post.category && (
                        <span
                          className="inline-block px-3 py-1 text-xs font-semibold theme-primary-end rounded-full mb-3"
                          style={{ backgroundColor: "var(--color-primary-end-rgba-10)" }}
                        >
                          {post.category}
                        </span>
                      )}

                      {/* Post Title */}
                      {post.title && (
                        <h3 className="text-lg sm:text-xl font-bold theme-text-primary mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                      )}

                      {/* Post Excerpt */}
                      {post.excerpt && (
                        <p
                          className="theme-text-muted mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base line-clamp-2"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                          {post.excerpt}
                        </p>
                      )}

                      {/* Author and Date */}
                      <div className="flex items-center gap-4 mb-3">
                        {post.author && (
                          <span
                            className="text-xs sm:text-sm theme-text-muted"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            {post.author}
                          </span>
                        )}
                        {post.date && (
                          <span
                            className="text-xs sm:text-sm theme-text-muted"
                            style={{ fontFamily: "var(--font-inter), sans-serif" }}
                          >
                            {post.date}
                          </span>
                        )}
                      </div>

                      {/* Read More Link */}
                      {post.link && (
                        <Link
                          href={post.link}
                          className="theme-primary-end font-semibold hover:underline theme-hover-primary text-sm sm:text-base"
                        >
                          Read More →
                        </Link>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-2 theme-text-black hover:bg-gray-50 shadow-md"
                  }`}
                  style={currentPage !== 1 ? { borderColor: "var(--color-border-default-20)" } : {}}
                  aria-label="Previous page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 py-2 theme-text-black">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-md transition-all ${
                          currentPage === page
                            ? "theme-bg-primary-end text-white shadow-md"
                            : "bg-white border-2 theme-text-black hover:bg-gray-50"
                        }`}
                        style={
                          currentPage !== page
                            ? { borderColor: "var(--color-border-default-20)" }
                            : {}
                        }
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-2 theme-text-black hover:bg-gray-50 shadow-md"
                  }`}
                  style={currentPage !== totalPages ? { borderColor: "var(--color-border-default-20)" } : {}}
                  aria-label="Next page"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {totalBlogs === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
