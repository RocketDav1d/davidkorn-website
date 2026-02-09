"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  images: string[];
  rotationInterval?: number; // in milliseconds
}

export default function Gallery({ images, rotationInterval = 3000 }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate images
  useEffect(() => {
    if (images.length <= 1 || isOpen || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [images.length, rotationInterval, isOpen, isPaused]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    },
    [isOpen, images.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Thumbnail view - single rotating image */}
      <div
        className="relative w-full aspect-[4/3] cursor-pointer overflow-hidden bg-zinc-200 dark:bg-zinc-800"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Image counter */}
        {images.length > 1 && (
          <div
            className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 text-xs"
            style={{ fontFamily: "var(--font-braun-linear)" }}
          >
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Fullscreen gallery */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:opacity-70 z-10"
          >
            <X size={24} />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 p-2"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 p-2"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Main image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`relative w-12 h-12 overflow-hidden ${
                    idx === currentIndex
                      ? "ring-2 ring-white"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Counter */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm"
            style={{ fontFamily: "var(--font-braun-linear)" }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
