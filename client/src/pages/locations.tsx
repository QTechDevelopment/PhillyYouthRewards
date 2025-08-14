import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import LocationCard from "@/components/location-card";
import type { User, Location } from "@shared/schema";

export default function Locations() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/demo-user"],
  });

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  if (userLoading || locationsLoading) {
    return (
      <div className="pb-20">
        <header className="bg-philly-blue text-white p-4">
          <h1 className="text-xl font-bold">Locations</h1>
        </header>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  const locationsByType = {
    farm: locations?.filter(l => l.type === "farm") || [],
    recycling: locations?.filter(l => l.type === "recycling") || [],
    library: locations?.filter(l => l.type === "library") || [],
    landmark: locations?.filter(l => l.type === "landmark") || [],
  };

  return (
    <div className="pb-20">
      <header className="bg-philly-blue text-white p-4">
        <h1 className="text-xl font-bold">Locations</h1>
        <p className="text-sm opacity-90">Find places to check in and earn points</p>
      </header>

      <div className="p-4 space-y-6">
        {/* Community Farms */}
        {locationsByType.farm.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Community Farms</h2>
            <div className="space-y-3">
              {locationsByType.farm.map((location) => (
                <LocationCard key={location.id} location={location} userId={user.id} />
              ))}
            </div>
          </section>
        )}

        {/* Recycling Centers */}
        {locationsByType.recycling.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Recycling Centers</h2>
            <div className="space-y-3">
              {locationsByType.recycling.map((location) => (
                <LocationCard key={location.id} location={location} userId={user.id} />
              ))}
            </div>
          </section>
        )}

        {/* Libraries */}
        {locationsByType.library.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Libraries</h2>
            <div className="space-y-3">
              {locationsByType.library.map((location) => (
                <LocationCard key={location.id} location={location} userId={user.id} />
              ))}
            </div>
          </section>
        )}

        {/* Philadelphia Landmarks */}
        {locationsByType.landmark.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Philadelphia Landmarks</h2>
            <div className="grid grid-cols-2 gap-3">
              {locationsByType.landmark.map((location) => (
                <div key={location.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {location.imageUrl && (
                    <img
                      src={location.imageUrl}
                      alt={location.name}
                      className="w-full h-20 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm">{location.name}</h3>
                    <p className="text-philly-gold text-xs font-medium">{location.points} pts reward</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
