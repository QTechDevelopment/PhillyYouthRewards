import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Calendar, MapPin, Gift, Trophy } from "lucide-react";
import type { User, CheckIn, Location } from "@shared/schema";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/demo-user"],
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<(CheckIn & { location: Location })[]>({
    queryKey: ["/api/users", user?.id, "recent-activity"],
    enabled: !!user?.id,
  });

  if (userLoading) {
    return (
      <div className="pb-20">
        <header className="bg-gradient-to-r from-philly-blue to-blue-600 text-white p-4">
          <Skeleton className="h-8 w-32 mb-2 bg-white/20" />
          <Skeleton className="h-4 w-48 bg-white/20" />
        </header>
        <div className="p-4 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const stats = {
    totalCheckIns: recentActivity?.length || 0,
    totalPoints: user.points,
    level: user.level,
    joinedDate: new Date(user.joinedAt).toLocaleDateString(),
  };

  return (
    <div className="pb-20">
      <header className="bg-gradient-to-r from-philly-blue to-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Profile</h1>
        <p className="text-sm opacity-90">Your Philly Youth Points journey</p>
      </header>

      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-philly-gold rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-philly-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {stats.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-philly-blue/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-philly-blue">{stats.level}</div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="bg-philly-gold/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-philly-gold">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-philly-green/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-philly-green" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{stats.totalCheckIns}</div>
                <div className="text-sm text-gray-600">Check-ins</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">3</div>
                <div className="text-sm text-gray-600">Rewards</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-philly-green/10 rounded-lg">
              <Trophy className="w-6 h-6 text-philly-green" />
              <div>
                <div className="font-semibold text-sm text-gray-800">Community Helper</div>
                <div className="text-xs text-gray-600">Completed 10+ check-ins</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-philly-blue/10 rounded-lg">
              <Trophy className="w-6 h-6 text-philly-blue" />
              <div>
                <div className="font-semibold text-sm text-gray-800">Point Collector</div>
                <div className="text-xs text-gray-600">Earned 1000+ points</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg">
              <Trophy className="w-6 h-6 text-gray-400" />
              <div>
                <div className="font-semibold text-sm text-gray-600">Explorer</div>
                <div className="text-xs text-gray-500">Visit 10 different locations (3/10)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        {!activityLoading && recentActivity && recentActivity.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This week:</span>
                <span className="font-semibold">
                  {recentActivity.slice(0, 7).reduce((sum, activity) => sum + activity.points, 0)} points
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Favorite location:</span>
                <span className="font-semibold">
                  {recentActivity[0]?.location.name || "None yet"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Points to next level:</span>
                <span className="font-semibold text-philly-gold">
                  {1000 - (user.points % 1000)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
