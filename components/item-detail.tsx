"use client";

import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

export interface ItemDetailData {
  text: string;
  role?: string;
  dateRange?: string;
  description?: string;
  domain?: string;
  images?: string[];
}

interface ItemDetailProps {
  item: ItemDetailData | null;
  onClose: () => void;
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (item?.images && item.images.length > 1) {
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) =>
          prev === 0 ? item.images!.length - 1 : prev - 1
        );
      }
      if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) =>
          prev === item.images!.length - 1 ? 0 : prev + 1
        );
      }
    }
  }, [item, onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [item]);

  if (!item) return null;

  const hasImages = item.images && item.images.length > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-50 dark:bg-zinc-900 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'var(--font-braun-linear)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black dark:text-white hover:opacity-70 z-10"
        >
          <X size={20} />
        </button>

        {/* Image carousel */}
        {hasImages && (
          <div className="relative w-full aspect-video bg-zinc-200 dark:bg-zinc-800">
            <Image
              src={item.images![currentImageIndex]}
              alt={item.text}
              fill
              className="object-cover"
            />
            {item.images!.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) =>
                    prev === 0 ? item.images!.length - 1 : prev - 1
                  )}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 hover:bg-black/70"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) =>
                    prev === item.images!.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 hover:bg-black/70"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {item.images!.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 ${
                        idx === currentImageIndex
                          ? 'bg-white'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-medium text-black dark:text-white">
                {item.text}
              </h2>
              {item.role && (
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  {item.role}
                </p>
              )}
            </div>
            {item.dateRange && (
              <span className="text-zinc-500 dark:text-zinc-500 text-sm whitespace-nowrap">
                {item.dateRange}
              </span>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-black dark:text-white leading-relaxed mb-4">
              {item.description}
            </p>
          )}

          {/* Link */}
          {item.domain && (
            <a
              href={`https://${item.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              {item.domain}
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
