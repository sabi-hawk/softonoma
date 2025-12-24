"use client";

import { ISection } from "@/models/Section";
import { getBackgroundStyle } from "@/lib/section-helpers";
import { getSectionTheme } from "@/lib/section-theme";

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
  const theme = getSectionTheme("process");
  const background = getBackgroundStyle(theme.background, 1);

  const steps = Array.isArray(content.steps) ? content.steps : [];

  return (
    <section
      className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 ${
        background.className || ""
      }`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
              {content.title}
            </h2>
            {content.description && (
              <p className="text-xl theme-text-black max-w-3xl mx-auto" style={{ opacity: 0.8 }}>
                {content.description}
              </p>
            )}
          </div>
        )}

        {steps.length > 0 && (
          <div className="relative">
            {/* Connection Line (for desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 theme-gradient transform -translate-y-1/2" style={{ opacity: 0.3 }}></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
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
                    className="relative flex flex-col items-center text-center group"
                  >
                    {/* Step Number/Icon */}
                    <div className="relative z-10 mb-6">
                      <div className="w-20 h-20 theme-gradient rounded-full flex items-center justify-center theme-text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                        {step.icon && isIconUrl(step.icon) ? (
                          <img
                            src={step.icon}
                            alt={step.title || `Step ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to number if image fails to load
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement("span");
                                fallback.textContent = step.number || String(index + 1);
                                fallback.className = "text-2xl font-bold";
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : step.icon ? (
                          <span className="text-4xl">{step.icon}</span>
                        ) : (
                          <span>{step.number || index + 1}</span>
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="theme-bg-white rounded-xl p-6 shadow-lg border group-hover:shadow-xl transition-all duration-300 w-full" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                      {step.title && (
                        <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors">
                          {step.title}
                        </h3>
                      )}
                      {step.description && (
                        <p className="theme-text-black leading-relaxed" style={{ opacity: 0.8 }}>
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

