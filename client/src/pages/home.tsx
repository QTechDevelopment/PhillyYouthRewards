import { useQuery } from "@tanstack/react-query";
import { QrCode, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import LocationCard from "@/components/location-card";
import RewardCard from "@/components/reward-card";
import ActivityItem from "@/components/activity-item";
import type { User, Location, Reward, CheckIn } from "@shared/schema";

export default function Home() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/demo-user"],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const { data: rewards, isLoading: rewardsLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<(CheckIn & { location: Location })[]>({
    queryKey: ["/api/users", user?.id, "recent-activity"],
    enabled: !!user?.id,
  });

  if (userLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = {
    checkIns: recentActivity?.length || 0,
    locations: locations?.length || 0,
    rewards: 3, // This could be calculated from redemptions
  };

  return (
    <div className="pb-20">
      <Header user={user} />
      
      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-philly-blue to-blue-600 text-white -mt-4 relative z-10">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold">{stats.checkIns}</div>
              <div className="text-xs opacity-90">Check-ins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.locations}</div>
              <div className="text-xs opacity-90">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.rewards}</div>
              <div className="text-xs opacity-90">Rewards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Quick Check-in</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-gradient-to-r from-philly-green to-green-500 text-white p-4 rounded-xl shadow-lg h-auto flex flex-col items-center space-y-2">
            <QrCode className="w-6 h-6" />
            <div className="text-sm font-semibold">Scan QR</div>
            <div className="text-xs opacity-90">+50 points</div>
          </Button>
          <Button className="bg-gradient-to-r from-philly-gold to-yellow-500 text-philly-blue p-4 rounded-xl shadow-lg h-auto flex flex-col items-center space-y-2">
            <MapPin className="w-6 h-6" />
            <div className="text-sm font-semibold">Find Location</div>
            <div className="text-xs opacity-90">Near you</div>
          </Button>
        </div>
      </section>

      {/* Today's Opportunities */}
      <section className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Today's Opportunities</h2>
          <Button variant="link" className="text-philly-blue text-sm font-medium p-0">
            View All
          </Button>
        </div>
        
        {locationsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {locations?.slice(0, 3).map((location) => (
              <LocationCard key={location.id} location={location} userId={user.id} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Rewards */}
      <section className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">Featured Rewards</h2>
          <Button variant="link" className="text-philly-blue text-sm font-medium p-0">
            Rewards Store
          </Button>
        </div>
        
        {rewardsLoading ? (
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="min-w-[160px] h-40 flex-shrink-0 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {rewards?.slice(0, 4).map((reward) => (
              <RewardCard 
                key={reward.id} 
                reward={reward} 
                user={user} 
                className="min-w-[160px] flex-shrink-0" 
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Recent Activity</h2>
        {activityLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.slice(0, 3).map((activity) => (
              <ActivityItem key={activity.id} checkIn={activity} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">No recent activity. Start checking in to earn points!</p>
          </div>
        )}
      </section>
    </div>
  );
}
