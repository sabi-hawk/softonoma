"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState, useRef, useEffect } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface PortfolioSectionProps {
  readonly section: ISection;
}

// Helper to check if image is a URL
const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

export default function PortfolioSection({ section }: PortfolioSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("portfolio");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );
  const projects = Array.isArray(content.projects) ? content.projects : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const itemsToShow = 3;
  const totalItems = projects.length;
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
      visible.push({ item: projects[index], originalIndex: index });
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
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalItems > mobileItemsToShow
      ) {
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
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalItems > mobileItemsToShow
      ) {
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

    window.addEventListener("resize", handleResize);

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [currentIndex, totalItems, mobileItemsToShow]);

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        background.className || ""
      }`}
      style={background.style}
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "var(--color-primary-gradient)"
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: "var(--color-primary-gradient)"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {content.title && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
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

        {totalItems > 0 && (
          <div className="relative">
            {/* Left Arrow - Enhanced styling */}
            {totalItems > itemsToShow && (
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 backdrop-blur-md border theme-text-black rounded-full items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 group"
                style={{ 
                  borderColor: "var(--color-border-default-20)",
                  backgroundColor: "var(--color-bg-overlay)"
                }}
                aria-label="Previous"
              >
                <svg
                  className="w-6 h-6 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
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
              style={{ touchAction: "pan-y" }}
            >
              {/* Mobile: Show 1 item at a time */}
              <div className="md:hidden overflow-hidden px-1">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {projects.map((project, index) => (
                    <div
                      key={`portfolio-mobile-${index}-${project.title || index}`}
                      className="group relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 shrink-0 w-full mx-2 hover:shadow-lg"
                      style={{ 
                        borderColor: "var(--color-border-default-20)",
                        boxShadow: "0 1px 3px 0 var(--color-text-primary-rgba-10), 0 1px 2px 0 var(--color-text-primary-rgba-10)",
                        width: "calc(100% - 1rem)"
                      }}
                    >
                      <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-2xl theme-bg-secondary">
                        {isImageUrl(project.image) && project.image ? (
                          <Image
                            src={getImageUrl(project.image)}
                            alt={project.title || "Project"}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center theme-bg-secondary">
                            <div className="text-5xl">
                              {project.image || "💼"}
                            </div>
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: "linear-gradient(to top, var(--color-text-primary-rgba-50), transparent)"
                          }}
                        />
                        
                        {/* Floating category badge */}
                        {project.category && (
                          <div className="absolute top-3 right-3">
                            <span
                              className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-md"
                              style={{
                                color: "var(--color-text-primary)",
                                backgroundColor: "var(--color-bg-overlay)",
                                border: "1px solid var(--color-border-default-20)"
                              }}
                            >
                              {project.category}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 sm:p-6">
                        {project.title && (
                          <h3 className="text-lg sm:text-xl font-bold theme-text-primary mb-2 group-hover:text-[var(--color-primary-end)] transition-colors">
                            {project.title}
                          </h3>
                        )}
                        {project.description && (
                          <p className="theme-text-muted mb-3 line-clamp-2 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        {Array.isArray(project.technologies) &&
                          project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t"
                              style={{ borderColor: "var(--color-border-default-20)" }}
                            >
                              {project.technologies.slice(0, 3).map(
                                (tech: string, techIndex: number) => (
                                  <span
                                    key={`tech-${techIndex}-${tech}`}
                                    className="px-2.5 py-1 text-xs font-medium theme-text-primary rounded-md"
                                    style={{
                                      backgroundColor: "var(--color-bg-secondary)",
                                    }}
                                  >
                                    {tech}
                                  </span>
                                )
                              )}
                              {project.technologies.length > 3 && (
                                <span className="px-2.5 py-1 text-xs font-medium theme-text-muted rounded-md"
                                  style={{
                                    backgroundColor: "var(--color-bg-secondary)",
                                  }}
                                >
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop: Show 3 items */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-8">
                {getVisibleItems(false).map(
                  ({ item: project, originalIndex }) => (
                    <div
                      key={`portfolio-desktop-${originalIndex}-${project.title || originalIndex}`}
                      className="group relative bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      style={{ 
                        borderColor: "var(--color-border-default-20)",
                        boxShadow: "0 1px 3px 0 var(--color-text-primary-rgba-10), 0 1px 2px 0 var(--color-text-primary-rgba-10)"
                      }}
                    >
                      {/* Project Image */}
                      <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-2xl theme-bg-secondary">
                        {isImageUrl(project.image) && project.image ? (
                          <Image
                            src={getImageUrl(project.image)}
                            alt={project.title || "Project"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center theme-bg-secondary">
                            <div className="text-6xl">
                              {project.image || "💼"}
                            </div>
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: "linear-gradient(to top, var(--color-text-primary-rgba-50), transparent)"
                          }}
                        />
                        
                        {/* Floating category badge */}
                        {project.category && (
                          <div className="absolute top-3 right-3">
                            <span
                              className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md shadow-md"
                              style={{
                                color: "var(--color-text-primary)",
                                backgroundColor: "var(--color-bg-overlay)",
                                border: "1px solid var(--color-border-default-20)"
                              }}
                            >
                              {project.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Project Content */}
                      <div className="p-5 sm:p-6">
                        {project.title && (
                          <h3 className="text-xl sm:text-2xl font-bold theme-text-primary mb-3 group-hover:text-[var(--color-primary-end)] transition-colors">
                            {project.title}
                          </h3>
                        )}
                        {project.description && (
                          <p className="theme-text-muted mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed">
                            {project.description}
                          </p>
                        )}
                        {Array.isArray(project.technologies) &&
                          project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t"
                              style={{ borderColor: "var(--color-border-default-20)" }}
                            >
                              {project.technologies.slice(0, 4).map(
                                (tech: string, techIndex: number) => (
                                  <span
                                    key={`tech-${techIndex}-${tech}-${originalIndex}`}
                                    className="px-2.5 py-1 text-xs font-medium theme-text-primary rounded-md"
                                    style={{
                                      backgroundColor: "var(--color-bg-secondary)",
                                    }}
                                  >
                                    {tech}
                                  </span>
                                )
                              )}
                              {project.technologies.length > 4 && (
                                <span className="px-2.5 py-1 text-xs font-medium theme-text-muted rounded-md"
                                  style={{
                                    backgroundColor: "var(--color-bg-secondary)",
                                  }}
                                >
                                  +{project.technologies.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right Arrow - Enhanced styling */}
            {totalItems > itemsToShow && (
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 backdrop-blur-md border theme-text-black rounded-full items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 group"
                style={{ 
                  borderColor: "var(--color-border-default-20)",
                  backgroundColor: "var(--color-bg-overlay)"
                }}
                aria-label="Next"
              >
                <svg
                  className="w-6 h-6 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Enhanced Dot Indicators - Only visible on mobile */}
            {totalItems > mobileItemsToShow && (
              <div className="flex justify-center gap-2 mt-10 md:hidden">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * mobileItemsToShow)}
                    className={`transition-all duration-300 rounded-full ${
                      getCurrentSlideIndex() === index
                        ? 'w-8 h-2 theme-bg-primary-end'
                        : 'w-2 h-2 opacity-40 hover:opacity-60'
                    }`}
                    style={getCurrentSlideIndex() !== index ? {
                      backgroundColor: "var(--color-text-primary-rgba-20)"
                    } : {}}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-20">📂</div>
            <p className="theme-text-muted text-lg">
              No projects to display yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}