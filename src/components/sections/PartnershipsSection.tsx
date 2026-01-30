"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState, useRef, useEffect } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface PartnershipsSectionProps {
  readonly section: ISection;
}

// Helper to check if image is a URL
const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

export default function PartnershipsSection({
  section,
}: PartnershipsSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("partnerships");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );
  const partnerships = Array.isArray(content.partnerships)
    ? content.partnerships
    : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const itemsToShow = 3;
  const totalItems = partnerships.length;
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
      visible.push({ item: partnerships[index], originalIndex: index });
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
                {partnerships.map((partnership, index) => {
                  const isEven = index % 2 === 1; // 0-indexed: 0=odd(1st), 1=even(2nd), etc.
                  
                  return (
                    <div
                      key={index}
                      className="group relative bg-white rounded-xl border transition-all duration-300 overflow-hidden flex-shrink-0 w-full mx-2 p-3"
                      style={{ 
                        borderColor: "var(--color-border-default)",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        width: "calc(100% - 1rem)"
                      }}
                    >
                      {/* Content Section - First for even cards */}
                      {isEven && (
                        <div className="relative z-10 pb-3">
                          {partnership.title && (
                            <h3 className="text-xl font-bold theme-text-primary mb-3">
                              {partnership.title}
                            </h3>
                          )}
                          {partnership.description && (
                            <p
                              className="theme-text-muted leading-relaxed text-sm"
                            >
                              {partnership.description}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Image Section with Gradient Background */}
                      {partnership.image && (
                        <div className={`relative h-48 overflow-hidden ${isEven ? 'rounded-b-xl' : 'rounded-t-xl'} ${!isEven ? 'pb-3' : ''}`}>
                          {/* Gradient Background Container with padding */}
                          <div className="relative h-full w-full rounded-xl overflow-hidden">
                            {/* Gradient Background - extends behind image, visible on left and right */}
                            <div 
                              className="absolute inset-0"
                              style={{
                                background: "linear-gradient(to bottom, var(--color-primary-start), var(--color-primary-end))",
                                opacity: 0.9
                              }}
                            />
                            
                            {/* White Image Container - centered, overlaps gradient from bottom, leaves sides visible */}
                            <div 
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-xl"
                              style={{
                                width: "90%",
                                height: "90%",
                              }}
                            >
                              <div className="relative w-full h-full flex items-center justify-center">
                                {isImageUrl(partnership.image) ? (
                                  <Image
                                    src={getImageUrl(partnership.image)}
                                    alt={partnership.title || "Partnership"}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className="text-4xl">
                                    {partnership.image}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Content Section - Last for odd cards */}
                      {!isEven && (
                        <div className="relative z-10">
                          {partnership.title && (
                            <h3 className="text-xl font-bold theme-text-primary mb-3">
                              {partnership.title}
                            </h3>
                          )}
                          {partnership.description && (
                            <p
                              className="theme-text-muted leading-relaxed text-sm"
                            >
                              {partnership.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
              {/* Desktop: Show 3 items */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                {getVisibleItems(false).map(
                  ({ item: partnership, originalIndex }, visibleIndex) => {
                    const isEven = originalIndex % 2 === 1; // 0-indexed: 0=odd(1st), 1=even(2nd), etc.
                    
                    return (
                      <div
                        key={`partnership-${originalIndex}-${visibleIndex}-${
                          partnership.title || visibleIndex
                        }`}
                        className="group relative bg-white rounded-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden p-3 sm:p-4"
                        style={{ 
                          borderColor: "var(--color-border-default)",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                        }}
                      >
                        {/* Content Section - First for even cards */}
                        {isEven && (
                          <div className="relative z-10 pb-3 sm:pb-4">
                            {partnership.title && (
                              <h3 className="text-xl font-bold theme-text-primary mb-3 theme-hover-primary transition-colors">
                                {partnership.title}
                              </h3>
                            )}
                            {partnership.description && (
                              <p
                                className="theme-text-muted leading-relaxed text-sm"
                              >
                                {partnership.description}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Image Section with Gradient Background */}
                        {partnership.image && (
                          <div className={`relative h-48 sm:h-56 overflow-hidden ${isEven ? 'rounded-b-xl' : 'rounded-t-xl'} ${!isEven ? 'pb-3 sm:pb-4' : ''}`}>
                            {/* Gradient Background Container with padding */}
                            <div className="relative h-full w-full rounded-xl overflow-hidden">
                              {/* Gradient Background - extends behind image, visible on left and right */}
                              <div 
                                className="absolute inset-0"
                                style={{
                                  background: "linear-gradient(to bottom, var(--color-primary-start), var(--color-primary-end))",
                                  opacity: 0.9
                                }}
                              />
                              
                              {/* White Image Container - centered, overlaps gradient from bottom, leaves sides visible */}
                              <div 
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white rounded-t-xl"
                                style={{
                                  width: "90%",
                                  height: "90%",
                                }}
                              >
                                <div className="relative w-full h-full flex items-center justify-center">
                                  {isImageUrl(partnership.image) ? (
                                    <Image
                                      src={getImageUrl(partnership.image)}
                                      alt={partnership.title || "Partnership"}
                                      fill
                                      sizes="200px"
                                      className="object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <span className="text-4xl">
                                      {partnership.image}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Content Section - Last for odd cards */}
                        {!isEven && (
                          <div className="relative z-10">
                            {partnership.title && (
                              <h3 className="text-xl font-bold theme-text-primary mb-3 theme-hover-primary transition-colors">
                                {partnership.title}
                              </h3>
                            )}
                            {partnership.description && (
                              <p
                                className="theme-text-muted leading-relaxed text-sm"
                              >
                                {partnership.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
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

        {partnerships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300">No partnerships to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
