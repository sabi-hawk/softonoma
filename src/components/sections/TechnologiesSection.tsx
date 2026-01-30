"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState, useRef, useEffect } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface TechnologiesSectionProps {
  readonly section: ISection;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function TechnologiesSection({
  section,
}: TechnologiesSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("technologies");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );

  const technologies = Array.isArray(content.technologies)
    ? content.technologies
    : [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  // Mobile carousel settings
  const mobileItemsToShow = 4;
  const totalItems = technologies.length;
  const totalSlides = Math.ceil(totalItems / mobileItemsToShow);

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
      // Swipe left - next slide
      setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1));
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }

    touchStartX.current = null;
    touchEndX.current = null;
    
    // Resume auto-slide after 3 seconds of no interaction
    resumeAutoSlide();
  };

  // Calculate current slide index for dots (mobile)
  const getCurrentSlideIndex = () => {
    return currentIndex;
  };

  // Resume auto-slide helper
  const resumeAutoSlide = () => {
    setTimeout(() => {
      isUserInteractingRef.current = false;
      // Restart auto-slide
      if (typeof window !== 'undefined' && window.innerWidth < 768 && totalSlides > 1) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setCurrentIndex((prev) => (prev + 1) % totalSlides);
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
      if (typeof window !== 'undefined' && window.innerWidth < 768 && totalSlides > 1) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setCurrentIndex((prev) => (prev + 1) % totalSlides);
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
  }, [currentIndex, totalSlides]);

  // Split title to show first part in theme color and rest in white
  const getTitleParts = (title: string) => {
    const lowerTitle = title.toLowerCase();
    // Check for "Our Technologies" or "Technologies"
    if (lowerTitle.includes("technologies")) {
      const techIndex = lowerTitle.indexOf("technologies");
      const beforeTech = title.substring(0, techIndex).trim();
      const techPart = title.substring(techIndex, techIndex + 12); // "Technologies"
      const afterTech = title.substring(techIndex + 12).trim();

      return {
        firstPart: beforeTech ? `${beforeTech} ${techPart}` : techPart,
        rest: afterTech,
      };
    }

    // Default: split on "and" or "&"
    const andIndex = lowerTitle.indexOf(" and ");
    const ampIndex = lowerTitle.indexOf(" & ");
    const splitIndex = andIndex > 0 ? andIndex : ampIndex > 0 ? ampIndex : -1;

    if (splitIndex > 0) {
      return {
        firstPart: title.substring(0, splitIndex).trim(),
        rest: title.substring(splitIndex + (andIndex > 0 ? 5 : 3)).trim(),
      };
    }

    return { firstPart: title, rest: "" };
  };

  const titleParts = content.title ? getTitleParts(content.title) : null;

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        background.className || ""
      }`}
      style={background.style}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              {titleParts ? (
                <>
                  <span className="theme-text-black">
                    {titleParts.firstPart}
                  </span>
                  {titleParts.rest && (
                    <span className="theme-primary-mid-dark">
                      {" "}
                      {titleParts.rest}
                    </span>
                  )}
                </>
              ) : (
                <span className="theme-text-black">{content.title}</span>
              )}
            </h2>
            {content.description && (
<p className="text-base sm:text-lg md:text-xl theme-text-muted max-w-3xl mx-auto px-2">
                {content.description}
              </p>
            )}
          </div>
        )}

        {technologies.length > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Mobile: Horizontal Scrollable Carousel - Shows 4 items at a time */}
            <div className="md:hidden">
              <div
                ref={scrollContainerRef}
                className="relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'pan-y' }}
              >
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentIndex * 100}%)`
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="flex gap-3 shrink-0 w-full px-2">
                      {technologies
                        .slice(slideIndex * mobileItemsToShow, (slideIndex + 1) * mobileItemsToShow)
                        .map(
                          (
                            tech: {
                              name?: string;
                              icon?: string;
                              category?: string;
                            },
                            itemIndex: number
                          ) => (
                            <div
                              key={`${slideIndex}-${itemIndex}`}
                              className="group bg-white rounded-xl border flex flex-col items-center justify-center transition-all duration-300 shrink-0 hover:shadow-md"
                              style={{ 
                                aspectRatio: "1/1", 
                                minHeight: "90px",
                                width: `calc((100% - ${(mobileItemsToShow - 1) * 12}px) / ${mobileItemsToShow})`,
                                borderColor: "var(--color-border-default-20)",
                                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                              }}
                            >
                              <div className="w-full h-full flex items-center justify-center relative p-3">
                                {isIconUrl(tech.icon) && tech.icon ? (
                                  <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                    <Image
                                      src={tech.icon}
                                      alt={tech.name || "Technology"}
                                      fill
                                      className="object-contain transition-all duration-300 group-hover:scale-110"
                                      unoptimized
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        target.style.display = "none";
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const fallback = document.createElement("div");
                                          if (tech.icon && !isIconUrl(tech.icon)) {
                                            fallback.className = "text-2xl";
                                            fallback.textContent = tech.icon;
                                          } else if (tech.name) {
                                            fallback.className = "text-xs font-semibold theme-text-primary text-center";
                                            fallback.textContent = tech.name;
                                          }
                                          parent.appendChild(fallback);
                                        }
                                      }}
                                    />
                                  </div>
                                ) : tech.icon ? (
                                  <div className="text-2xl">{tech.icon}</div>
                                ) : tech.name ? (
                                  <div className="text-xs font-semibold theme-text-primary text-center px-2">
                                    {tech.name}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dot Indicators for Mobile */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-1.5 mt-6">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <span
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        getCurrentSlideIndex() === index
                          ? 'theme-bg-primary-end'
                          : 'bg-gray-400 opacity-40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Flex Layout - Centered */}
            <div className="hidden md:flex md:flex-wrap md:justify-center gap-4 lg:gap-6">
              {technologies.map(
                (
                  tech: {
                    name?: string;
                    icon?: string;
                    category?: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl border flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden p-4 lg:p-5"
                    style={{ 
                      aspectRatio: "1/1", 
                      width: "120px",
                      height: "120px",
                      minHeight: "100px",
                      borderColor: "var(--color-border-default-20)",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    {/* Tech Logo/Icon */}
                    <div className="w-full h-full flex items-center justify-center relative">
                      {isIconUrl(tech.icon) && tech.icon ? (
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                          <Image
                            src={getImageUrl(tech.icon)}
                            alt={tech.name || "Technology"}
                            fill
                            sizes="120px"
                            className="object-contain transition-all duration-300 group-hover:scale-110"
                            onError={(e) => {
                              // Fallback to emoji or name if image fails
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement("div");
                                if (tech.icon && !isIconUrl(tech.icon)) {
                                  fallback.className = "text-3xl";
                                  fallback.textContent = tech.icon;
                                } else if (tech.name) {
                                  fallback.className =
                                    "text-sm font-semibold theme-text-primary text-center px-2";
                                  fallback.textContent = tech.name;
                                }
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : tech.icon ? (
                        <div className="text-3xl">{tech.icon}</div>
                      ) : tech.name ? (
                        <div className="text-sm font-semibold theme-text-primary text-center px-2">
                          {tech.name}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {technologies.length === 0 && (
          <div className="text-center py-12">
            <p className="theme-text-muted">
              No technologies to display yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
