"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  unoptimized?: boolean;
}

export default function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  objectFit = "cover",
  unoptimized = false,
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Safe source resolution
  // If the image url is local relative like "/uploads/...", we still try to render it.
  // If it's empty, we treat it as an error immediately.
  const resolvedSrc = src || "";

  useEffect(() => {
    if (!resolvedSrc) {
      setIsError(true);
      setIsLoading(false);
    } else {
      setIsError(false);
      setIsLoading(true);
    }
  }, [resolvedSrc, retryKey]);

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsError(false);
    setIsLoading(true);
    setRetryKey((prev) => prev + 1);
  };

  // Render elegant broken image fallback
  if (isError) {
    return (
      <div
        onClick={handleRetry}
        className={`flex flex-col items-center justify-center bg-radial from-neutral-800 to-neutral-950 text-white/70 p-6 text-center cursor-pointer transition-all duration-300 hover:from-neutral-700 hover:to-neutral-900 border border-white/5 active:scale-[0.98] select-none ${
          fill ? "absolute inset-0 w-full h-full" : "w-full min-h-[300px]"
        } ${className}`}
        title="Click to retry loading asset"
      >
        <svg
          className="w-12 h-12 mb-3 text-brand-red animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z"
          />
        </svg>
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-red mb-1">
          Asset Failed to Load
        </span>
        <span className="text-[11px] text-white/50 font-light hover:text-white transition-colors duration-200">
          Click to refresh
        </span>
      </div>
    );
  }

  // Define object-fit inline styles or classes safely
  const imageStyle: React.CSSProperties = {
    objectFit: objectFit,
    transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <div
      className={`relative overflow-hidden w-full h-full bg-surface-heavy/20 ${
        !fill ? "flex items-center justify-center" : "block"
      }`}
    >
      {/* Elegantly styled HSL shimmer loading block */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-neutral-200/20 via-neutral-300/40 to-neutral-200/20 dark:from-neutral-800/20 dark:via-neutral-700/40 dark:to-neutral-800/20 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-brand-red/35 border-t-brand-red animate-spin" />
        </div>
      )}

      {/* Render optimized image or fallback standard image */}
      {fill ? (
        <Image
          key={`${resolvedSrc}-${retryKey}`}
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          unoptimized={unoptimized || resolvedSrc.startsWith('/api/image-proxy')}
          className={`${className} ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          style={imageStyle}
        />
      ) : (
        <img
          key={`${resolvedSrc}-${retryKey}`}
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          style={imageStyle}
        />
      )}
    </div>
  );
}
