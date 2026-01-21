"use client";

import { ISection } from "@/models/Section";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  section: ISection;
}

export default function HeroSection({ section }: HeroSectionProps) {
  const { content } = section;
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get background media and opacity from content
  const backgroundImage = content.backgroundImage as string | undefined;
  const backgroundVideo = content.backgroundVideo as string | undefined;
  const backgroundOpacity =
    (content.backgroundOpacity as number | undefined) ?? 0.3; // Default 30% opacity

  // Delay video loading to ensure image is LCP
  useEffect(() => {
    if (backgroundVideo && videoRef.current) {
      // Delay video loading by 100ms to ensure image is LCP
      const timer = setTimeout(() => {
        videoRef.current?.load();
        setVideoReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [backgroundVideo]);

  return (
    <section className="relative py-16 sm:py-20 md:py-32 lg:py-36 overflow-hidden theme-bg-black">
      {/* Background Image/Video */}
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0">
          {/* Always render image first for LCP - even if video exists */}
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
          {/* Video loads after image to ensure image is LCP */}
          {backgroundVideo && (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster={backgroundImage}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                opacity: videoReady ? backgroundOpacity : 0, 
                zIndex: 1,
                transition: 'opacity 0.3s ease-in'
              }}
            >
              <source src={backgroundVideo} type="video/mp4" />
              <source src={backgroundVideo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}
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
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full"
              style={{
                backgroundColor: "rgba(92, 140, 36, 0.1)",
                border: "1px solid rgba(206, 212, 48, 0.2)",
              }}
            >
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-primary-end)" }}
              ></span>
              <p className="text-xs sm:text-sm md:text-base font-medium tracking-wide theme-text-white">
                {content.subtitle}
              </p>
            </div>
          )}

          {content.title && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold theme-text-white mb-4 sm:mb-6 leading-tight px-2">
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
              className="text-base sm:text-lg md:text-xl theme-text-white mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2"
              style={{ opacity: 0.9 }}
            >
              {content.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
            {content.buttonText && content.buttonLink && (
              <Link
                href={content.buttonLink}
                className="group relative px-6 py-3 sm:px-8 sm:py-4 theme-bg-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden w-full sm:w-auto"
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
                className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 theme-text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
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
