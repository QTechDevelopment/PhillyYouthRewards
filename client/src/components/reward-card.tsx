import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Reward, User } from "@shared/schema";

interface RewardCardProps {
  reward: Reward;
  user: User;
  className?: string;
}

export default function RewardCard({ reward, user, className = "" }: RewardCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const canRedeem = user.points >= reward.points;
  const pointsNeeded = reward.points - user.points;

  const redeemMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/redemptions", {
        userId: user.id,
        rewardId: reward.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Reward redeemed!",
        description: `You successfully redeemed ${reward.title}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/demo-user"] });
    },
    onError: () => {
      toast({
        title: "Redemption failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const getColorClass = () => {
    switch (reward.category) {
      case "movie":
        return "bg-purple-500";
      case "gift_card":
        return "bg-orange-500";
      case "local_attraction":
        return "bg-philly-green";
      case "gaming":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      {reward.imageUrl && (
        <img
          src={reward.imageUrl}
          alt={reward.title}
          className="w-full h-20 object-cover rounded-lg mb-3"
        />
      )}
      <h3 className="font-semibold text-sm mb-1">{reward.title}</h3>
      <p className="text-philly-gold font-bold text-lg mb-2">{reward.points} pts</p>
      {canRedeem ? (
        <Button
          className={`w-full ${getColorClass()} text-white py-1 rounded text-xs font-medium`}
          onClick={() => redeemMutation.mutate()}
          disabled={redeemMutation.isPending}
        >
          {redeemMutation.isPending ? "Redeeming..." : "Redeem Now"}
        </Button>
      ) : (
        <Button
          className="w-full bg-gray-100 text-gray-600 py-1 rounded text-xs font-medium"
          disabled
        >
          Need {pointsNeeded} more pts
        </Button>
      )}
    </div>
  );
}
