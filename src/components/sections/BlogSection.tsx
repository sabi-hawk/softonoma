"use client";

import { ISection } from "@/models/Section";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

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
  const backgroundColor = (content.backgroundColor as string) || getDefaultBackground("blog");
  const background = getBackgroundStyle(backgroundColor, content.backgroundColorOpacity as number);
  const posts = Array.isArray(content.posts) ? content.posts : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const itemsToShow = 3;
  const totalItems = posts.length;
  const mobileItemsToShow = 1;
  const totalSlides = Math.ceil(totalItems / mobileItemsToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isUserInteractingRef.current = true;
    // Pause auto-slide when user interacts
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
    
    // Resume auto-slide after 3 seconds of no interaction
    resumeAutoSlide();
  };

  // Get visible items (3 at a time on desktop, 1 on mobile)
  const getVisibleItems = (isMobile: boolean = false) => {
    const visible = [];
    const items = isMobile ? mobileItemsToShow : itemsToShow;
    for (let i = 0; i < items; i++) {
      const index = (currentIndex + i) % totalItems;
      visible.push({ item: posts[index], originalIndex: index });
    }
    return visible;
  };

  // Calculate current slide index for dots (mobile)
  const getCurrentSlideIndex = () => {
    return Math.floor(currentIndex / mobileItemsToShow);
  };

  // Resume auto-slide helper
  const resumeAutoSlide = () => {
    setTimeout(() => {
      isUserInteractingRef.current = false;
      // Restart auto-slide
      if (typeof window !== 'undefined' && window.innerWidth < 768 && totalItems > mobileItemsToShow) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
          }
        }, 5000);
      }
    }, 3000);
  };

  // Set up auto-slide on mount and when currentIndex changes (mobile only)
  useEffect(() => {
    // Auto-slide function for mobile only
    const startAutoSlide = () => {
      // Check if mobile (window width < 768px)
      if (typeof window !== 'undefined' && window.innerWidth < 768 && totalItems > mobileItemsToShow) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
          }
        }, 5000); // 5 seconds
      }
    };

    startAutoSlide();
    
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Clear interval on desktop
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
          autoSlideIntervalRef.current = null;
        }
      } else {
        startAutoSlide();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [currentIndex, totalItems, mobileItemsToShow]);

  return (
    <section className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${background.className || ""}`} style={background.style}>
      <div className="max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
              {content.title}
            </h2>
            {content.description && (
              <p
                className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}

        {totalItems > 0 && (
          <div className="relative">
            {/* Left Arrow - Hidden on mobile */}
            {totalItems > itemsToShow && (
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
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

            {/* Carousel Container - Swipeable on mobile */}
            <div
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'pan-y' }}
            >
              {/* Mobile: Show 1 item at a time */}
              <div className="md:hidden overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`
                  }}
                >
                {posts.map((post, index) => (
                  <article
                    key={index}
                    className="group theme-bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 flex-shrink-0 w-full px-4"
                  >
                    <div className="relative h-48 overflow-hidden theme-gradient">
                      {isImageUrl(post.image) ? (
                        <img
                          src={post.image}
                          alt={post.title || "Blog post"}
                          className="w-full h-full object-cover transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="theme-text-white text-5xl">
                            {post.image || "📝"}
                          </div>
                        </div>
                      )}
                    </div>
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
                        <h3 className="text-xl font-bold theme-text-black mb-3 line-clamp-2">
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
                            className="theme-primary-end font-semibold hover:underline"
                          >
                            Read More →
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
                </div>
              </div>
              {/* Desktop: Show 3 items */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                {getVisibleItems(false).map(({ item: post, originalIndex }) => (
                <article
                  key={originalIndex}
                  className="group theme-bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Post Image */}
                  <div className="relative h-48 overflow-hidden theme-gradient">
                    {isImageUrl(post.image) ? (
                      <Image
                        src={post.image}
                        alt={post.title || "Blog post"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            </div>

            {/* Right Arrow - Hidden on mobile */}
            {totalItems > itemsToShow && (
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
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

             {/* Dot Indicators - Only visible on mobile */}
             {totalItems > mobileItemsToShow && (
               <div className="flex justify-center gap-1.5 mt-8 md:hidden">
                 {Array.from({ length: totalSlides }).map((_, index) => (
                   <span
                     key={index}
                     className={`w-1.5 h-1.5 rounded-full transition-all ${
                       getCurrentSlideIndex() === index
                         ? 'bg-[#79b246]'
                         : 'bg-gray-400 opacity-40'
                     }`}
                   />
                 ))}
               </div>
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
