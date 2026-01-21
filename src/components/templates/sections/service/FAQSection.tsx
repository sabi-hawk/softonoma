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
            <p className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2" style={{ opacity: 0.8 }}>
              {description}
            </p>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          {items.map((faq, index) => (
            <div
              key={index}
              className="theme-bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl"
              >
                <span className="text-base sm:text-lg font-semibold theme-text-black pr-3 sm:pr-4">
                  {faq.question || `Question ${index + 1}`}
                </span>
                <div
                  className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent border-2 theme-text-black flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                  style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? "max-h-96" : "max-h-0"}`}>
                <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-0">
                  <p className="text-sm sm:text-base theme-text-black leading-relaxed" style={{ opacity: 0.8 }}>
                    {faq.answer || `Answer ${index + 1}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

