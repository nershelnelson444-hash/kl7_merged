import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BikeImageViewerProps {
  images: string[];
  bikeName: string;
}

/**
 * Smart image cropping via canvas.
 * Reads pixel data, finds bounding box of non-white/non-transparent pixels,
 * adds padding, and returns a cropped objectURL ready to render.
 *
 * Tolerance: pixels within 30 RGB units of pure white (255,255,255)
 * or with alpha < 20 are considered background.
 */
async function smartCrop(src: string, padding = 0.08): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const TOLERANCE = 30;
      const ALPHA_THRESH = 20;

      const isBackground = (r: number, g: number, b: number, a: number) =>
        a < ALPHA_THRESH ||
        (r >= 255 - TOLERANCE && g >= 255 - TOLERANCE && b >= 255 - TOLERANCE);

      let minX = width, maxX = 0, minY = height, maxY = 0;
      let hasContent = false;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          if (!isBackground(data[i], data[i + 1], data[i + 2], data[i + 3])) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            hasContent = true;
          }
        }
      }

      // If nothing meaningful found, just return original
      if (!hasContent || maxX - minX < 10 || maxY - minY < 10) {
        resolve(src);
        return;
      }

      const contentW = maxX - minX;
      const contentH = maxY - minY;
      const padX = Math.round(contentW * padding);
      const padY = Math.round(contentH * padding);

      const cropX = Math.max(0, minX - padX);
      const cropY = Math.max(0, minY - padY);
      const cropW = Math.min(width - cropX, contentW + padX * 2);
      const cropH = Math.min(height - cropY, contentH + padY * 2);

      const out = document.createElement('canvas');
      // Force 4:3 output canvas
      const targetRatio = 4 / 3;
      const contentRatio = cropW / cropH;

      let finalW: number, finalH: number;
      if (contentRatio > targetRatio) {
        finalW = cropW;
        finalH = Math.round(cropW / targetRatio);
      } else {
        finalH = cropH;
        finalW = Math.round(cropH * targetRatio);
      }

      out.width = finalW;
      out.height = finalH;
      const octx = out.getContext('2d')!;

      // Fill with the site background
      octx.fillStyle = '#F5F5F5';
      octx.fillRect(0, 0, finalW, finalH);

      const offsetX = Math.round((finalW - cropW) / 2);
      const offsetY = Math.round((finalH - cropH) / 2);
      octx.drawImage(canvas, cropX, cropY, cropW, cropH, offsetX, offsetY, cropW, cropH);

      resolve(out.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

function ProcessedImage({ src, alt }: { src: string; alt: string }) {
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setStatus('loading');
    setProcessedSrc(null);

    smartCrop(src)
      .then((result) => {
        if (!mountedRef.current) return;
        setProcessedSrc(result);
        setStatus('done');
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setProcessedSrc(src);
        setStatus('done');
      });

    return () => { mountedRef.current = false; };
  }, [src]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-grey-main border-t-black rounded-full animate-spin" />
          <span className="text-xs text-text-extra-muted font-medium tracking-wider uppercase">Loading</span>
        </div>
      )}
      {status === 'done' && processedSrc && (
        <motion.img
          src={processedSrc}
          alt={alt}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-contain"
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        />
      )}
    </div>
  );
}

export default function BikeImageViewer({ images, bikeName }: BikeImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }, [activeIndex]);

  const prev = useCallback(() => {
    goTo((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, goTo]);

  const next = useCallback(() => {
    goTo((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full rounded-[24px] bg-[#F5F5F5] flex items-center justify-center"
        style={{ aspectRatio: '4/3', maxWidth: 680, margin: '0 auto' }}
      >
        <div className="flex flex-col items-center gap-3 text-text-extra-muted">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-sm font-medium">No images available</span>
        </div>
      </div>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="flex flex-col gap-4" style={{ maxWidth: 680, margin: '0 auto', width: '100%' }}>

      {/* ── Main Image Stage ── */}
      <div
        className="w-full relative rounded-[24px] overflow-hidden bg-[#F5F5F5]"
        style={{
          aspectRatio: '4/3',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        }}
      >
        {/* Slide area */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <ProcessedImage
              src={images[activeIndex]}
              alt={`${bikeName} — photo ${activeIndex + 1}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrow buttons — only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-grey-main flex items-center justify-center shadow-sm hover:bg-white transition-all hover:scale-105 active:scale-95"
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-grey-main flex items-center justify-center shadow-sm hover:bg-white transition-all hover:scale-105 active:scale-95"
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ── Thumbnail Strip ── */}
      {images.length > 1 && (
        <div className="flex flex-row gap-3 overflow-x-auto pb-1 hide-scrollbar">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-shrink-0 rounded-[12px] overflow-hidden transition-all duration-200 ${
                i === activeIndex
                  ? 'ring-2 ring-black ring-offset-2 opacity-100'
                  : 'opacity-50 hover:opacity-80'
              }`}
              style={{ width: 72, height: 54, background: '#F5F5F5' }}
              aria-label={`View photo ${i + 1}`}
            >
              <img
                src={src}
                alt={`${bikeName} thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}