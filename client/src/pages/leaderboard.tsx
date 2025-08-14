import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Award } from "lucide-react";
import type { User } from "@shared/schema";

export default function Leaderboard() {
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/demo-user"],
  });

  const { data: leaderboard, isLoading } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (isLoading) {
    return (
      <div className="pb-20">
        <header className="bg-philly-gold text-philly-blue p-4">
          <h1 className="text-xl font-bold">Leaderboard</h1>
        </header>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-yellow-600" />;
      default:
        return (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
            {rank}
          </div>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-white border-gray-100";
    }
  };

  return (
    <div className="pb-20">
      <header className="bg-philly-gold text-philly-blue p-4">
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-sm opacity-90">See how you rank among Philadelphia youth</p>
      </header>

      <div className="p-4">
        {/* Current User Stats */}
        {currentUser && (
          <div className="bg-philly-blue text-white rounded-xl p-4 mb-6">
            <div className="text-center">
              <h3 className="font-bold text-lg">Your Ranking</h3>
              <div className="mt-2">
                <div className="text-2xl font-bold">{currentUser.points.toLocaleString()}</div>
                <div className="text-sm opacity-90">points</div>
              </div>
              <div className="mt-2">
                <div className="bg-philly-gold text-philly-blue px-3 py-1 rounded-full text-sm font-bold inline-block">
                  Level {currentUser.level}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Users */}
        <div className="space-y-3">
          {leaderboard?.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === currentUser?.id;
            
            return (
              <div
                key={user.id}
                className={`${getRankColor(rank)} ${
                  isCurrentUser ? "ring-2 ring-philly-blue" : ""
                } rounded-xl border p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(rank)}
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {isCurrentUser ? "You" : user.username}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Level {user.level}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-800">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">points</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Badges */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Achievement Badges</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="w-12 h-12 bg-philly-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-philly-green" />
              </div>
              <div className="text-sm font-semibold text-gray-800">Top Performer</div>
              <div className="text-xs text-gray-600">1000+ points</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="w-12 h-12 bg-philly-blue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Medal className="w-6 h-6 text-philly-blue" />
              </div>
              <div className="text-sm font-semibold text-gray-800">Community Helper</div>
              <div className="text-xs text-gray-600">10+ check-ins</div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <div className="w-12 h-12 bg-philly-gold/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-philly-gold" />
              </div>
              <div className="text-sm font-semibold text-gray-800">Explorer</div>
              <div className="text-xs text-gray-600">Visit 5+ locations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
