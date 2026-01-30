"use client";

import { ISection } from "@/models/Section";
import Link from "next/link";
import Image from "next/image";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface CTASectionProps {
  readonly section: ISection;
}

// Helper to check if image is a URL
const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

export default function CTASection({ section }: CTASectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("cta");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );

  // Get background image and opacity
  const backgroundImage = content.backgroundImage as string | undefined;
  const backgroundOpacity = (content.backgroundOpacity as number | undefined) ?? 0.4;

  return (
    <section
      className={`py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        background.className || ""
      }`}
      style={background.style}
    >
      {/* Background Image */}
      {backgroundImage && isImageUrl(backgroundImage) && (
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(backgroundImage)}
            alt="CTA background"
            fill
            className="object-cover"
            style={{ 
              opacity: backgroundOpacity
            }}
            sizes="100vw"
            quality={85}
          />
        </div>
      )}

      {/* Dark overlay for better text readability when background image exists */}
      {backgroundImage && isImageUrl(backgroundImage) && (
        <div
          className="absolute inset-0 theme-bg-black"
          style={{ opacity: 0.65 }}
        />
      )}

      {/* Subtle background pattern - only show if no background image */}
      {!backgroundImage && (
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(var(--color-primary-end-rgba-10) 1px, transparent 1px),
                linear-gradient(90deg, var(--color-primary-end-rgba-10) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      )}

      <div 
        className={`relative z-10 ${
          (content.textAlign as string) === "left" 
            ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left" 
            : "max-w-4xl mx-auto px-2 text-center"
        }`}
      >
        {content.title && (
          <h2 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-5"
            style={{ 
              color: (content.textColor as string) === "white" ? "white" : "var(--color-text-primary)"
            }}
          >
            {content.title}
          </h2>
        )}
        {content.description && (
          <p
            className={`text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-8 leading-relaxed ${
              (content.textAlign as string) === "left" ? "max-w-2xl" : "max-w-2xl mx-auto"
            }`}
            style={{ 
              color: (content.textColor as string) === "white" ? "white" : "var(--color-text-primary)",
              opacity: 0.9 
            }}
          >
            {content.description}
          </p>
        )}
        {content.buttonText && content.buttonLink && (
          <div 
            className={`flex flex-col sm:flex-row gap-3 items-center ${
              (content.textAlign as string) === "left" ? "justify-start" : "justify-center"
            }`}
          >
            <Link
              href={content.buttonLink}
              className="group inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3 md:px-8 md:py-3.5 rounded-xl text-sm sm:text-base md:text-lg text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
              style={{
                background: "linear-gradient(to right, var(--color-primary-start), var(--color-primary-end))"
              }}
            >
              <span>{content.buttonText}</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            {content.secondaryButtonText && content.secondaryButtonLink && (
              <Link
                href={content.secondaryButtonLink}
                className="group inline-flex items-center gap-2 bg-white border-2 px-6 py-3 sm:px-7 sm:py-3 md:px-8 md:py-3.5 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                style={{ 
                  borderColor: "var(--color-primary-end)",
                  color: (content.textColor as string) === "white" ? "white" : "var(--color-text-primary)"
                }}
              >
                <span>{content.secondaryButtonText}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
