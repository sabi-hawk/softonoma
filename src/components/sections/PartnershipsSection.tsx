"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState, useRef } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface PartnershipsSectionProps {
  section: ISection;
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
              <div className="md:hidden">
                {getVisibleItems(true).map(({ item: partnership, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className="group relative p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 overflow-hidden theme-bg-white mx-auto max-w-sm"
                    style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="relative z-10">
                      {partnership.image && (
                        <div
                          className="w-20 h-20 mb-6 rounded-xl backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 shadow-lg theme-bg-primary-mid"
                          style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                        >
                          {isImageUrl(partnership.image) ? (
                            <Image
                              src={partnership.image}
                              alt={partnership.title || "Partnership"}
                              width={56}
                              height={56}
                              className="object-contain p-2"
                              unoptimized
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="theme-text-white text-4xl">
                              {partnership.image}
                            </span>
                          )}
                        </div>
                      )}
                      {partnership.title && (
                        <h3 className="text-xl font-bold theme-text-black mb-3">
                          {partnership.title}
                        </h3>
                      )}
                      {partnership.description && (
                        <p
                          className="theme-text-black leading-relaxed text-sm"
                          style={{ opacity: 0.8 }}
                        >
                          {partnership.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: Show 3 items */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                {getVisibleItems(false).map(
                  ({ item: partnership, originalIndex }, visibleIndex) => (
                    <div
                      key={`partnership-${originalIndex}-${visibleIndex}-${
                        partnership.title || visibleIndex
                      }`}
                      className="group relative p-8 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden theme-bg-white"
                      style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                    >
                      {/* Light gradient overlay on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 theme-gradient transition-all duration-300"></div>

                      <div className="relative z-10">
                        {partnership.image && (
                          <div
                            className="w-20 h-20 mb-6 rounded-xl backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg theme-bg-primary-mid"
                            style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                          >
                            {isImageUrl(partnership.image) ? (
                              <Image
                                src={partnership.image}
                                alt={partnership.title || "Partnership"}
                                width={56}
                                height={56}
                                className="object-contain p-2"
                                unoptimized
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="theme-text-white text-4xl">
                                {partnership.image}
                              </span>
                            )}
                          </div>
                        )}
                        {partnership.title && (
                          <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors">
                            {partnership.title}
                          </h3>
                        )}
                        {partnership.description && (
                          <p
                            className="theme-text-black leading-relaxed text-sm"
                            style={{ opacity: 0.8 }}
                          >
                            {partnership.description}
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
              <div className="flex justify-center gap-2 mt-8 md:hidden">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * mobileItemsToShow)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      getCurrentSlideIndex() === index
                        ? 'bg-[#79b246] w-8'
                        : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
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
