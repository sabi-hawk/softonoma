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
                className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
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
              ) => (
                <div
                  key={index}
                  className="theme-bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-4 py-3 sm:px-6 sm:py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl"
                  >
                    <span className="text-base sm:text-lg font-semibold theme-text-black pr-3 sm:pr-4">
                      {faq.question || `Question ${index + 1}`}
                    </span>
                    <div
                      className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent border-2 theme-text-black flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-0">
                      <p
                        className="text-sm sm:text-base theme-text-black leading-relaxed"
                        style={{ opacity: 0.8 }}
                      >
                        {faq.answer || `Answer ${index + 1}`}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {faqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No FAQs to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
