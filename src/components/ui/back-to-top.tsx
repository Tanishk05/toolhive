"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function toggleVisibility() {
      setIsVisible(window.scrollY > 300);
    }

    if (!prefersReducedMotion) {
      window.addEventListener("scroll", toggleVisibility, { passive: true });
      return () => window.removeEventListener("scroll", toggleVisibility);
    }

    // Still show the button for accessibility, just skip scroll listener animation
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_24px_rgba(143,175,147,0.2)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(143,175,147,0.3)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
