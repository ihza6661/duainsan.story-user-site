import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down";

interface UseScrollDirectionOptions {
  threshold?: number;
  initialDirection?: ScrollDirection;
}

/**
 * Hook to detect scroll direction and visibility state
 * Useful for showing/hiding elements based on scroll behavior
 * 
 * @param threshold - Minimum scroll distance before triggering (default: 10)
 * @param initialDirection - Initial scroll direction (default: "up")
 * @returns Object with scrollDirection and isVisible state
 */
export function useScrollDirection({
  threshold = 10,
  initialDirection = "up",
}: UseScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(initialDirection);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Show at top of page (first 100px)
      if (scrollY < 100) {
        setIsVisible(true);
        setScrollDirection("up");
        setLastScrollY(scrollY);
        ticking = false;
        return;
      }

      // Check if scroll distance exceeds threshold
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      // Determine direction and visibility
      if (scrollY > lastScrollY) {
        // Scrolling down
        setScrollDirection("down");
        setIsVisible(false);
      } else {
        // Scrolling up
        setScrollDirection("up");
        setIsVisible(true);
      }

      setLastScrollY(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [lastScrollY, threshold]);

  return { scrollDirection, isVisible };
}
