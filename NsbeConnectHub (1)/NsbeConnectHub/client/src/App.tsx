import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Resume from "@/pages/Resume";
import Interview from "@/pages/Interview";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";
import MobileNav from "@/components/MobileNav";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pb-16"> {/* Add padding for mobile nav */}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/events" component={Events} />
          <Route path="/resume" component={Resume} />
          <Route path="/interview" component={Interview} />
          <Route path="/projects" component={Projects} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
