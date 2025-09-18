import { Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewAllCategoriesButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
  href?: string;
  onClick?: () => void;
}

export default function ViewAllCategoriesButton({ 
  className,
  size = "lg",
  variant = "outline",
  href,
  onClick
}: ViewAllCategoriesButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    } else {
      // Default behavior: scroll to all products section
      const allProductsSection = document.querySelector('[data-section="all-products"]');
      if (allProductsSection) {
        allProductsSection.scrollIntoView({ 
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
      aria-label="View All Categories - Browse our complete product collection"
      className={cn(
        "inline-flex items-center gap-2 font-semibold transition-all duration-300",
        "hero-button-secondary btn-force-visible",
        "hover:scale-105 hover:shadow-lg active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
        className
      )}
    >
      <Grid className="w-5 h-5" />
      View All Categories
    </Button>
  );
}