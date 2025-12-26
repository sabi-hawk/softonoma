"use client";

import { ISection } from "@/models/Section";
import { useState } from "react";

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
  const services = content.services || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsToShow = 3;
  const totalItems = services.length;

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
      visible.push({ item: services[index], originalIndex: index });
    }
    return visible;
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 theme-bg-white">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
              {getVisibleItems().map(({ item: service, originalIndex }) => (
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
      </div>
    </section>
  );
}
