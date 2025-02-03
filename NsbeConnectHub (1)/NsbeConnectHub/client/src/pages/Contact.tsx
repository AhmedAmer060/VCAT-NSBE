import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  MessageSquare,
  ExternalLink
} from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/nsbe_vcat",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/company/nsbe-vcat",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/nsbe_vcat",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:nsbe@vaughn.edu",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<ContactForm>();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible",
      });
      reset();
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Connect With Us</CardTitle>
          <CardDescription>
            Follow us on social media for updates and announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
                <ExternalLink className="h-4 w-4 ml-auto opacity-50" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Us a Message</CardTitle>
          <CardDescription>
            Have questions? We'd love to hear from you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register("message", { required: true })}
                placeholder="Your message..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
