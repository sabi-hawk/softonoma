import Image from "next/image";
import { ISection } from "@/models/Section";
import { getImageUrl } from "@/lib/image-utils";
import HeroSectionContent from "./HeroSectionContent";

interface HeroSectionShellProps {
  section: ISection;
}

/**
 * Server component: renders the hero background image in the initial HTML
 * so the LCP element exists before hydration (fixes "element render delay").
 * HeroSectionContent (client) renders overlay, pattern, video, and text.
 */
export default function HeroSectionShell({ section }: HeroSectionShellProps) {
  const { content } = section;
  const backgroundImage = content.backgroundImage as string | undefined;
  const backgroundOpacity =
    (content.backgroundOpacity as number | undefined) ?? 0.3;

  return (
    <section className="relative min-h-[75vh] sm:min-h-0 py-24 sm:py-20 md:py-32 lg:py-36 overflow-hidden theme-bg-black">
      {/* LCP: Background image rendered on the server so it's in the initial HTML */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <Image
              src={getImageUrl(backgroundImage)}
              alt="Hero background"
              fill
              priority
              fetchPriority="high"
              className="object-cover"
              style={{ opacity: backgroundOpacity }}
              sizes="100vw"
              quality={85}
            />
          </div>
        </div>
      )}
      <HeroSectionContent section={section} />
    </section>
  );
}
