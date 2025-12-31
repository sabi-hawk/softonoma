import { ISection } from "@/models/Section";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface StatsSectionProps {
  section: ISection;
}

export default function StatsSection({ section }: StatsSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("stats");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );

  return (
    <section
      className={`py-16 ${background.className || ""}`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(content.title || content.description) && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            {content.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p
                className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 divide-x divide-gray-200">
          {content.stats && content.stats.length > 0
            ? content.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center py-4 md:py-0 px-2 md:px-3 lg:px-6 first:pl-0 md:first:pl-0 last:pr-0 md:last:pr-0"
                >
                  {stat.number && (
                    <div className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold theme-primary-mid mb-2 md:mb-3">
                      {stat.number}
                    </div>
                  )}
                  {stat.title && (
                    <h3 className="text-sm sm:text-base md:text-base lg:text-xl font-bold mb-2 md:mb-3 theme-text-black">
                      {stat.title}
                    </h3>
                  )}
                  {stat.description && (
                    <p
                      className="text-xs sm:text-sm md:text-xs lg:text-sm leading-relaxed theme-text-black"
                      style={{ opacity: 0.8 }}
                    >
                      {stat.description}
                    </p>
                  )}
                </div>
              ))
            : null}
        </div>
      </div>
    </section>
  );
}
