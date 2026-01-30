import Image from "next/image";
import { ISection } from "@/models/Section";
import Link from "next/link";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface AboutSectionProps {
  section: ISection;
}

export default function AboutSection({ section }: AboutSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("about");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );

  return (
    <section
      className={`py-10 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
        background.className || ""
      }`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            {content.title && (
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-6">
                {content.title}
              </h2>
            )}
            {content.aboutText && (
              <p className="text-sm sm:text-lg leading-relaxed theme-text-muted mb-3 sm:mb-6">
                {content.aboutText}
              </p>
            )}
            {content.description && (
              <p className="text-sm sm:text-lg leading-relaxed theme-text-muted mb-4 sm:mb-8">
                {content.description}
              </p>
            )}
            {content.aboutLink && content.aboutLinkText && (
              <Link
                href={content.aboutLink}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-6 sm:py-3 theme-bg-black theme-text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg"
              >
                {content.aboutLinkText}
                <svg
                  className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="relative order-1 lg:order-2">
            {content.aboutImage && (
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                <div className="absolute inset-0 theme-gradient opacity-10"></div>
                <Image
                  src={getImageUrl(content.aboutImage as string)}
                  alt={content.title || "About us"}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  quality={85}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
