import { ISection } from "@/models/Section";
import { getBackgroundStyle } from "@/lib/section-helpers";
import { getSectionTheme } from "@/lib/section-theme";

interface StatsSectionProps {
  section: ISection;
}

export default function StatsSection({ section }: StatsSectionProps) {
  const { content } = section;
  const theme = getSectionTheme("stats");
  const background = getBackgroundStyle(theme.background, 1);

  return (
    <section
      className={`py-16 ${background.className || ""}`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(content.title || content.description) && (
          <div className="text-center mb-12">
            {content.title && (
              <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p
                className="text-xl theme-text-black max-w-3xl mx-auto"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {content.stats && content.stats.length > 0
            ? content.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center py-8 md:py-0 md:px-8 first:pt-0 md:first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0"
                >
                  {stat.number && (
                    <div className="text-6xl md:text-7xl font-bold theme-primary-mid mb-4">
                      {stat.number}
                    </div>
                  )}
                  {stat.title && (
                    <h3 className="text-2xl font-bold mb-4 theme-text-black">
                      {stat.title}
                    </h3>
                  )}
                  {stat.description && (
                    <p
                      className="leading-relaxed theme-text-black"
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
