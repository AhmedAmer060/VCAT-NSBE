import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface InterviewForm {
  date: Date;
  type: "technical" | "behavioral";
}

export default function Interview() {
  const { toast } = useToast();
  const { handleSubmit, setValue, watch } = useForm<InterviewForm>();

  const { data: interviews } = useQuery({
    queryKey: ["/api/interviews/1"], // TODO: Get userId from auth context
  });

  const scheduleMutation = useMutation({
    mutationFn: async (data: InterviewForm) => {
      await apiRequest("POST", "/api/interviews", {
        userId: 1, // TODO: Get from auth context
        ...data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Interview scheduled",
        description: "We'll send you a confirmation email with more details",
      });
    },
  });

  const onSubmit = (data: InterviewForm) => {
    scheduleMutation.mutate(data);
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Mock Interview</CardTitle>
          <CardDescription>
            Practice your interview skills with NSBE professionals
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select
                onValueChange={(value) => 
                  setValue("type", value as "technical" | "behavioral")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={watch("date")}
                onSelect={(date) => date && setValue("date", date)}
                className="rounded-md border"
                disabled={(date) => 
                  date < new Date() || date.getDay() === 0 || date.getDay() === 6
                }
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={scheduleMutation.isPending}
            >
              {scheduleMutation.isPending ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
