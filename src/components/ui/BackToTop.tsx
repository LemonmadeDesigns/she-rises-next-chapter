import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      className={cn(
        "fixed right-4 md:right-8 z-[60] h-12 w-12 rounded-full p-0 shadow-lg transition-all duration-300 bg-crown-gold hover:bg-crown-gold/90 text-royal-plum md:!bottom-8",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
};

export default BackToTop;