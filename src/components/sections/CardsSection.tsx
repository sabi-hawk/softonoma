"use client";

import { ISection } from "@/models/Section";
import { useState, useRef, useEffect } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import Image from "next/image";

interface CardsSectionProps {
  section: ISection;
}

export default function CardsSection({ section }: CardsSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("cards");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );
  const items = Array.isArray(content.items) ? content.items : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const itemsToShow = 3;
  const totalItems = items.length;
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
    const itemsCount = isMobile ? mobileItemsToShow : itemsToShow;
    for (let i = 0; i < itemsCount; i++) {
      const index = (currentIndex + i) % totalItems;
      visible.push({ item: items[index], originalIndex: index });
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
        {/* Header Section - Aligned with cards */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-left px-6 sm:px-8 md:px-8">
          {/* Quote Icon */}
          <div className="mb-4 sm:mb-5">
            <Image
              src="https://newkit.creativemox.com/softlow/wp-content/uploads/sites/8/2025/12/Left-quote-traced.png"
              alt="Quote icon"
              width={60}
              height={60}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              unoptimized
            />
          </div>

          {/* Title */}
          {content.title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold theme-text-primary mb-3 sm:mb-4">
              {content.title}
            </h2>
          )}

          {/* Description */}
          {content.description && (
            <p
              className="text-sm sm:text-base md:text-lg theme-text-primary leading-relaxed"
              style={{ 
                opacity: 0.7,
                fontFamily: "var(--font-inter), sans-serif"
              }}
            >
              {content.description}
            </p>
          )}
        </div>

        {totalItems > 0 && (
          <div className="relative">
            {/* Left Arrow - Desktop Only */}
            {totalItems > itemsToShow && (
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 bg-white border-2 theme-text-primary rounded-full items-center justify-center shadow-md hover:scale-110 transition-all"
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
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="group p-6 sm:p-8 theme-bg-secondary rounded-2xl border flex-shrink-0 w-full shadow-sm transition-all duration-300"
                    style={{ 
                      borderColor: "var(--color-border-default-20)",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    {/* Client Name */}
                    {item.author && (
                      <p className="text-lg sm:text-xl font-bold theme-text-primary mb-1">
                        {item.author}
                      </p>
                    )}

                    {/* Client Title/Role */}
                    {(item.role || item.company) && (
                      <p
                        className="text-xs sm:text-sm theme-text-primary mb-4 sm:mb-6 uppercase tracking-wide"
                        style={{ 
                          opacity: 0.6,
                          fontFamily: "var(--font-inter), sans-serif"
                        }}
                      >
                        {item.role && `${item.role}`}
                        {item.role && item.company && " "}
                        {item.company}
                      </p>
                    )}

                    {/* Quote */}
                    {item.quote && (
                      <p
                        className="theme-text-primary mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
                        style={{ 
                          opacity: 0.7,
                          fontFamily: "var(--font-inter), sans-serif"
                        }}
                      >
                        {item.quote}
                      </p>
                    )}

                    {/* Profile Picture */}
                    {item.image && (
                      <div className="mt-6">
                        <Image
                          src={item.image}
                          alt={item.author || "Client"}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                ))}
                </div>
              </div>

              {/* Desktop: Show 3 items with slider */}
              <div className="hidden md:flex md:gap-6 lg:gap-8 px-8">
                {getVisibleItems(false).map(({ item, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className="group shrink-0 p-6 sm:p-8 theme-bg-secondary rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{ 
                      width: "calc(33.333% - 1rem)",
                      borderColor: "var(--color-border-default-20)",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    {/* Client Name */}
                    {item.author && (
                      <p className="text-lg sm:text-xl font-bold theme-text-primary mb-1">
                        {item.author}
                      </p>
                    )}

                    {/* Client Title/Role */}
                    {(item.role || item.company) && (
                      <p
                        className="text-xs sm:text-sm theme-text-primary mb-4 sm:mb-6 uppercase tracking-wide"
                        style={{ 
                          opacity: 0.6,
                          fontFamily: "var(--font-inter), sans-serif"
                        }}
                      >
                        {item.role && `${item.role}`}
                        {item.role && item.company && " "}
                        {item.company}
                      </p>
                    )}

                    {/* Quote */}
                    {item.quote && (
                      <p
                        className="theme-text-primary mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
                        style={{ 
                          opacity: 0.7,
                          fontFamily: "var(--font-inter), sans-serif"
                        }}
                      >
                        {item.quote}
                      </p>
                    )}

                    {/* Profile Picture */}
                    {item.image && (
                      <div className="mt-6">
                        <Image
                          src={item.image}
                          alt={item.author || "Client"}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow - Desktop Only */}
            {totalItems > itemsToShow && (
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 bg-white border-2 theme-text-primary rounded-full items-center justify-center shadow-md hover:scale-110 transition-all"
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
