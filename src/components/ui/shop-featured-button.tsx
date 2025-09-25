import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShopFeaturedButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
  href?: string;
  onClick?: () => void;
}

export default function ShopFeaturedButton({ 
  className,
  size = "lg",
  variant = "default",
  href,
  onClick
}: ShopFeaturedButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    } else {
      // Default behavior: scroll to featured section
      const featuredSection = document.querySelector('[data-section="featured-products"]');
      if (featuredSection) {
        featuredSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      aria-label="Shop Featured Items - View our hand-picked collection"
      className={cn(
        "inline-flex items-center gap-2 font-semibold transition-all duration-300",
        "bg-crown-gold hover:bg-crown-gold/90 text-royal-plum",
        "hover:scale-105 hover:shadow-lg active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-crown-gold focus-visible:ring-offset-2",
        className
      )}
    >
      <ShoppingBag className="w-5 h-5" />
      Shop Featured Items
    </Button>
  );
}