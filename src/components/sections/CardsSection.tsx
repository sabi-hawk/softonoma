"use client";

import { ISection } from "@/models/Section";
import { useState } from "react";

interface CardsSectionProps {
  section: ISection;
}

export default function CardsSection({ section }: CardsSectionProps) {
  const { content } = section;
  const items = Array.isArray(content.items) ? content.items : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsToShow = 3;
  const totalItems = items.length;

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
      visible.push({ item: items[index], originalIndex: index });
    }
    return visible;
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {content.title && (
            <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
              {content.title}
            </h2>
          )}
          {content.description && (
            <p
              className="text-xl theme-text-black max-w-3xl mx-auto"
              style={{ opacity: 0.8 }}
            >
              {content.description}
            </p>
          )}
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8">
              {getVisibleItems().map(({ item, originalIndex }) => (
                <div
                  key={originalIndex}
                  className="group p-8 theme-bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                >
                  {content.showStars !== false && (
                    <div
                      className="mb-4 text-lg"
                      style={{ color: "var(--color-primary-end)" }}
                    >
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  )}
                  {item.quote && (
                    <p
                      className="theme-text-black mb-6 leading-relaxed italic text-sm"
                      style={{ opacity: 0.8 }}
                    >
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  )}
                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    {item.author && (
                      <p className="font-bold theme-text-black mb-1">
                        {item.author}
                      </p>
                    )}
                    {(item.role || item.company) && (
                      <p
                        className="text-xs theme-text-black"
                        style={{ opacity: 0.6 }}
                      >
                        {item.role && `${item.role}`}
                        {item.role && item.company && ", "}
                        {item.company}
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
