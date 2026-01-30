import { useEffect, useRef } from "react";

export function usePartnersCarousel(
  partners: Array<{ name?: string; logo?: string }>
) {
  const partnersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = partnersRef.current;
    if (!container || partners.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    const itemWidth = 200;
    const totalWidth = itemWidth * partners.length;

    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= totalWidth) {
        scrollPosition = scrollPosition - totalWidth;
      }
      container.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [partners.length]);

  return partnersRef as React.RefObject<HTMLDivElement>;
}

