"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useState } from "react";
import Link from "next/link";

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
  const projects = Array.isArray(content.projects) ? content.projects : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsToShow = 3;
  const totalItems = projects.length;

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
      visible.push({ item: projects[index], originalIndex: index });
    }
    return visible;
  };

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white">
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
              {getVisibleItems().map(({ item: project, originalIndex }) => (
                <div
                  key={originalIndex}
                  className="group relative theme-bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden theme-gradient">
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
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      {project.link && (
                        <Link
                          href={project.link}
                          className="theme-text-white font-semibold hover:underline"
                        >
                          View Project →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {project.category && (
                      <span
                        className="inline-block px-3 py-1 text-xs font-semibold theme-primary-end rounded-full mb-3"
                        style={{ backgroundColor: "rgba(206, 212, 48, 0.1)" }}
                      >
                        {project.category}
                      </span>
                    )}
                    {project.title && (
                      <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors">
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

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
