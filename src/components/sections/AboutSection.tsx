import Image from "next/image";
import { ISection } from "@/models/Section";
import Link from "next/link";

interface AboutSectionProps {
  section: ISection;
}

export default function AboutSection({ section }: AboutSectionProps) {
  const { content } = section;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            {content.title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-6">
                {content.title}
              </h2>
            )}
            {content.aboutText && (
              <p
                className="text-lg leading-relaxed theme-text-black mb-6"
                style={{ opacity: 0.8 }}
              >
                {content.aboutText}
              </p>
            )}
            {content.description && (
              <p
                className="text-lg leading-relaxed theme-text-black mb-8"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
            {content.aboutLink && content.aboutLinkText && (
              <Link
                href={content.aboutLink}
                className="inline-flex items-center gap-2 px-6 py-3 theme-bg-black theme-text-white rounded-lg font-semibold text-base transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg"
              >
                {content.aboutLinkText}
                <svg
                  className="w-5 h-5"
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 theme-gradient opacity-10"></div>
                <Image
                  src={content.aboutImage}
                  alt={content.title || "About us"}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
