import { useLocation } from "wouter";
import { Home, MapPin, Gift, Trophy, User, Users } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/locations", icon: MapPin, label: "Locations" },
  { path: "/community", icon: Users, label: "Community" },
  { path: "/rewards", icon: Gift, label: "Rewards" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <button
              key={path}
              onClick={() => setLocation(path)}
              className={`flex flex-col items-center p-2 ${
                isActive ? "text-philly-blue" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
