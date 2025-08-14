import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Locations from "@/pages/locations";
import Community from "@/pages/community";
import Rewards from "@/pages/rewards";
import Leaderboard from "@/pages/leaderboard";
import Profile from "@/pages/profile";
import BottomNav from "@/components/bottom-nav";

function Router() {
  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/locations" component={Locations} />
        <Route path="/community" component={Community} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
