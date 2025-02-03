import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import type { SelectProject } from "@db/schema";

interface ProjectCardProps {
  project: SelectProject;
  onJoin?: () => void;
  isParticipant?: boolean;
}

export default function ProjectCard({ project, onJoin, isParticipant }: ProjectCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {project.imageUrl && (
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(project.startDate), "PP")}</span>
          </div>
          
          {project.maxParticipants && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{project.maxParticipants} max participants</span>
            </div>
          )}
          
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
            {project.status}
          </div>
        </div>
        
        <p className="text-sm">{project.description}</p>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          onClick={onJoin}
          disabled={isParticipant}
        >
          {isParticipant ? "Already Joined" : "Join Project"}
        </Button>
      </CardFooter>
    </Card>
  );
}
