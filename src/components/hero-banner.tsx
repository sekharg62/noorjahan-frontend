"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { heroSlides } from "@/data/data";

const AUTO_PLAY_MS = 5500;

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = heroSlides.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      setActiveIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );

  const goNext = useCallback(() => goToSlide(activeIndex + 1), [activeIndex, goToSlide]);
  const goPrev = useCallback(() => goToSlide(activeIndex - 1), [activeIndex, goToSlide]);

  useEffect(() => {
    if (slideCount <= 1 || isPaused) return;

    const timer = window.setInterval(goNext, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext, isPaused, slideCount]);

  if (slideCount === 0) return null;

  return (
    <section
      className="relative"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative aspect-[16/7] sm:aspect-[16/6] lg:aspect-[21/8] overflow-hidden bg-neutral-100">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={`${slide.image}-${index}`}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <SiteImage
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/20" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 pointer-events-none">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif tracking-wide max-w-2xl">
                  {slide.title}
                  {slide.subtitle && (
                    <span className="block text-lg sm:text-2xl mt-2 font-light opacity-90">
                      / {slide.subtitle}
                    </span>
                  )}
                </h2>
                <div className="mt-6 flex flex-wrap gap-3 justify-center pointer-events-auto">
                  <Link
                    href={slide.ctaHref}
                    className="bg-white text-neutral-900 px-6 py-3 text-xs uppercase tracking-widest hover:bg-neutral-100 transition-colors"
                  >
                    {slide.ctaLabel}
                  </Link>
                  {slide.secondaryCtaHref && slide.secondaryCtaLabel && (
                    <Link
                      href={slide.secondaryCtaHref}
                      className="border border-white text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                      {slide.secondaryCtaLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {slideCount > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
            </button>

            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2"
              role="tablist"
              aria-label="Slide pagination"
            >
              {heroSlides.map((slide, index) => (
                <button
                  key={`dot-${slide.image}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex
                      ? "w-8 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
