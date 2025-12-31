"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState, useRef } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface TechnologiesSectionProps {
  section: ISection;
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

  // Mobile carousel settings
  const mobileItemsToShow = 4;
  const totalItems = technologies.length;
  const totalSlides = Math.ceil(totalItems / mobileItemsToShow);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
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
  };

  // Get visible items for mobile carousel
  const getVisibleMobileItems = () => {
    const start = currentIndex * mobileItemsToShow;
    const end = Math.min(start + mobileItemsToShow, totalItems);
    return technologies.slice(start, end);
  };

  // Calculate current slide index for dots (mobile)
  const getCurrentSlideIndex = () => {
    return currentIndex;
  };

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
                    <span className="theme-primary-mid">
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
              <p
                className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}

        {technologies.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
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
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentIndex * 100}%)`
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="flex gap-2 sm:gap-3 flex-shrink-0 w-full px-1">
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
                              className="group theme-bg-white rounded-lg flex flex-col items-center justify-center transition-all duration-300 flex-shrink-0"
                              style={{ 
                                aspectRatio: "1/1", 
                                minHeight: "80px",
                                width: `calc((100% - ${(mobileItemsToShow - 1) * 8}px) / ${mobileItemsToShow})`
                              }}
                            >
                              <div className="w-full h-full flex items-center justify-center relative p-2">
                                {isIconUrl(tech.icon) && tech.icon ? (
                                  <div className="relative w-12 h-12">
                                    <Image
                                      src={tech.icon}
                                      alt={tech.name || "Technology"}
                                      fill
                                      className="object-contain transition-all duration-300 group-hover:scale-105"
                                      unoptimized
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        target.style.display = "none";
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const fallback = document.createElement("div");
                                          if (tech.icon && !isIconUrl(tech.icon)) {
                                            fallback.className = "text-lg";
                                            fallback.textContent = tech.icon;
                                          } else if (tech.name) {
                                            fallback.className = "text-xs font-bold theme-text-black text-center";
                                            fallback.textContent = tech.name;
                                          }
                                          parent.appendChild(fallback);
                                        }
                                      }}
                                    />
                                  </div>
                                ) : tech.icon ? (
                                  <div className="text-lg">{tech.icon}</div>
                                ) : tech.name ? (
                                  <div className="text-xs font-semibold theme-text-black text-center px-1">
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
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        getCurrentSlideIndex() === index
                          ? 'bg-[#79b246] w-8'
                          : 'bg-gray-300 w-2'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                    className="group theme-bg-white rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3"
                    style={{ aspectRatio: "1/1", minHeight: "60px" }}
                  >
                    {/* Tech Logo/Icon - Only Logo, No Text */}
                    <div className="w-full h-full flex items-center justify-center relative">
                      {isIconUrl(tech.icon) && tech.icon ? (
                        <div className="relative w-14 h-14">
                          <Image
                            src={tech.icon}
                            alt={tech.name || "Technology"}
                            fill
                            className="object-contain transition-all duration-300 group-hover:scale-105"
                            unoptimized
                            onError={(e) => {
                              // Fallback to emoji or name if image fails
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement("div");
                                if (tech.icon && !isIconUrl(tech.icon)) {
                                  fallback.className = "text-lg";
                                  fallback.textContent = tech.icon;
                                } else if (tech.name) {
                                  fallback.className =
                                    "text-sm font-bold theme-text-black text-center";
                                  fallback.textContent = tech.name;
                                }
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : tech.icon ? (
                        <div className="text-base">{tech.icon}</div>
                      ) : tech.name ? (
                        <div className="text-sm font-semibold theme-text-black text-center px-1">
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
            <p className="theme-text-black" style={{ opacity: 0.7 }}>
              No technologies to display yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
