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
      {/* Carousel Container */}
      <div className="relative h-[400px] flex items-center justify-center gap-6">

        {/* Previous Image (Left) */}
        <div
          className="z-10 transition-all duration-500 ease-out flex-shrink-0"
          style={{
            transform: `scale(0.8)`,
            opacity: 0.7
          }}
        >
          <img
            src={getImageAtPosition(-1)}
            alt="Previous event photo"
            className="w-[280px] h-[240px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
            loading="lazy"
            onClick={goToPrevious}
          />
        </div>

        {/* Current Image (Center) */}
        <div
          className="z-20 transition-all duration-500 ease-out flex-shrink-0"
          style={{
            transform: `scale(1)`,
            opacity: 1
          }}
        >
          <img
            src={getImageAtPosition(0)}
            alt="Featured event photo"
            className="w-[450px] h-[350px] object-cover rounded-xl shadow-2xl"
            style={{ objectPosition: 'center top' }}
            loading="eager"
          />
          {/* Caption under featured image */}
          <div className="text-center mt-4">
            <p className="text-base font-medium text-foreground">Community Impact Event</p>
            <p className="text-sm text-muted-foreground">Southern California</p>
          </div>
        </div>

        {/* Next Image (Right) */}
        <div
          className="z-10 transition-all duration-500 ease-out flex-shrink-0"
          style={{
            transform: `scale(0.8)`,
            opacity: 0.7
          }}
        >
          <img
            src={getImageAtPosition(1)}
            alt="Next event photo"
            className="w-[280px] h-[240px] object-cover rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
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
          className="absolute left-4 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          disabled={isAnimating}
          className="absolute right-4 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full disabled:opacity-50"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6" />
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
