import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventPhotosCarouselProps {
  images: string[];
}

const EventPhotosCarousel = ({ images }: EventPhotosCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Helper to get image at a specific position relative to current
  const getImageAtPosition = (offset: number) => {
    const index = (currentIndex + offset + images.length) % images.length;
    return images[index];
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto pb-12 px-4">
      {/* Carousel Container - responsive height */}
      <div className="relative h-[300px] sm:h-[360px] md:h-[400px] flex items-center justify-center gap-3 sm:gap-6 overflow-hidden">

        {/* Previous Image (Left) - hidden on mobile */}
        <div
          className="hidden sm:block z-10 transition-all duration-500 ease-out flex-shrink-0"
          style={{
            transform: `scale(0.8)`,
            opacity: 0.7
          }}
        >
          <img
            src={getImageAtPosition(-1)}
            alt="Previous event photo"
            className="w-[200px] h-[180px] md:w-[280px] md:h-[240px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
            loading="lazy"
            onClick={goToPrevious}
          />
        </div>

        {/* Current Image (Center) - responsive sizing */}
        <div className="z-20 transition-all duration-500 ease-out flex-shrink-0 max-w-full px-10 sm:px-0">
          <img
            src={getImageAtPosition(0)}
            alt="Featured event photo"
            className="w-full max-w-[320px] sm:max-w-none sm:w-[360px] sm:h-[280px] md:w-[450px] md:h-[350px] h-[220px] object-cover rounded-xl shadow-2xl mx-auto"
            style={{ objectPosition: 'center top' }}
            loading="eager"
          />
          {/* Caption under featured image */}
          <div className="text-center mt-3 sm:mt-4">
            <p className="text-sm sm:text-base font-medium text-foreground">Community Impact Event</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Southern California</p>
          </div>
        </div>

        {/* Next Image (Right) - hidden on mobile */}
        <div
          className="hidden sm:block z-10 transition-all duration-500 ease-out flex-shrink-0"
          style={{
            transform: `scale(0.8)`,
            opacity: 0.7
          }}
        >
          <img
            src={getImageAtPosition(1)}
            alt="Next event photo"
            className="w-[200px] h-[180px] md:w-[280px] md:h-[240px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
            loading="lazy"
            onClick={goToNext}
          />
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          disabled={isAnimating}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50 h-9 w-9 sm:h-10 sm:w-10"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          disabled={isAnimating}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50 h-9 w-9 sm:h-10 sm:w-10"
          aria-label="Next photo"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-8">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
              index === currentIndex
                ? "bg-crown-gold w-8"
                : "bg-gray-300 hover:bg-gray-400 w-3"
            }`}
            aria-label={`Go to photo ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
};

export default EventPhotosCarousel;
