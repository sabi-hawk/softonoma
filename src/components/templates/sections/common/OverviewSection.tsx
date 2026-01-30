import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface OverviewSectionProps {
  title: string;
  paragraphs: Array<{ text: string }>;
  image?: string;
  backgroundColor?: string;
}

export default function OverviewSection({
  title,
  paragraphs,
  image,
  backgroundColor,
}: OverviewSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("about");
  const background = getBackgroundStyle(bgColor);

  return (
    <section
      id="overview"
      className={`py-12 sm:py-16 md:py-24 ${background.className || ""}`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold theme-text-black mb-4 sm:mb-6">
              {title}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {paragraphs.map((para, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full theme-bg-primary-mid-dark flex items-center justify-center mt-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 theme-text-white"
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
                  <p className="text-base sm:text-lg theme-text-black leading-relaxed">
                    {para.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {image && (
            <div className="relative w-full aspect-video">
              <Image
                src={image}
                alt={title}
                fill
                className="rounded-lg shadow-lg object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

