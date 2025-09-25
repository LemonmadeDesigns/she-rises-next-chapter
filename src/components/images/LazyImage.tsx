import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  webpSrc?: string;
  avifSrc?: string;
  blurSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  aspectRatio?: string;
}

const LazyImage = ({
  src,
  webpSrc,
  avifSrc,
  blurSrc,
  alt,
  width,
  height,
  className,
  sizes = "100vw",
  aspectRatio,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "1000px", // Start loading well before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  const containerStyle = aspectRatio
    ? { aspectRatio }
    : width && height
    ? { aspectRatio: `${width}/${height}` }
    : {};

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)} style={containerStyle}>
      {/* Blur placeholder - shows immediately */}
      {blurSrc && (
        <img
          src={blurSrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
          style={{ filter: "blur(20px)", transform: "scale(1.1)" }}
          aria-hidden="true"
        />
      )}

      {/* Main image - only loads when in view */}
      {isInView && (
        <picture>
          {avifSrc && (
            <source
              srcSet={avifSrc}
              type="image/avif"
              sizes={sizes}
            />
          )}
          {webpSrc && (
            <source
              srcSet={webpSrc}
              type="image/webp"
              sizes={sizes}
            />
          )}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
      )}

      {/* Loading state */}
      {!isInView && !blurSrc && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center p-4">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;