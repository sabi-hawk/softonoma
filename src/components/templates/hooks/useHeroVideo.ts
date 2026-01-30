import { useState, useEffect, useRef } from "react";

export function useHeroVideo(backgroundVideo?: string) {
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!backgroundVideo) return;

    const loadVideo = () => {
      if (heroVideoRef.current) {
        heroVideoRef.current.load();
      }
    };

    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoadVideo(true);
            setTimeout(loadVideo, 500);
            observer.disconnect();
          }
        },
        { rootMargin: "50px" }
      );

      if (heroSectionRef.current) {
        observer.observe(heroSectionRef.current);
      }

      return () => observer.disconnect();
    } else {
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
        loadVideo();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [backgroundVideo]);

  useEffect(() => {
    if (shouldLoadVideo && heroVideoRef.current) {
      const handleCanPlay = () => setHeroVideoReady(true);
      heroVideoRef.current.addEventListener("canplay", handleCanPlay, {
        once: true,
      });
      return () => {
        heroVideoRef.current?.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [shouldLoadVideo]);

  return {
    heroVideoRef: heroVideoRef as React.RefObject<HTMLVideoElement>,
    heroSectionRef: heroSectionRef as React.RefObject<HTMLElement>,
    heroVideoReady,
    shouldLoadVideo,
  };
}

