"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";

interface TechnologiesSectionProps {
  section: ISection;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function TechnologiesSection({
  section,
}: TechnologiesSectionProps) {
  const { content } = section;

  const technologies = Array.isArray(content.technologies)
    ? content.technologies
    : [];

  // Split title to show first part in theme color and rest in white
  const getTitleParts = (title: string) => {
    const lowerTitle = title.toLowerCase();
    // Check for "Our Technologies" or "Technologies"
    if (lowerTitle.includes("technologies")) {
      const techIndex = lowerTitle.indexOf("technologies");
      const beforeTech = title.substring(0, techIndex).trim();
      const techPart = title.substring(techIndex, techIndex + 12); // "Technologies"
      const afterTech = title.substring(techIndex + 12).trim();

      return {
        firstPart: beforeTech ? `${beforeTech} ${techPart}` : techPart,
        rest: afterTech,
      };
    }

    // Default: split on "and" or "&"
    const andIndex = lowerTitle.indexOf(" and ");
    const ampIndex = lowerTitle.indexOf(" & ");
    const splitIndex = andIndex > 0 ? andIndex : ampIndex > 0 ? ampIndex : -1;

    if (splitIndex > 0) {
      return {
        firstPart: title.substring(0, splitIndex).trim(),
        rest: title.substring(splitIndex + (andIndex > 0 ? 5 : 3)).trim(),
      };
    }

    return { firstPart: title, rest: "" };
  };

  const titleParts = content.title ? getTitleParts(content.title) : null;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white-green-gradient relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {titleParts ? (
                <>
                  <span className="theme-text-black">
                    {titleParts.firstPart}
                  </span>
                  {titleParts.rest && (
                    <span className="theme-primary-end">
                      {" "}
                      {titleParts.rest}
                    </span>
                  )}
                </>
              ) : (
                <span className="theme-text-black">{content.title}</span>
              )}
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

        {technologies.length > 0 && (
          <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-3">
              {technologies.map(
                (
                  tech: {
                    name?: string;
                    icon?: string;
                    category?: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="group theme-bg-white rounded-md flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                    style={{ aspectRatio: "5/3", minHeight: "40px" }}
                  >
                    {/* Tech Logo/Icon - Only Logo, No Text */}
                    <div className="w-full h-full flex items-center justify-center relative">
                      {isIconUrl(tech.icon) && tech.icon ? (
                        <Image
                          src={tech.icon}
                          alt={tech.name || "Technology"}
                          fill
                          className="object-contain transition-all duration-300 group-hover:scale-105"
                          unoptimized
                          onError={(e) => {
                            // Fallback to emoji or name if image fails
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              if (tech.icon && !isIconUrl(tech.icon)) {
                                fallback.className = "text-xl md:text-2xl";
                                fallback.textContent = tech.icon;
                              } else if (tech.name) {
                                fallback.className =
                                  "text-xs md:text-sm font-bold theme-text-black text-center";
                                fallback.textContent = tech.name;
                              }
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : tech.icon ? (
                        <div className="text-xl md:text-2xl">{tech.icon}</div>
                      ) : tech.name ? (
                        <div className="text-xs md:text-sm font-semibold theme-text-black text-center">
                          {tech.name}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {technologies.length === 0 && (
          <div className="text-center py-12">
            <p className="theme-text-black" style={{ opacity: 0.7 }}>
              No technologies to display yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
