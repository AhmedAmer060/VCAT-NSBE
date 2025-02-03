import { useQuery, useMutation } from "@tanstack/react-query";
import EventCard from "@/components/EventCard";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SelectEvent } from "@db/schema";

export default function Events() {
  const { toast } = useToast();

  const { data: events, isLoading } = useQuery<SelectEvent[]>({
    queryKey: ["/api/events"],
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest("POST", "/api/events/register", {
        userId: 1, // TODO: Get from auth context
        eventId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "You have been registered for the event",
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
      <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>

      <div className="space-y-4">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={() => registerMutation.mutate(event.id)}
            isRegistered={false} // TODO: Check registration status
          />
        ))}
      </div>
    </div>
  );
}