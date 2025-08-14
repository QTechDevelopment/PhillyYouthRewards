import { Sprout, Recycle, Book, MapPin } from "lucide-react";
import type { CheckIn, Location } from "@shared/schema";

interface ActivityItemProps {
  checkIn: CheckIn & { location: Location };
}

export default function ActivityItem({ checkIn }: ActivityItemProps) {
  const getIcon = () => {
    switch (checkIn.location.type) {
      case "farm":
        return <Sprout className="w-4 h-4 text-philly-green" />;
      case "recycling":
        return <Recycle className="w-4 h-4 text-philly-blue" />;
      case "library":
        return <Book className="w-4 h-4 text-philly-gold" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIconBgColor = () => {
    switch (checkIn.location.type) {
      case "farm":
        return "bg-philly-green/10";
      case "recycling":
        return "bg-philly-blue/10";
      case "library":
        return "bg-philly-gold/10";
      default:
        return "bg-gray-100";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div className={`${getIconBgColor()} p-2 rounded-lg`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              {checkIn.location.type === "farm" && "Community Garden Check-in"}
              {checkIn.location.type === "recycling" && "Recycling Activity"}
              {checkIn.location.type === "library" && "Reading Session"}
              {checkIn.location.type === "landmark" && "Landmark Visit"}
            </h3>
            <p className="text-gray-600 text-xs">{checkIn.location.name}</p>
            <p className="text-gray-500 text-xs">{formatTimeAgo(new Date(checkIn.timestamp))}</p>
          </div>
        </div>
        <div className="text-philly-green font-bold text-sm">+{checkIn.points} pts</div>
      </div>
    </div>
  );
}
