import { ISection } from "@/models/Section";
import Link from "next/link";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface CTASectionProps {
  section: ISection;
}

export default function CTASection({ section }: CTASectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("cta");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        background.className || ""
      }`}
      style={background.style}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(206, 212, 48, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(206, 212, 48, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {content.title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-4 sm:mb-6 px-2">
            {content.title}
          </h2>
        )}
        {content.description && (
          <p
            className="text-base sm:text-lg md:text-xl theme-text-black mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto px-2"
            style={{ opacity: 0.8 }}
          >
            {content.description}
          </p>
        )}
        {content.buttonText && content.buttonLink && (
          <Link
            href={content.buttonLink}
            className="group inline-flex items-center gap-2 theme-bg-white px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            style={{ color: "var(--color-black)" }}
          >
            <span className="group-hover:theme-gradient-text transition-all">
              {content.buttonText}
            </span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--color-black)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
