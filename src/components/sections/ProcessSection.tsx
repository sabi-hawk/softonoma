"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

interface ProcessSectionProps {
  section: ISection;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function ProcessSection({
  section,
}: ProcessSectionProps) {
  const { content } = section;
  const backgroundColor = (content.backgroundColor as string) || getDefaultBackground("process");
  const background = getBackgroundStyle(backgroundColor, content.backgroundColorOpacity as number);

  const steps = Array.isArray(content.steps) ? content.steps : [];

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
        background.className || ""
      }`}
      style={background.style}
    >
      <div className="flex flex-col justify-center items-center max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4">
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

        {steps.length > 0 && (
          <div className="relative max-w-4xl mx-auto w-full">
            {/* Vertical Dashed Line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>

            <div className="space-y-6 sm:space-y-8">
              {steps.map(
                (
                  step: {
                    number?: string;
                    title?: string;
                    description?: string;
                    icon?: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="relative flex items-start gap-3 sm:gap-6 group"
                  >
                    {/* Square Icon */}
                    <div className="relative z-10 shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        {step.icon && isIconUrl(step.icon) ? (
                          <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                            <Image
                              src={step.icon}
                              alt={step.title || `Step ${index + 1}`}
                              fill
                              className="object-contain p-1 sm:p-1.5"
                              unoptimized
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallback =
                                    document.createElement("span");
                                  fallback.textContent =
                                    step.number || String(index + 1);
                                  fallback.className = "text-sm sm:text-base md:text-lg font-bold";
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                        ) : step.icon ? (
                          <span className="text-base sm:text-lg md:text-xl">{step.icon}</span>
                        ) : (
                          <span className="text-sm sm:text-base md:text-lg font-bold">
                            {step.number || index + 1}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 pt-0.5 sm:pt-1">
                      {step.title && (
                        <h3 className="text-lg sm:text-xl font-bold theme-text-black mb-2 sm:mb-3 group-hover:text-[#5c8c24] transition-colors">
                          {step.title}
                        </h3>
                      )}
                      {step.description && (
                        <p
                          className="text-sm sm:text-base theme-text-black leading-relaxed wrap-break-word"
                          style={{ opacity: 0.8 }}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {steps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No process steps to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

