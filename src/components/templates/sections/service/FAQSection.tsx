import { useState } from "react";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  description?: string;
  items: FAQItem[];
  backgroundColor?: string;
}

export default function FAQSection({ title, description, items, backgroundColor }: FAQSectionProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const bgColor = backgroundColor || getDefaultBackground("faq");
  const background = getBackgroundStyle(bgColor);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <section className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${background.className || ""}`} style={background.style}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
            {title}
          </h2>
          {description && (
            <p className="text-base sm:text-lg md:text-xl theme-text-primary max-w-3xl mx-auto px-2" style={{ opacity: 0.8 }}>
              {description}
            </p>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {items.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="theme-bg-white rounded-xl overflow-hidden shadow-sm"
                style={{ 
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between focus:outline-none transition-all duration-300 ${
                    isExpanded 
                      ? "theme-bg-primary-start theme-text-white rounded-t-xl" 
                      : "theme-bg-secondary theme-text-primary rounded-xl"
                  }`}
                >
                  <span className={`text-base sm:text-lg font-semibold pr-3 sm:pr-4 ${
                    isExpanded ? "theme-text-white" : "theme-text-primary"
                  }`}>
                    {faq.question || `Question ${index + 1}`}
                  </span>
                  <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                    {isExpanded ? (
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <path d="M20 12H4"></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        <path d="M12 4v16m8-8H4"></path>
                      </svg>
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="overflow-hidden transition-all duration-300">
                    <div className="px-5 py-4 sm:px-6 sm:py-5 theme-bg-secondary rounded-b-xl">
                      <p className="text-sm sm:text-base theme-text-muted leading-relaxed">
                        {faq.answer || `Answer ${index + 1}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

