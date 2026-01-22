"use client";

import { useState } from "react";
import { ISection } from "@/models/Section";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

interface FAQSectionProps {
  section: ISection;
}

export default function FAQSection({ section }: FAQSectionProps) {
  const { content } = section;
  const backgroundColor = (content.backgroundColor as string) || getDefaultBackground("faq");
  const background = getBackgroundStyle(backgroundColor, content.backgroundColorOpacity as number);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = Array.isArray(content.faqs) ? content.faqs : [];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
        background.className || ""
      }`}
      style={background.style}
    >
      <div className="max-w-4xl mx-auto">
        {content.title && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4">
              {content.title}
            </h2>
            {content.description && (
              <p
                className="text-base sm:text-lg md:text-xl theme-text-primary max-w-3xl mx-auto px-2"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}

        {faqs.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {faqs.map(
              (
                faq: {
                  question?: string;
                  answer?: string;
                },
                index: number
              ) => {
                const isExpanded = openIndex === index;
                return (
                  <div
                    key={index}
                    className="theme-bg-white rounded-xl overflow-hidden shadow-sm"
                    style={{ 
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                    }}
                  >
                    {/* Question Button */}
                    <button
                      onClick={() => toggleFAQ(index)}
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

                    {/* Answer */}
                    {isExpanded && (
                      <div className="overflow-hidden transition-all duration-300">
                        <div className="px-5 py-4 sm:px-6 sm:py-5 theme-bg-secondary rounded-b-xl">
                          <p
                            className="text-sm sm:text-base theme-text-primary leading-relaxed"
                            style={{ opacity: 0.7 }}
                          >
                            {faq.answer || `Answer ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}

        {faqs.length === 0 && (
          <div className="text-center py-12">
            <p className="theme-text-primary" style={{ opacity: 0.7 }}>No FAQs to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
