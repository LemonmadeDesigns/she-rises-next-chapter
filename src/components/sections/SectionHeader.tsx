import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

const SectionHeader = ({ 
  title, 
  subtitle, 
  className,
  centered = true 
}: SectionHeaderProps) => {
  return (
    <div className={cn(
      "mb-12",
      centered && "text-center",
      className
    )}>
      <h2 className="font-serif text-4xl md:text-5xl font-bold text-royal-plum mb-4">
        {title}
      </h2>
      {subtitle && (
        <>
          <div className="w-24 h-1 bg-crown-gold mx-auto mb-4" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </>
      )}
    </div>
  );
};

export default SectionHeader;