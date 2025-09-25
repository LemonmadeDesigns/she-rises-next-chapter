import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CallCrisisHotlineButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
  href?: string;
  onClick?: () => void;
}

export default function CallCrisisHotlineButton({ 
  className,
  size = "lg",
  variant = "outline",
  href,
  onClick
}: CallCrisisHotlineButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    } else {
      // Default behavior: scroll to emergency resources section
      const emergencySection = document.querySelector('[data-section="emergency-resources"]');
      if (emergencySection) {
        emergencySection.scrollIntoView({ 
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
      aria-label="Call Crisis Hotline - 24/7 emergency support available"
      className={cn(
        "inline-flex items-center gap-2 font-semibold transition-all duration-300",
        "hero-button-secondary btn-force-visible",
        "hover:scale-105 hover:shadow-lg active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
        className
      )}
    >
      <Phone className="w-5 h-5" />
      Call Crisis Hotline
    </Button>
  );
}