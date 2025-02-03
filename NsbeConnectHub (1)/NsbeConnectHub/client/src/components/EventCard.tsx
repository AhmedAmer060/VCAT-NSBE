import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import type { SelectEvent } from "@db/schema";

interface EventCardProps {
  event: SelectEvent;
  onRegister?: () => void;
  isRegistered?: boolean;
}

export default function EventCard({ event, onRegister, isRegistered }: EventCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {event.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.date), "PPp")}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          
          {event.maxAttendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{event.maxAttendees} max attendees</span>
            </div>
          )}
        </div>
        
        <p className="text-sm">{event.description}</p>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          onClick={onRegister}
          disabled={isRegistered}
        >
          {isRegistered ? "Registered" : "Register Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
