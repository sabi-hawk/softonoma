"use client";

import { ISection } from "@/models/Section";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface ServicesSectionProps {
  readonly section: ISection;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function ServicesSection({ section }: ServicesSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("services");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );
  const services = content.services || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const itemsToShow = 3;
  const totalItems = services.length;
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
      // Swipe left - next slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
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
      visible.push({ item: services[index], originalIndex: index });
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
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
        background.className || ""
      }`}
      style={background.style}
    >
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

        {totalItems > 0 && (
          <div className="relative">
            {/* Left Arrow - Hidden on mobile */}
            {totalItems > itemsToShow && (
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                style={{ borderColor: "var(--color-border-default-20)" }}
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
              style={{ touchAction: "pan-y" }}
            >
              {/* Mobile: Show 1 item at a time */}
              <div className="md:hidden overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {services.map((service, index) => (
                    <div
                      key={`service-mobile-${index}-${service.title || index}`}
                      className="group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden shrink-0 w-full mx-2 hover:shadow-lg"
                      style={{ 
                        borderColor: "var(--color-border-default-20)",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        width: "calc(100% - 1rem)"
                      }}
                    >
                      <div className="relative z-10 p-5 sm:p-6">
                        {service.icon && (
                          <div className="w-14 h-14 mb-5 rounded-lg theme-bg-secondary flex items-center justify-center transform transition-all duration-300 group-hover:scale-105">
                            {isIconUrl(service.icon) ? (
                              <div className="relative w-8 h-8">
                                <Image
                                  src={getImageUrl(service.icon)}
                                  alt={service.title || "Service icon"}
                                  fill
                                  sizes="64px"
                                  className="object-contain"
                                  style={{
                                    filter: "grayscale(100%) brightness(0.7) sepia(100%) saturate(1800%) hue-rotate(20deg) brightness(1.25) contrast(1.05)"
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <span 
                                className="text-2xl"
                                style={{ color: "var(--color-primary-end)" }}
                              >
                                {service.icon}
                              </span>
                            )}
                          </div>
                        )}
                        {service.title && (
                          <h3 className="text-lg sm:text-xl font-bold theme-text-primary mb-2 sm:mb-3 group-hover:text-[var(--color-primary-end)] transition-colors">
                            {service.title}
                          </h3>
                        )}
                        {service.description && (
                          <p
                            className="theme-text-muted leading-relaxed text-sm sm:text-base"
                          >
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop: Show 3 items */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-8">
                {getVisibleItems(false).map(
                  ({ item: service, originalIndex }) => (
                    <div
                      key={originalIndex}
                      className="group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                      style={{ 
                        borderColor: "var(--color-border-default-20)",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                      }}
                    >
                      <div className="relative z-10 p-6 sm:p-8">
                        {service.icon && (
                          <div className="w-14 h-14 mb-5 sm:mb-6 rounded-lg theme-bg-secondary flex items-center justify-center transform transition-all duration-300 group-hover:scale-105">
                            {isIconUrl(service.icon) ? (
                              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                                <Image
                                  src={getImageUrl(service.icon)}
                                  alt={service.title || "Service icon"}
                                  fill
                                  sizes="80px"
                                  className="object-contain"
                                  style={{
                                    filter: "grayscale(100%) brightness(0.7) sepia(100%) saturate(1800%) hue-rotate(20deg) brightness(1.25) contrast(1.05)"
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            ) : (
                              <span 
                                className="text-2xl sm:text-3xl"
                                style={{ color: "var(--color-primary-end)" }}
                              >
                                {service.icon}
                              </span>
                            )}
                          </div>
                        )}
                        {service.title && (
                          <h3 className="text-xl sm:text-2xl font-bold theme-text-primary mb-3 group-hover:text-[var(--color-primary-end)] transition-colors">
                            {service.title}
                          </h3>
                        )}
                        {service.description && (
                          <p
                            className="theme-text-muted leading-relaxed text-sm sm:text-base"
                          >
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right Arrow - Hidden on mobile */}
            {totalItems > itemsToShow && (
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                style={{ borderColor: "var(--color-border-default-20)" }}
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
                        ? 'theme-bg-primary-end'
                        : 'bg-gray-400 opacity-40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
