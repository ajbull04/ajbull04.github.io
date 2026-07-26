import { useEffect, useState, type RefObject } from "react";

/** Tracks whether an element is on screen so animation loops can idle when it isn't. */
export const useIsVisible = <T extends Element>(ref: RefObject<T>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};
