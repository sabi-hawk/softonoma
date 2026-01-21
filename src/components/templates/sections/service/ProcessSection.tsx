import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { isIconUrl } from "../../utils/helpers";

interface Step {
  number?: string;
  title?: string;
  description?: string;
  icon?: string;
}

interface ProcessSectionProps {
  title: string;
  description?: string;
  steps: Step[];
  backgroundColor?: string;
}

export default function ProcessSection({ title, description, steps, backgroundColor }: ProcessSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("process");
  const background = getBackgroundStyle(bgColor);

  return (
    <section className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${background.className || ""}`} style={background.style}>
      <div className="flex flex-col justify-center items-center max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
            {title}
          </h2>
          {description && (
            <p className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2" style={{ opacity: 0.8 }}>
              {description}
            </p>
          )}
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>

          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex items-start gap-4 sm:gap-6 group">
                <div className="relative z-10 shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 theme-bg-primary-mid-dark rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    {step.icon && isIconUrl(step.icon) ? (
                      <div className="relative w-6 h-6 sm:w-8 sm:h-8">
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
                              const fallback = document.createElement("span");
                              fallback.textContent = step.number || String(index + 1);
                              fallback.className = "text-sm sm:text-lg font-bold";
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                    ) : step.icon ? (
                      <span className="text-lg sm:text-xl">{step.icon}</span>
                    ) : (
                      <span className="text-sm sm:text-lg font-bold">{step.number || index + 1}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 pt-1">
                  {step.title && (
                    <h3 className="text-lg sm:text-xl font-bold theme-text-black mb-2 sm:mb-3 theme-hover-primary-mid transition-colors">
                      {step.title}
                    </h3>
                  )}
                  {step.description && (
                    <p className="text-sm sm:text-base theme-text-black leading-relaxed wrap-break-word" style={{ opacity: 0.8 }}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

