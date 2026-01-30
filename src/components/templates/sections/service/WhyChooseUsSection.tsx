import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface WhyChooseUsSectionProps {
  title: string;
  subtitle?: string;
  items: Array<{ text: string }>;
  image?: string;
  certifications?: Array<{ name: string; image?: string }>;
  backgroundColor?: string;
}

export default function WhyChooseUsSection({
  title,
  subtitle,
  items,
  image,
  certifications,
  backgroundColor,
}: WhyChooseUsSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("about");
  const background = getBackgroundStyle(bgColor);

  return (
    <section className={`py-12 sm:py-16 md:py-24 ${background.className || ""}`} style={background.style}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{subtitle}</p>
            )}
            {items.map((item, index) => (
              <div key={index} className="mb-4 sm:mb-6">
                <div className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
                  <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full theme-bg-primary-mid-dark flex items-center justify-center mt-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-base sm:text-lg text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            {image && (
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image src={getImageUrl(image)} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />
              </div>
            )}
          </div>
        </div>

        {certifications && certifications.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center justify-center">
                {cert.image ? (
                  <div className="relative w-full h-16 sm:h-20">
                    <Image src={getImageUrl(cert.image)} alt={cert.name} fill sizes="120px" className="object-contain" />
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm text-gray-600 text-center">{cert.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

