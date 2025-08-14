import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import RewardCard from "@/components/reward-card";
import type { User, Reward } from "@shared/schema";

export default function Rewards() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/demo-user"],
  });

  const { data: rewards, isLoading: rewardsLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  if (userLoading || rewardsLoading) {
    return (
      <div className="pb-20">
        <header className="bg-philly-green text-white p-4">
          <h1 className="text-xl font-bold">Rewards Store</h1>
        </header>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const rewardsByCategory = {
    movie: rewards?.filter(r => r.category === "movie") || [],
    gift_card: rewards?.filter(r => r.category === "gift_card") || [],
    local_attraction: rewards?.filter(r => r.category === "local_attraction") || [],
    gaming: rewards?.filter(r => r.category === "gaming") || [],
  };

  return (
    <div className="pb-20">
      <header className="bg-philly-green text-white p-4">
        <h1 className="text-xl font-bold">Rewards Store</h1>
        <p className="text-sm opacity-90">Redeem your points for amazing rewards</p>
        <div className="mt-2 bg-white/20 rounded-lg px-3 py-1 inline-block">
          <span className="font-bold">{user.points.toLocaleString()} points available</span>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Movies & Entertainment */}
        {rewardsByCategory.movie.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Movies & Entertainment</h2>
            <div className="grid grid-cols-2 gap-3">
              {rewardsByCategory.movie.map((reward) => (
                <RewardCard key={reward.id} reward={reward} user={user} />
              ))}
            </div>
          </section>
        )}

        {/* Gift Cards */}
        {rewardsByCategory.gift_card.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Gift Cards</h2>
            <div className="grid grid-cols-2 gap-3">
              {rewardsByCategory.gift_card.map((reward) => (
                <RewardCard key={reward.id} reward={reward} user={user} />
              ))}
            </div>
          </section>
        )}

        {/* Local Attractions */}
        {rewardsByCategory.local_attraction.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Philadelphia Attractions</h2>
            <div className="grid grid-cols-2 gap-3">
              {rewardsByCategory.local_attraction.map((reward) => (
                <RewardCard key={reward.id} reward={reward} user={user} />
              ))}
            </div>
          </section>
        )}

        {/* Gaming */}
        {rewardsByCategory.gaming.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Gaming</h2>
            <div className="grid grid-cols-2 gap-3">
              {rewardsByCategory.gaming.map((reward) => (
                <RewardCard key={reward.id} reward={reward} user={user} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
