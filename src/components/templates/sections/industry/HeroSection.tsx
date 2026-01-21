import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
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

export default function HeroSection({
  title,
  subtitle,
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
}: HeroSectionProps) {
  return (
    <section
      ref={heroSectionRef as React.RefObject<HTMLElement>}
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden theme-bg-black"
    >
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0">
          {backgroundImage && (
            <div className="relative w-full h-full">
              <Image
                src={backgroundImage}
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
                zIndex: 1,
                transition: "opacity 0.3s ease-in",
              }}
            >
              <source src={backgroundVideo} type="video/mp4" />
              <source src={backgroundVideo} type="video/webm" />
            </video>
          )}
        </div>
      )}

      {(backgroundImage || backgroundVideo) && (
        <div
          className="absolute inset-0 theme-bg-black"
          style={{ opacity: 0.5 }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {breadcrumbs && (
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm theme-text-white opacity-80">
              {breadcrumbs}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 theme-text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl theme-primary-mid-dark mb-3 sm:mb-4">
              {subtitle}
            </p>
          )}
          {description && (
            <p
              className="text-sm sm:text-base md:text-lg theme-text-white mb-4 sm:mb-6 max-w-3xl leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {description}
            </p>
          )}
          {primaryButtonText && (
            <Link
              href={primaryButtonLink || "#contact"}
              className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 theme-bg-primary-mid-dark text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
            >
              {primaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

