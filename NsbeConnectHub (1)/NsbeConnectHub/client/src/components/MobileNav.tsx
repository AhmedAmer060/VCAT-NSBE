import { Link, useLocation } from "wouter";
import { 
  Calendar, FileText, Video, FolderGit2, 
  MessageCircle, Home
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: FileText, label: "Resume", href: "/resume" },
  { icon: Video, label: "Interview", href: "/interview" },
  { icon: FolderGit2, label: "Projects", href: "/projects" },
  { icon: MessageCircle, label: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 px-4">
      <div className="h-full max-w-md mx-auto flex items-center justify-between">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <a className="flex flex-col items-center gap-1">
                <Icon 
                  className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
                />
                <span 
                  className={`text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  {label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
