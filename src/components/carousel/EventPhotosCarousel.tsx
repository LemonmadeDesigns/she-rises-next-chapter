import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventPhotosCarouselProps {
  images: string[];
}

const EventPhotosCarousel = ({ images }: EventPhotosCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getImageAtPosition = (offset: number) => {
    const index = (currentIndex + offset + images.length) % images.length;
    return images[index];
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12">
      {/* Carousel Container */}
      <div className="relative h-[400px] flex items-center justify-center perspective-1000">
        {/* Left Image */}
        <div className="absolute left-0 z-10 transform -translate-x-8 scale-75 opacity-60 transition-all duration-500">
          <img
            src={getImageAtPosition(-1)}
            alt="Event photo"
            className="w-[350px] h-[280px] object-cover rounded-xl shadow-lg"
            style={{ borderRadius: "12px" }}
          />
        </div>

        {/* Center Image (Featured) */}
        <div className="relative z-20 transform scale-100 transition-all duration-500">
          <img
            src={getImageAtPosition(0)}
            alt="Featured event photo"
            className="w-[450px] h-[350px] object-cover rounded-xl shadow-2xl"
            style={{ borderRadius: "12px" }}
          />
        </div>

        {/* Right Image */}
        <div className="absolute right-0 z-10 transform translate-x-8 scale-75 opacity-60 transition-all duration-500">
          <img
            src={getImageAtPosition(1)}
            alt="Event photo"
            className="w-[350px] h-[280px] object-cover rounded-xl shadow-lg"
            style={{ borderRadius: "12px" }}
          />
        </div>

        {/* Navigation Buttons */}
        <Button
          onClick={goToPrevious}
          variant="outline"
          size="icon"
          className="absolute left-4 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="absolute right-4 z-30 bg-white/90 hover:bg-white shadow-lg rounded-full"
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
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-crown-gold w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventPhotosCarousel;
