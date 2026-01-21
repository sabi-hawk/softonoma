import Link from "next/link";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
}

export default function CTASection({
  title,
  description,
  buttonText,
  buttonLink,
  backgroundColor,
}: CTASectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("cta");
  const background = getBackgroundStyle(bgColor);

  return (
    <section className={`py-12 sm:py-16 md:py-24 text-black ${background.className || ""}`} style={background.style}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-black">{title}</h2>
        {description && (
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 text-black">{description}</p>
        )}
        {buttonText && (
          <Link
            href={buttonLink || "#contact"}
            className="inline-block px-6 py-2.5 sm:px-8 sm:py-4 theme-bg-primary-mid-dark text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}

