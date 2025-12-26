"use client";

import { ISection } from "@/models/Section";
import { useState } from "react";
import Link from "next/link";

interface BlogSectionProps {
  section: ISection;
}

// Helper to check if image is a URL
const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

export default function BlogSection({ section }: BlogSectionProps) {
  const { content } = section;
  const posts = Array.isArray(content.posts) ? content.posts : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsToShow = 3;
  const totalItems = posts.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  // Get visible items (3 at a time with infinite loop)
  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % totalItems;
      visible.push({ item: posts[index], originalIndex: index });
    }
    return visible;
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 theme-bg-white">
      <div className="max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
              {content.title}
            </h2>
            {content.description && (
              <p
                className="text-xl theme-text-black max-w-3xl mx-auto"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}

        {totalItems > 0 && (
          <div className="relative">
            {/* Left Arrow */}
            {totalItems > itemsToShow && (
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                aria-label="Previous"
              >
                <svg
                  className="w-6 h-6"
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
            )}

            {/* Carousel Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
              {getVisibleItems().map(({ item: post, originalIndex }) => (
                <article
                  key={originalIndex}
                  className="group theme-bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Post Image */}
                  <div className="relative h-48 overflow-hidden theme-gradient">
                    {isImageUrl(post.image) ? (
                      <img
                        src={post.image}
                        alt={post.title || "Blog post"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="theme-text-white text-5xl animate-float">
                          {post.image || "📝"}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    {post.category && (
                      <span
                        className="inline-block px-3 py-1 text-xs font-semibold theme-primary-end rounded-full mb-3"
                        style={{ backgroundColor: "rgba(206, 212, 48, 0.1)" }}
                      >
                        {post.category}
                      </span>
                    )}
                    {post.title && (
                      <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    )}
                    {post.excerpt && (
                      <p
                        className="theme-text-black mb-4 line-clamp-3"
                        style={{ opacity: 0.8 }}
                      >
                        {post.excerpt}
                      </p>
                    )}
                    <div
                      className="flex items-center justify-between text-sm theme-text-black"
                      style={{ opacity: 0.6 }}
                    >
                      <div className="flex items-center gap-4">
                        {post.author && (
                          <span className="flex items-center gap-1">
                            <span>👤</span>
                            {post.author}
                          </span>
                        )}
                        {post.date && (
                          <span className="flex items-center gap-1">
                            <span>📅</span>
                            {post.date}
                          </span>
                        )}
                      </div>
                      {post.link && (
                        <Link
                          href={post.link}
                          className="theme-primary-end font-semibold hover:underline theme-hover-primary"
                        >
                          Read More →
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Right Arrow */}
            {totalItems > itemsToShow && (
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                aria-label="Next"
              >
                <svg
                  className="w-6 h-6"
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
            )}
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
