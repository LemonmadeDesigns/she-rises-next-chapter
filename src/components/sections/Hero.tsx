import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  children?: ReactNode;
  className?: string;
  overlay?: boolean;
  fullHeight?: boolean;
}

const Hero = ({
  title,
  subtitle,
  backgroundImage,
  backgroundColor,
  children,
  className,
  overlay = true,
  fullHeight = false,
}: HeroProps) => {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        fullHeight ? "h-screen" : "py-24 md:py-32",
        className
      )}
    >
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed scale-110"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-royal-plum/30 via-transparent to-royal-plum/70" />
          )}
        </>
      )}
      
      {backgroundColor && !backgroundImage && (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor }}
        />
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {typeof title === "string" ? (
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
              {title}
            </h1>
          ) : (
            title
          )}
          
          {subtitle && (
            typeof subtitle === "string" ? (
              <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg">
                {subtitle}
              </p>
            ) : (
              subtitle
            )
          )}
          
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;