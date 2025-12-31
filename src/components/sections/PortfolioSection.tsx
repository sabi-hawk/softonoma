"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface PortfolioSectionProps {
  section: ISection;
}

// Helper to check if image is a URL
const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

export default function PortfolioSection({ section }: PortfolioSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("portfolio");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );
  const projects = Array.isArray(content.projects) ? content.projects : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const itemsToShow = 3;
  const totalItems = projects.length;
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
      visible.push({ item: projects[index], originalIndex: index });
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
                {getVisibleItems(true).map(({ item: project, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className="group relative theme-bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 mx-auto max-w-sm"
                  >
                    <div className="relative h-64 overflow-hidden theme-bg-primary-mid">
                      {isImageUrl(project.image) && project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title || "Project"}
                          fill
                          className="object-cover transition-transform duration-500"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="theme-text-white text-6xl">
                            {project.image || "💼"}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {project.category && (
                        <span
                          className="inline-block px-3 py-1 text-xs font-semibold theme-primary-mid rounded-full mb-3"
                          style={{ backgroundColor: "rgba(121, 178, 70, 0.1)" }}
                        >
                          {project.category}
                        </span>
                      )}
                      {project.title && (
                        <h3 className="text-xl font-bold theme-text-black mb-3">
                          {project.title}
                        </h3>
                      )}
                      {project.description && (
                        <p
                          className="theme-text-black mb-4 line-clamp-3"
                          style={{ opacity: 0.8 }}
                        >
                          {project.description}
                        </p>
                      )}
                      {Array.isArray(project.technologies) &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map(
                              (tech: string, techIndex: number) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 text-xs font-medium theme-text-black rounded"
                                  style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                                  }}
                                >
                                  {tech}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: Show 3 items */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                {getVisibleItems(false).map(({ item: project, originalIndex }) => (
                <div
                  key={originalIndex}
                  className="group relative theme-bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden theme-bg-primary-mid">
                    {isImageUrl(project.image) && project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title || "Project"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="theme-text-white text-6xl animate-float">
                          {project.image || "💼"}
                        </div>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    {/* <div className=" absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      {project.link && (
                        <Link
                          href={project.link}
                          className="theme-text-white font-semibold hover:underline"
                        >
                          View Project →
                        </Link>
                      )}
                    </div> */}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {project.category && (
                      <span
                        className="inline-block px-3 py-1 text-xs font-semibold theme-primary-mid rounded-full mb-3"
                        style={{ backgroundColor: "rgba(121, 178, 70, 0.1)" }}
                      >
                        {project.category}
                      </span>
                    )}
                    {project.title && (
                      <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary-mid transition-colors">
                        {project.title}
                      </h3>
                    )}
                    {project.description && (
                      <p
                        className="theme-text-black mb-4 line-clamp-3"
                        style={{ opacity: 0.8 }}
                      >
                        {project.description}
                      </p>
                    )}
                    {Array.isArray(project.technologies) &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map(
                            (tech: string, techIndex: number) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 text-xs font-medium theme-text-black rounded"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                                }}
                              >
                                {tech}
                              </span>
                            )
                          )}
                        </div>
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

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
