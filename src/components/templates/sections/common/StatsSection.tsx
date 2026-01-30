import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";
import { isIconUrl } from "../../utils/helpers";

interface StatItem {
  icon?: string;
  value: string;
  label: string;
}

interface StatsSectionProps {
  items: StatItem[];
  backgroundColor?: string;
}

export default function StatsSection({ items, backgroundColor }: StatsSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("stats");
  const background = getBackgroundStyle(bgColor);

  return (
    <section className={`py-12 sm:py-16 md:py-24 ${background.className || ""}`} style={background.style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl p-6 sm:p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {items.map((stat, index) => (
              <div key={index} className="text-center">
                {stat.icon && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl mb-3 sm:mb-4 relative overflow-hidden mx-auto">
                    {isIconUrl(stat.icon) && stat.icon ? (
                      <Image
                        src={getImageUrl(stat.icon)}
                        alt={stat.label || "Stat"}
                        fill
                        sizes="40px"
                        className="object-contain transition-all duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement("div");
                            if (stat.icon && !isIconUrl(stat.icon)) {
                              fallback.className = "text-xl sm:text-2xl";
                              fallback.textContent = stat.icon;
                            } else if (stat.label) {
                              fallback.className = "text-xs font-bold text-white text-center";
                              fallback.textContent = stat.label;
                            }
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : stat.icon ? (
                      <div className="text-xl sm:text-2xl">{stat.icon}</div>
                    ) : null}
                  </div>
                )}
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-white opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

