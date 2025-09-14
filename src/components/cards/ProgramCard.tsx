import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Briefcase, Users, Heart, Link as LinkIcon, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Briefcase,
  Users,
  Heart,
  Link: LinkIcon,
};

interface ProgramCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  href?: string;
  image?: string;
  className?: string;
}

const ProgramCard = ({
  title,
  subtitle,
  description,
  icon,
  href,
  image,
  className
}: ProgramCardProps) => {
  const Icon = iconMap[icon] || Home;
  
  return (
    <Card className={cn(
      "overflow-hidden shadow-soft transition-all duration-300 bg-white h-full flex flex-col",
      className
    )}>
      {image && (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-crown-gold rounded-full flex items-center justify-center shadow-lg">
              <Icon className="h-6 w-6 text-royal-plum" />
            </div>
          </div>
        </div>
      )}
      
      <CardContent className={cn("p-6 flex-1 flex flex-col", !image && "pt-8")}>
        {!image && (
          <div className="w-14 h-14 bg-lotus-rose rounded-2xl flex items-center justify-center mb-4">
            <Icon className="h-7 w-7 text-white" />
          </div>
        )}
        
        <h3 className="font-serif text-xl font-bold text-royal-plum mb-2">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-sm text-lotus-rose font-medium mb-2">
            {subtitle}
          </p>
        )}
        
        <p className="text-muted-foreground mb-4 flex-1">
          {description}
        </p>

        <div className="mt-auto">
        {href && (
          <Link to={href}>
            <Button 
              variant="outline" 
              className="border-lotus-rose text-lotus-rose hover:bg-lotus-rose hover:text-white"
            >
              Learn More →
            </Button>
          </Link>
        )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;