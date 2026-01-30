import { useState, useRef, useEffect } from "react";

interface UseTechCarouselOptions {
  totalItems: number;
  mobileItemsToShow: number;
  autoSlideInterval?: number;
}

export function useTechCarousel({
  totalItems,
  mobileItemsToShow,
  autoSlideInterval = 5000,
}: UseTechCarouselOptions) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const totalSlides = Math.ceil(totalItems / mobileItemsToShow);
  const maxIndex = Math.max(0, (totalSlides - 1) * mobileItemsToShow);

  const next = () => {
    if (totalItems > 0) {
      setIndex((prev) => {
        const next = prev + mobileItemsToShow;
        return next > maxIndex ? maxIndex : next;
      });
    }
  };

  const prev = () => {
    if (totalItems > 0) {
      setIndex((prev) => Math.max(prev - mobileItemsToShow, 0));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isUserInteractingRef.current = true;
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      next();
    } else if (distance < -minSwipeDistance) {
      prev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
    resumeAutoSlide();
  };

  const resumeAutoSlide = () => {
    setTimeout(() => {
      isUserInteractingRef.current = false;
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalSlides > 1
      ) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setIndex((prev) => {
              const next = prev + mobileItemsToShow;
              return next > maxIndex ? maxIndex : next;
            });
          }
        }, autoSlideInterval);
      }
    }, 3000);
  };

  const getVisibleItems = () => {
    const start = index;
    const end = Math.min(start + mobileItemsToShow, totalItems);
    return Array.from({ length: end - start }, (_, idx) => start + idx);
  };

  const getCurrentSlideIndex = () => {
    return Math.floor(index / mobileItemsToShow);
  };

  useEffect(() => {
    const startAutoSlide = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalSlides > 1
      ) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setIndex((prev) => {
              const next = prev + mobileItemsToShow;
              return next > maxIndex ? maxIndex : next;
            });
          }
        }, autoSlideInterval);
      }
    };

    startAutoSlide();

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
          autoSlideIntervalRef.current = null;
        }
      } else {
        startAutoSlide();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [index, totalSlides, mobileItemsToShow, maxIndex, autoSlideInterval]);

  return {
    index,
    setIndex,
    next,
    prev,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getVisibleItems,
    getCurrentSlideIndex,
    totalSlides,
  };
}

