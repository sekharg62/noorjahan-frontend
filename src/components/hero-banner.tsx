"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { useBanners } from "@/context/banner-context";

const AUTO_PLAY_MS = 5500;

const bannerAspectClass = "aspect-[16/7] sm:aspect-[16/6] lg:aspect-[21/8]";

function HeroBannerSkeleton() {
  return (
    <section
      className="relative"
      aria-busy="true"
      aria-label="Loading banners"
    >
      <div
        className={`relative ${bannerAspectClass} overflow-hidden bg-neutral-200`}
      >
        <div className="absolute inset-0 animate-pulse bg-neutral-200" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <span className="h-1.5 w-8 rounded-full bg-neutral-300/80" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-300/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-neutral-300/60" />
        </div>
      </div>
    </section>
  );
}

export function HeroBanner() {
  const { homeBanners, loading } = useBanners();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = homeBanners.length;

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

  useEffect(() => {
    if (activeIndex >= slideCount) {
      setActiveIndex(0);
    }
  }, [activeIndex, slideCount]);

  if (loading) return <HeroBannerSkeleton />;
  if (slideCount === 0) return null;

  return (
    <section
      className="relative"
      aria-roledescription="carousel"
      aria-label="Home banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className={`relative ${bannerAspectClass} overflow-hidden bg-neutral-100`}>
        {homeBanners.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <SiteImage
                src={banner.imgUrl}
                alt={`Home banner ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
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
              {homeBanners.map((banner, index) => (
                <button
                  key={`dot-${banner.id}`}
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
