import { ISection } from "@/models/Section";
import Link from "next/link";

interface HeroSectionProps {
  section: ISection;
}

export default function HeroSection({ section }: HeroSectionProps) {
  const { content } = section;

  // Get background media and opacity from content
  const backgroundImage = content.backgroundImage as string | undefined;
  const backgroundVideo = content.backgroundVideo as string | undefined;
  const backgroundOpacity =
    (content.backgroundOpacity as number | undefined) ?? 0.3; // Default 30% opacity

  return (
    <section className="relative py-28 md:py-32 lg:py-36 overflow-hidden theme-bg-black">
      {/* Background Image/Video */}
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0">
          {backgroundVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ opacity: backgroundOpacity }}
            >
              <source src={backgroundVideo} type="video/mp4" />
              <source src={backgroundVideo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : backgroundImage ? (
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                opacity: backgroundOpacity,
              }}
            />
          ) : null}
        </div>
      )}

      {/* Dark overlay to ensure content readability */}
      {(backgroundImage || backgroundVideo) && (
        <div
          className="absolute inset-0 theme-bg-black"
          style={{ opacity: 0.5 }}
        ></div>
      )}

      {/* IT-Themed Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {/* Code-like grid pattern */}
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

        {/* Animated code snippets effect */}
        <div
          className="absolute top-20 right-10 font-mono text-xs"
          style={{ color: "rgba(206, 212, 48, 0.2)" }}
        >
          <div className="animate-pulse">const innovation = {"{"}...</div>
          <div className="animate-pulse delay-75">
            {" "}
            technology: &apos;cutting-edge&apos;,
          </div>
          <div className="animate-pulse delay-150">
            {" "}
            solutions: &apos;transformative&apos;
          </div>
          <div className="animate-pulse delay-200">{"}"}</div>
        </div>

        {/* Geometric shapes */}
        <div
          className="absolute top-40 left-10 w-32 h-32 border rotate-45"
          style={{ borderColor: "rgba(206, 212, 48, 0.2)" }}
        ></div>
        <div
          className="absolute bottom-40 right-20 w-24 h-24 border rounded-full"
          style={{ borderColor: "rgba(92, 140, 36, 0.2)" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 rounded-lg rotate-12"
          style={{ backgroundColor: "rgba(206, 212, 48, 0.1)" }}
        ></div>

        {/* Floating tech elements */}
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-5 animate-float">
          💻
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-5xl opacity-5 animate-float-delayed">
          ⚡
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {content.subtitle && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full"
              style={{
                backgroundColor: "rgba(92, 140, 36, 0.1)",
                border: "1px solid rgba(206, 212, 48, 0.2)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-primary-end)" }}
              ></span>
              <p className="text-sm md:text-base font-medium tracking-wide theme-text-white">
                {content.subtitle}
              </p>
            </div>
          )}

          {content.title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold theme-text-white mb-6 leading-tight">
              <span className="theme-gradient-text">
                {content.title.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </span>
            </h1>
          )}

          {content.description && (
            <p
              className="text-lg md:text-xl theme-text-white mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {content.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {content.buttonText && content.buttonLink && (
              <Link
                href={content.buttonLink}
                className="group relative px-8 py-4 theme-bg-white rounded-lg font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
                style={{ color: "var(--color-black)" }}
              >
                <span className="relative z-10 group-hover:theme-text-white transition-colors">
                  {content.buttonText}
                </span>
                <div className="absolute inset-0 theme-gradient opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            )}
            {content.secondaryButtonText && content.secondaryButtonLink && (
              <Link
                href={String(content.secondaryButtonLink)}
                className="px-8 py-4 bg-transparent border-2 theme-text-white rounded-lg font-semibold text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
              >
                {content.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
