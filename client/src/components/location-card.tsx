import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Location } from "@shared/schema";

interface LocationCardProps {
  location: Location;
  userId: string;
  onCheckIn?: () => void;
}

export default function LocationCard({ location, userId, onCheckIn }: LocationCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/check-ins", {
        userId,
        locationId: location.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Check-in successful!",
        description: `You earned ${location.points} points from ${location.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/demo-user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "recent-activity"] });
      onCheckIn?.();
    },
    onError: () => {
      toast({
        title: "Check-in failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const getColorClass = () => {
    switch (location.type) {
      case "farm":
        return "bg-philly-green";
      case "recycling":
        return "bg-philly-blue";
      case "library":
        return "bg-philly-gold text-philly-blue";
      case "landmark":
        return "bg-purple-500";
      default:
        return "bg-philly-blue";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {location.imageUrl && (
        <img
          src={location.imageUrl}
          alt={location.name}
          className="w-full h-32 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-800">{location.name}</h3>
            {location.distance && (
              <p className="text-sm text-gray-600">{location.distance}</p>
            )}
          </div>
          <div className={`${getColorClass()} text-white px-2 py-1 rounded-full text-xs font-medium`}>
            +{location.points} pts
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{location.description}</p>
        <Button
          className={`w-full ${getColorClass()} font-medium`}
          onClick={() => checkInMutation.mutate()}
          disabled={checkInMutation.isPending}
        >
          {checkInMutation.isPending ? "Checking in..." : "Check In Now"}
        </Button>
      </div>
    </div>
  );
}
