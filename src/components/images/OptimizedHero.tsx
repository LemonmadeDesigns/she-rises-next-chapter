import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedHeroProps {
  src: string;
  webpSrc?: string;
  avifSrc?: string;
  blurSrc?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  objectPosition?: string;
}

const OptimizedHero = ({
  src,
  webpSrc,
  avifSrc,
  blurSrc,
  alt,
  width,
  height,
  className,
  sizes = "100vw",
  priority = true,
  style,
  objectPosition = "center",
}: OptimizedHeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Preload the hero image for fastest loading
    if (priority) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);

      // Load the best format available
      if (avifSrc && 'createImageBitmap' in window) {
        img.src = avifSrc;
      } else if (webpSrc) {
        img.src = webpSrc;
      } else {
        img.src = src;
      }
    }
  }, [src, webpSrc, avifSrc, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div className={cn("absolute inset-0 w-full h-full", className)} style={style}>
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

      {/* Main optimized image */}
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
          style={{ objectPosition }}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </picture>

      {/* Fallback for errors */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-royal-plum to-lotus-rose flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h2 className="text-2xl font-bold mb-2">She Rises</h2>
            <p className="text-white/80">Every woman deserves a safe place to rise</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedHero;