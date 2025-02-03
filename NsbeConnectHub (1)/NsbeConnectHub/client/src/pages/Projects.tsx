import { useQuery, useMutation } from "@tanstack/react-query";
import ProjectCard from "@/components/ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SelectProject } from "@db/schema";

export default function Projects() {
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<SelectProject[]>({
    queryKey: ["/api/projects"],
  });

  const joinMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest("POST", "/api/projects/join", {
        userId: 1, // TODO: Get from auth context
        projectId,
        role: "member",
      });
    },
    onSuccess: () => {
      toast({
        title: "Successfully joined project",
        description: "You'll be contacted by the project lead soon",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-4" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Active Projects</h1>

      <div className="space-y-4">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onJoin={() => joinMutation.mutate(project.id)}
            isParticipant={false} // TODO: Check participation status
          />
        ))}
      </div>
    </div>
  );
}