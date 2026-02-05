import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface ServiceHeroSectionProps {
  title: string;
  description?: string;
  breadcrumbs?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundOpacity?: number;
  heroVideoRef?: React.RefObject<HTMLVideoElement | null>;
  heroVideoReady?: boolean;
  shouldLoadVideo?: boolean;
  heroSectionRef?: React.RefObject<HTMLElement | null>;
}

export default function ServiceHeroSection({
  title,
  description,
  breadcrumbs,
  primaryButtonText,
  primaryButtonLink,
  backgroundImage,
  backgroundVideo,
  backgroundOpacity = 0.3,
  heroVideoRef,
  heroVideoReady = false,
  shouldLoadVideo = false,
  heroSectionRef,
}: ServiceHeroSectionProps) {
  return (
    <section
      ref={heroSectionRef as React.RefObject<HTMLElement>}
      className="relative pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-hidden theme-bg-black"
    >
      <div className="absolute inset-0 bg-black z-0"></div>
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0 z-[1]">
          {backgroundImage && (
            <div className="relative w-full h-full">
              <Image
                src={getImageUrl(backgroundImage)}
                alt="Hero background"
                fill
                priority
                fetchPriority="high"
                className="object-cover"
                style={{ opacity: backgroundOpacity }}
                sizes="100vw"
                quality={85}
              />
            </div>
          )}
          {backgroundVideo && shouldLoadVideo && heroVideoRef && (
            <video
              ref={heroVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster={backgroundImage}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: heroVideoReady ? backgroundOpacity : 0,
                zIndex: 2,
                transition: "opacity 0.5s ease-in",
              }}
            >
              <source src={backgroundVideo} type="video/mp4" />
              <source src={backgroundVideo} type="video/webm" />
            </video>
          )}
        </div>
      )}

      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0 theme-bg-black" style={{ opacity: 0.5 }}></div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-left">
          {breadcrumbs && (
            <div className="text-xs sm:text-sm text-white mb-3 sm:mb-4 opacity-90">{breadcrumbs}</div>
          )}

          {title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-white mb-3 sm:mb-4 leading-tight">
              {title}
            </h1>
          )}

          {description && (
            <p
              className="text-sm sm:text-base md:text-lg theme-text-white mb-4 sm:mb-6 max-w-3xl leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
            {primaryButtonText && (
              <Link
                href={primaryButtonLink || "#contact"}
                className="inline-block px-6 py-2.5 sm:px-8 sm:py-4 theme-bg-primary-mid-dark text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
              >
                {primaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

