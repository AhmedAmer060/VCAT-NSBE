import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import vaughnLogo from "../assets/image_1738537661476.png";
import nsbeLogo from "../assets/image_1738537676742.png";
import eboardImage from "../assets/unnamed.jpg";

function ConferenceCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const conferenceDate = new Date('2025-03-05T00:00:00'); // NSBE 2025 Conference Start Date

    const timer = setInterval(() => {
      const now = new Date();
      const difference = conferenceDate.getTime() - now.getTime();

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-2">NSBE 51st Annual Convention</h2>
      <p className="text-sm text-muted-foreground mb-1">INSPIRE! EXCEL! IMPACT!</p>
      <p className="text-sm text-muted-foreground mb-2">
        March 5-9, 2025 • Chicago, Illinois
      </p>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground">Days</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-muted-foreground">Mins</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-muted-foreground">Secs</div>
        </div>
      </div>
    </Card>
  );
}

export default function Home() {
  const [_, navigate] = useLocation();
  const [imagesLoaded, setImagesLoaded] = useState({
    vaughnLogo: false,
    nsbeLogo: false,
    eboard: false
  });

  const handleImageLoad = (imageName: keyof typeof imagesLoaded) => {
    setImagesLoaded(prev => ({ ...prev, [imageName]: true }));
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <div className="text-center space-y-4">
        <div className={`h-12 relative ${!imagesLoaded.vaughnLogo ? 'bg-muted animate-pulse rounded' : ''}`}>
          <img
            src={vaughnLogo}
            alt="Vaughn College Logo"
            className={`h-12 mx-auto ${!imagesLoaded.vaughnLogo ? 'invisible' : ''}`}
            onLoad={() => handleImageLoad('vaughnLogo')}
          />
        </div>
        <div className={`flex justify-center h-24 ${!imagesLoaded.nsbeLogo ? 'bg-muted animate-pulse rounded' : ''}`}>
          <img
            src={nsbeLogo}
            alt="NSBE Logo"
            className={`h-24 ${!imagesLoaded.nsbeLogo ? 'invisible' : ''}`}
            onLoad={() => handleImageLoad('nsbeLogo')}
          />
        </div>
        <h1 className="text-2xl font-bold text-primary">VCAT NSBE</h1>
        <p className="text-muted-foreground">
          Welcome to the Vaughn College of Aeronautics and Technology NSBE Chapter Portal
        </p>
      </div>

      <ConferenceCountdown />

      <div className={`aspect-video rounded-lg overflow-hidden ${!imagesLoaded.eboard ? 'bg-muted animate-pulse' : ''}`}>
        <img
          src={eboardImage}
          alt="VCAT NSBE E-board and Active Members"
          className={`w-full h-full object-cover ${!imagesLoaded.eboard ? 'invisible' : ''}`}
          onLoad={() => handleImageLoad('eboard')}
        />
      </div>

      <div className="grid gap-4">
        <Card className="p-4 space-y-2 border-primary/20">
          <h2 className="font-semibold">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">
            View and register for chapter events
          </p>
          <Button onClick={() => navigate("/events")}>View Events</Button>
        </Card>

        <Card className="p-4 space-y-2 border-primary/20">
          <h2 className="font-semibold">Resume Review</h2>
          <p className="text-sm text-muted-foreground">
            Submit your resume for professional review
          </p>
          <Button onClick={() => navigate("/resume")}>Submit Resume</Button>
        </Card>

        <Card className="p-4 space-y-2 border-primary/20">
          <h2 className="font-semibold">Mock Interviews</h2>
          <p className="text-sm text-muted-foreground">
            Practice your interview skills
          </p>
          <Button onClick={() => navigate("/interview")}>Schedule Interview</Button>
        </Card>

        <Card className="p-4 space-y-2 border-primary/20">
          <h2 className="font-semibold">Projects Hub</h2>
          <p className="text-sm text-muted-foreground">
            Join ongoing NSBE projects
          </p>
          <Button onClick={() => navigate("/projects")}>Browse Projects</Button>
        </Card>
      </div>
    </div>
  );
}