import Link from "next/link";
import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { isIconUrl } from "../../utils/helpers";

interface SubServiceItem {
  icon?: string;
  title: string;
  description: string;
}

interface SubServicesSectionProps {
  title: string;
  description?: string;
  items: SubServiceItem[];
  ctaButtonText?: string;
  ctaButtonLink?: string;
  backgroundColor?: string;
}

export default function SubServicesSection({
  title,
  description,
  items,
  ctaButtonText,
  ctaButtonLink,
  backgroundColor,
}: SubServicesSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("industries");
  const background = getBackgroundStyle(bgColor);

  return (
    <section className={`py-12 sm:py-16 md:py-24 ${background.className || ""}`} style={background.style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            {title}
          </h2>
          {description && (
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">{description}</p>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {item.icon && (
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 theme-bg-primary-mid-dark rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                    {isIconUrl(item.icon) ? (
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={32}
                        height={32}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      item.icon
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:theme-text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {ctaButtonText && (
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              href={ctaButtonLink || "#contact"}
              className="inline-block px-6 py-2.5 sm:px-8 sm:py-3 theme-bg-primary-mid-dark text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
            >
              {ctaButtonText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

