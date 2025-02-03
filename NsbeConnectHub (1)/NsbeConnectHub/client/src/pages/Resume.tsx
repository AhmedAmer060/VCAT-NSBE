import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface ResumeForm {
  file: FileList;
}

export default function Resume() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset } = useForm<ResumeForm>();

  const uploadMutation = useMutation({
    mutationFn: async (fileUrl: string) => {
      await apiRequest("POST", "/api/resumes", {
        userId: 1, // TODO: Get from auth context
        fileUrl,
      });
    },
    onSuccess: () => {
      toast({
        title: "Resume uploaded successfully",
        description: "We'll review your resume and provide feedback soon",
      });
      reset();
    },
  });

  const onSubmit = async (data: ResumeForm) => {
    try {
      setUploading(true);
      // TODO: Implement actual file upload
      const mockFileUrl = "https://example.com/resume.pdf";
      await uploadMutation.mutateAsync(mockFileUrl);
    } catch (error) {
      toast({
        title: "Error uploading resume",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Resume</CardTitle>
          <CardDescription>
            Upload your resume for review by NSBE professionals
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Resume File (PDF)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf"
                {...register("file", { required: true })}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={uploading}
            >
              {uploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
