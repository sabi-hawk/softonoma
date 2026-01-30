import { useState, useRef, useEffect } from "react";

interface UseCarouselOptions {
  totalItems: number;
  itemsToShow: number;
  mobileItemsToShow: number;
  autoSlideInterval?: number;
}

export function useCarousel({
  totalItems,
  itemsToShow,
  mobileItemsToShow,
  autoSlideInterval = 5000,
}: UseCarouselOptions) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  const next = () => {
    if (totalItems > 0) {
      setIndex((prev) => (prev + 1) % totalItems);
    }
  };

  const prev = () => {
    if (totalItems > 0) {
      setIndex((prev) => (prev - 1 + totalItems) % totalItems);
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
        totalItems > mobileItemsToShow
      ) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setIndex((prev) => (prev + 1) % totalItems);
          }
        }, autoSlideInterval);
      }
    }, 3000);
  };

  const getVisibleItems = (isMobile: boolean = false) => {
    const visible = [];
    const items = isMobile ? mobileItemsToShow : itemsToShow;
    for (let i = 0; i < items; i++) {
      const itemIndex = (index + i) % totalItems;
      visible.push({
        itemIndex,
        originalIndex: itemIndex,
      });
    }
    return visible;
  };

  const getCurrentSlideIndex = () => {
    return Math.floor(index / mobileItemsToShow);
  };

  const totalSlides = Math.ceil(totalItems / mobileItemsToShow);

  useEffect(() => {
    const startAutoSlide = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalItems > mobileItemsToShow
      ) {
        if (autoSlideIntervalRef.current) {
          clearInterval(autoSlideIntervalRef.current);
        }
        autoSlideIntervalRef.current = setInterval(() => {
          if (!isUserInteractingRef.current) {
            setIndex((prev) => (prev + 1) % totalItems);
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
  }, [index, totalItems, mobileItemsToShow, autoSlideInterval]);

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

