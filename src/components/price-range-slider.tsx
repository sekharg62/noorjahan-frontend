"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
}

const THUMB_SIZE_PX = 20;
const THUMB_HALF = THUMB_SIZE_PX / 2;

function clamp(value: number, low: number, high: number) {
  return Math.min(Math.max(value, low), high);
}

function snapToStep(value: number, min: number, step: number) {
  if (step <= 0) return value;
  const steps = Math.round((value - min) / step);
  return min + steps * step;
}

function toPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function thumbStyle(percent: number) {
  return {
    left: `calc(${THUMB_HALF}px + (100% - ${THUMB_SIZE_PX}px) * ${percent / 100})`,
  } as const;
}

function ThumbGrip() {
  return (
    <span className="flex items-center justify-center gap-[3px]" aria-hidden>
      <span className="block w-px h-3 bg-neutral-900" />
      <span className="block w-px h-3 bg-neutral-900" />
      <span className="block w-px h-3 bg-neutral-900" />
    </span>
  );
}

export function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  step = 1,
}: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const minId = useId();
  const maxId = useId();
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const rangeMin = Math.min(valueMin, valueMax);
  const rangeMax = Math.max(valueMin, valueMax);
  const disabled = max <= min;

  const minPercent = toPercent(rangeMin, min, max);
  const maxPercent = toPercent(rangeMax, min, max);
  const thumbsOverlap = Math.abs(minPercent - maxPercent) < 0.5;

  const valueFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || max <= min) return min;

      const rect = track.getBoundingClientRect();
      const usableWidth = rect.width - THUMB_SIZE_PX;
      const ratio = clamp((clientX - rect.left - THUMB_HALF) / usableWidth, 0, 1);
      const raw = min + ratio * (max - min);
      return snapToStep(raw, min, step);
    },
    [min, max, step],
  );

  const updateThumb = useCallback(
    (thumb: "min" | "max", clientX: number) => {
      const next = valueFromPointer(clientX);
      if (thumb === "min") {
        onChange(Math.min(next, rangeMax), rangeMax);
      } else {
        onChange(rangeMin, Math.max(next, rangeMin));
      }
    },
    [onChange, rangeMin, rangeMax, valueFromPointer],
  );

  const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return;

    const value = valueFromPointer(e.clientX);
    const distToMin = Math.abs(value - rangeMin);
    const distToMax = Math.abs(value - rangeMax);
    const thumb = distToMin <= distToMax ? "min" : "max";

    updateThumb(thumb, e.clientX);
    setDragging(thumb);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onThumbPointerDown = (
    thumb: "min" | "max",
    e: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (disabled || e.button !== 0) return;
    e.stopPropagation();
    setDragging(thumb);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => updateThumb(dragging, e.clientX);
    const onUp = () => setDragging(null);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, updateThumb]);

  const onThumbKeyDown = (
    thumb: "min" | "max",
    e: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (disabled) return;

    let delta = 0;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
    if (!delta) return;

    e.preventDefault();
    if (thumb === "min") {
      const next = clamp(snapToStep(rangeMin + delta, min, step), min, rangeMax);
      onChange(next, rangeMax);
    } else {
      const next = clamp(snapToStep(rangeMax + delta, min, step), rangeMin, max);
      onChange(rangeMin, next);
    }
  };

  return (
    <div
      className={`price-range-slider mt-5 ${disabled ? "opacity-40 pointer-events-none" : ""}`}
      data-dragging={dragging ?? undefined}
    >
      <div
        ref={trackRef}
        className="price-range-slider__track"
        onPointerDown={onTrackPointerDown}
        role="group"
        aria-label="Price range"
      >
        <span className="price-range-slider__line" aria-hidden />
        <div
          id={minId}
          role="slider"
          tabIndex={0}
          className="price-range-slider__thumb"
          style={thumbStyle(minPercent)}
          onPointerDown={(e) => onThumbPointerDown("min", e)}
          onKeyDown={(e) => onThumbKeyDown("min", e)}
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={rangeMin}
          aria-disabled={disabled}
        >
          <ThumbGrip />
        </div>
        <div
          id={maxId}
          role="slider"
          tabIndex={0}
          className={`price-range-slider__thumb ${thumbsOverlap ? "price-range-slider__thumb--overlap" : ""}`}
          style={
            thumbsOverlap
              ? {
                  left: `calc(${THUMB_HALF}px + (100% - ${THUMB_SIZE_PX}px) * ${maxPercent / 100} - ${THUMB_SIZE_PX}px)`,
                }
              : thumbStyle(maxPercent)
          }
          onPointerDown={(e) => onThumbPointerDown("max", e)}
          onKeyDown={(e) => onThumbKeyDown("max", e)}
          aria-label="Maximum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={rangeMax}
          aria-disabled={disabled}
        >
          <ThumbGrip />
        </div>
      </div>
    </div>
  );
}
