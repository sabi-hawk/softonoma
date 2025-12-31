"use client";

import { ISection } from "@/models/Section";
import { useState, useRef } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface ServicesSectionProps {
  section: ISection;
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
                {getVisibleItems(true).map(({ item: service, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className="group relative p-6 rounded-xl theme-bg-white border border-gray-200 transition-all duration-300 overflow-hidden mx-auto max-w-sm"
                    style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="relative z-10">
                      {service.icon && (
                        <div className="w-16 h-16 mb-6 rounded-xl bg-gray-100 flex items-center justify-center text-3xl transform transition-all duration-300 shadow-sm border border-gray-200">
                          {isIconUrl(service.icon) ? (
                            <img
                              src={service.icon}
                              alt={service.title || "Icon"}
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="theme-text-black text-3xl">
                              {service.icon}
                            </span>
                          )}
                        </div>
                      )}
                      {service.title && (
                        <h3 className="text-xl font-bold theme-text-black mb-3">
                          {service.title}
                        </h3>
                      )}
                      {service.description && (
                        <p
                          className="theme-text-black leading-relaxed text-sm"
                          style={{ opacity: 0.8 }}
                        >
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: Show 3 items */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
                {getVisibleItems(false).map(({ item: service, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className="group relative p-8 rounded-xl theme-bg-white border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                    style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 theme-gradient transition-all duration-300"></div>

                    <div className="relative z-10">
                      {service.icon && (
                        <div className="w-16 h-16 mb-6 rounded-xl bg-gray-100 flex items-center justify-center text-3xl transform group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-200">
                          {isIconUrl(service.icon) ? (
                            <img
                              src={service.icon}
                              alt={service.title || "Icon"}
                              className="w-10 h-10 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="theme-text-black text-3xl">
                              {service.icon}
                            </span>
                          )}
                        </div>
                      )}
                      {service.title && (
                        <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors">
                          {service.title}
                        </h3>
                      )}
                      {service.description && (
                        <p
                          className="theme-text-black leading-relaxed text-sm"
                          style={{ opacity: 0.8 }}
                        >
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
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
      </div>
    </section>
  );
}
