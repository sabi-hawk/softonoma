"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState } from "react";

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
  const partnerships = Array.isArray(content.partnerships)
    ? content.partnerships
    : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsToShow = 3;
  const totalItems = partnerships.length;

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
      visible.push({ item: partnerships[index], originalIndex: index });
    }
    return visible;
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 theme-bg-white-green-gradient">
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
              {getVisibleItems().map(
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
                      {/* Partnership Icon/Image */}
                      {partnership.image && (
                        <div
                          className="w-20 h-20 mb-6 rounded-xl backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg theme-gradient"
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

        {partnerships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300">No partnerships to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
