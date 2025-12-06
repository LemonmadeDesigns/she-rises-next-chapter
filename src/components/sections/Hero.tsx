import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import OptimizedHero from "@/components/images/OptimizedHero";

interface HeroProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  backgroundImage?: string;
  backgroundImageWebp?: string;
  backgroundImageAvif?: string;
  backgroundImageBlur?: string;
  backgroundImageAlt?: string;
  backgroundImageWidth?: number;
  backgroundImageHeight?: number;
  backgroundColor?: string;
  children?: ReactNode;
  className?: string;
  overlay?: boolean;
  fullHeight?: boolean;
  parallax?: boolean;
}

const Hero = ({
  title,
  subtitle,
  backgroundImage,
  backgroundImageWebp,
  backgroundImageAvif,
  backgroundImageBlur,
  backgroundImageAlt = "She Rises: every woman deserves a safe place to rise",
  backgroundImageWidth = 1920,
  backgroundImageHeight = 1080,
  backgroundColor,
  children,
  className,
  overlay = true,
  fullHeight = false,
  parallax = false,
}: HeroProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!parallax) return;

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame for smooth 60fps updates
      rafRef.current = requestAnimationFrame(() => {
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          const scrolled = -rect.top;
          setScrollPosition(scrolled);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [parallax]);

  const parallaxStyle = parallax ? {
    transform: `translate3d(0, ${scrollPosition * 0.5}px, 0)`,
    willChange: 'transform',
  } : {};

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden",
        fullHeight ? "h-screen" : "py-24 md:py-32",
        fullHeight && "m-0 p-0", // Remove any margins/padding for fullHeight
        className
      )}
    >
      {backgroundImage && (
        <>
          <OptimizedHero
            src={backgroundImage}
            webpSrc={backgroundImageWebp}
            avifSrc={backgroundImageAvif}
            blurSrc={backgroundImageBlur}
            alt={backgroundImageAlt}
            width={backgroundImageWidth}
            height={backgroundImageHeight}
            className="absolute inset-0"
            style={parallaxStyle}
            priority={true}
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