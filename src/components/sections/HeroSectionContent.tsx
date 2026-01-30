"use client";

import { ISection } from "@/models/Section";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@/lib/image-utils";

interface HeroSectionContentProps {
  section: ISection;
}

export default function HeroSectionContent({ section }: HeroSectionContentProps) {
  const { content } = section;
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const backgroundImage = content.backgroundImage as string | undefined;
  const backgroundVideo = content.backgroundVideo as string | undefined;
  const backgroundOpacity =
    (content.backgroundOpacity as number | undefined) ?? 0.3;

  useEffect(() => {
    if (backgroundVideo && videoRef.current) {
      const timer = setTimeout(() => {
        videoRef.current?.load();
        setVideoReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [backgroundVideo]);

  return (
    <>
      {/* Dark overlay */}
      {(backgroundImage || backgroundVideo) && (
        <div
          className="absolute inset-0 theme-bg-black"
          style={{ opacity: 0.5 }}
        />
      )}

      {/* IT-Themed Background Pattern */}
      <div className="absolute inset-0 opacity-10">
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
        <div
          className="absolute top-20 right-10 font-mono text-xs"
          style={{ color: "var(--color-primary-end-rgba-20)" }}
        >
          <div className="animate-pulse">const innovation = {"{"}...</div>
          <div className="animate-pulse delay-75"> technology: &apos;cutting-edge&apos;,</div>
          <div className="animate-pulse delay-150"> solutions: &apos;transformative&apos;</div>
          <div className="animate-pulse delay-200">{"}"}</div>
        </div>
        <div
          className="absolute top-40 left-10 w-32 h-32 border rotate-45"
          style={{ borderColor: "var(--color-primary-end-rgba-20)" }}
        />
        <div
          className="absolute bottom-40 right-20 w-24 h-24 border rounded-full"
          style={{ borderColor: "var(--color-primary-start-rgba-20)" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 rounded-lg rotate-12"
          style={{ backgroundColor: "var(--color-primary-end-rgba-10)" }}
        />
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-5 animate-float">💻</div>
        <div className="absolute bottom-1/4 left-1/3 text-5xl opacity-5 animate-float-delayed">⚡</div>
      </div>

      {/* Video (if any) - loads after image for LCP */}
      {backgroundVideo && (
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster={backgroundImage ? getImageUrl(backgroundImage) : undefined}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: videoReady ? backgroundOpacity : 0,
              zIndex: 1,
              transition: "opacity 0.3s ease-in",
            }}
          >
            <source src={backgroundVideo} type="video/mp4" />
            <source src={backgroundVideo} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {content.subtitle && (
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mt-20 sm:mt-16 mb-5 sm:mb-6 rounded-full"
              style={{
                backgroundColor: "var(--color-primary-start-rgba-10)",
                border: "1px solid var(--color-primary-end-rgba-20)",
              }}
            >
              <span
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: "var(--color-primary-end)" }}
              />
              <p className="text-[11px] sm:text-sm md:text-base font-medium tracking-wide theme-text-white leading-tight sm:leading-normal">
                {content.subtitle}
              </p>
            </div>
          )}

          {content.title && (
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 leading-tight px-2 text-white">
              {content.title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
          )}

          {content.description && (
            <p
              className="text-sm sm:text-lg md:text-xl theme-text-white mb-7 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2"
              style={{ opacity: 0.9 }}
            >
              {content.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-2">
            {content.buttonText && content.buttonLink && (
              <Link
                href={content.buttonLink}
                className="group relative px-5 py-2.5 sm:px-8 sm:py-4 theme-bg-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden w-full sm:w-auto"
                style={{ color: "var(--color-black)" }}
              >
                <span className="relative z-10 group-hover:theme-text-white transition-colors">
                  {content.buttonText}
                </span>
                <div className="absolute inset-0 theme-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
            {content.secondaryButtonText && content.secondaryButtonLink && (
              <Link
                href={String(content.secondaryButtonLink)}
                className="px-5 py-2.5 sm:px-8 sm:py-4 bg-transparent border-2 theme-text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
                style={{ borderColor: "var(--color-border-white-30)" }}
              >
                {content.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
