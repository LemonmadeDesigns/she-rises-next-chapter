import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  featured?: boolean;
  href?: string;
  donationsNeeded?: string[];
}

const EventCard = ({
  title,
  date,
  time,
  location,
  description,
  featured,
  href,
  donationsNeeded
}: EventCardProps) => {
  const formattedDate = format(new Date(date), "MMMM d, yyyy");
  
  return (
    <Card className="shadow-soft transition-shadow h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold text-royal-plum mb-3">
              {title}
            </h3>
            
            <div className="space-y-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-lotus-rose" />
                <span>{formattedDate}</span>
              </div>
              
              {time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-lotus-rose" />
                  <span>{time}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-lotus-rose" />
                <span>{location}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4 flex-1">
              {description}
            </p>
            
            {donationsNeeded && donationsNeeded.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-royal-plum mb-2">
                  Donations Needed:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {donationsNeeded.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-crown-gold mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {featured && (
            <Badge variant="outline" className="border-crown-gold text-crown-gold ml-4">
              Featured
            </Badge>
          )}
        </div>

        <div className="mt-auto">
        <div className="flex gap-2">
          {href && (
            <Link to={href}>
              <Button size="sm" className="bg-lotus-rose hover:bg-lotus-rose/90 text-white">
                RSVP
              </Button>
            </Link>
          )}
          <Button size="sm" variant="outline">
            Learn More
          </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;