"use client";

import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

interface HeroConfig {
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  showHero?: boolean;
}

interface ListingHeroProps {
  hero: HeroConfig | undefined;
  subtitle?: string; // e.g. "Our Services", "Our Industries"
}

export default function ListingHero({ hero, subtitle }: ListingHeroProps) {
  if (!hero || hero?.showHero === false || (!hero?.title && !hero?.description)) {
    return null;
  }

  const bgImage = hero.backgroundImage ? getImageUrl(hero.backgroundImage) : undefined;

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-listing-hero-bg)" }}
    >

      {/* Background image (if any) with strong dark overlay */}
      {bgImage && (
        <>
          <div className="absolute inset-0">
            <Image
              src={bgImage}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "var(--color-listing-hero-bg)", opacity: 0.82 }}
            aria-hidden
          />
        </>
      )}

      {/* Very subtle grid - dark theme */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-14 sm:pb-16">
        <div className="text-center">
          {subtitle && (
            <p className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/60 mb-3">
              {subtitle}
            </p>
          )}
          {hero.title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              {hero.title}
            </h1>
          )}
          {hero.description && (
            <p className="mt-3 text-sm sm:text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
