import { ISection } from "@/models/Section";

interface FeaturesSectionProps {
  section: ISection;
}

export default function FeaturesSection({ section }: FeaturesSectionProps) {
  const { content } = section;

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white-green-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            {content.title && (
              <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-6">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p
                className="text-lg theme-text-black mb-10 leading-relaxed"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
            {Array.isArray(content.features) && content.features.length > 0 && (
              <div className="space-y-6">
                {content.features.map(
                  (
                    feature: { title?: string; description?: string },
                    index: number
                  ) => (
                    <div key={index} className="flex items-start group">
                      <div className="shrink-0 w-14 h-14 theme-gradient rounded-xl flex items-center justify-center mr-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-7 h-7 theme-text-white"
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
                          <h3 className="text-xl font-bold theme-text-black mb-2 theme-hover-primary transition-colors">
                            {feature.title}
                          </h3>
                        )}
                        {feature.description && (
                          <p
                            className="theme-text-black leading-relaxed"
                            style={{ opacity: 0.8 }}
                          >
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
              <div className="absolute inset-0 theme-gradient rounded-2xl transform rotate-3 opacity-20"></div>
              <img
                src={content.image}
                alt={content.title || "Section image"}
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 theme-gradient rounded-2xl transform rotate-3 opacity-20"></div>
              <div className="relative h-96 theme-gradient rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Tech pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(206, 212, 48, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(206, 212, 48, 0.1) 1px, transparent 1px)
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
