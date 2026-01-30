import { ISection } from "@/models/Section";
import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface FeaturesSectionProps {
  section: ISection;
}

export default function FeaturesSection({ section }: FeaturesSectionProps) {
  const { content } = section;
  const backgroundColor = (content.backgroundColor as string) || getDefaultBackground("features");
  const background = getBackgroundStyle(backgroundColor, content.backgroundColorOpacity as number);

  return (
    <section className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${background.className || ""}`} style={background.style}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div>
            {content.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-4 sm:mb-6">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p className="text-base sm:text-lg theme-text-muted mb-6 sm:mb-10 leading-relaxed">
                {content.description}
              </p>
            )}
            {Array.isArray(content.features) && content.features.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                {content.features.map(
                  (
                    feature: { title?: string; description?: string },
                    index: number
                  ) => (
                    <div key={index} className="flex items-start group">
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 theme-bg-primary-mid rounded-xl flex items-center justify-center mr-3 sm:mr-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-5 h-5 sm:w-7 sm:h-7 theme-text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        {feature.title && (
                          <h3 className="text-lg sm:text-xl font-bold theme-text-black mb-1 sm:mb-2 theme-hover-primary-mid transition-colors">
                            {feature.title}
                          </h3>
                        )}
                        {feature.description && (
                          <p className="text-sm sm:text-base theme-text-muted leading-relaxed">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          {content.image ? (
            <div className="relative">
              <div className="absolute inset-0 theme-bg-primary-mid rounded-2xl transform rotate-3 opacity-20"></div>
              <div className="relative w-full aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden">
                <Image
                  src={getImageUrl(content.image as string)}
                  alt={content.title || "Section image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 theme-bg-primary-mid rounded-2xl transform rotate-3 opacity-20"></div>
              <div className="relative h-96 theme-bg-primary-mid rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Tech pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(var(--color-primary-end-rgba-10) 1px, transparent 1px),
                      linear-gradient(90deg, var(--color-primary-end-rgba-10) 1px, transparent 1px)
                    `,
                    backgroundSize: "30px 30px",
                  }}
                ></div>
                <div className="relative theme-text-black text-center z-10">
                  <div className="text-6xl mb-4 animate-float">💼</div>
                  <p className="text-xl font-semibold">Your Success Partner</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
