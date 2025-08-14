import { Bell, User as UserIcon } from "lucide-react";
import type { User } from "@shared/schema";

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const progressPercentage = ((user.points % 1000) / 1000) * 100;
  const pointsToNextLevel = 1000 - (user.points % 1000);

  return (
    <header className="bg-gradient-to-r from-philly-blue to-blue-600 text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20"></div>
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold">Philly Youth Points</h1>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-philly-gold" />
            <div className="w-8 h-8 bg-philly-gold rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-philly-blue" />
            </div>
          </div>
        </div>
        
        {/* Points Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-philly-gold text-sm font-medium">Your Points</p>
              <p className="text-3xl font-bold">{user.points.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="bg-philly-gold text-philly-blue px-3 py-1 rounded-full text-sm font-bold">
                Level {user.level}
              </div>
              <p className="text-xs mt-1 opacity-90">{pointsToNextLevel} to Level {user.level + 1}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="bg-white/20 rounded-full h-2">
              <div 
                className="bg-philly-gold rounded-full h-2 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
