"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/static-pages";

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-neutral-900 hover:opacity-80 transition-opacity"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
            </button>
            {isOpen && (
              <p className="pb-5 text-sm leading-relaxed text-neutral-600 pr-8">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
