import { 
  type User, 
  type InsertUser, 
  type Location, 
  type InsertLocation,
  type Reward,
  type InsertReward,
  type CheckIn,
  type InsertCheckIn,
  type Redemption,
  type InsertRedemption,
  type CommunityPost,
  type InsertCommunityPost,
  type PostComment,
  type InsertPostComment,
  type PostLike,
  type InsertPostLike
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<User | undefined>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  getActiveLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Rewards
  getRewards(): Promise<Reward[]>;
  getActiveRewards(): Promise<Reward[]>;
  getReward(id: string): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
  
  // Check-ins
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  getUserCheckIns(userId: string): Promise<CheckIn[]>;
  getRecentCheckIns(userId: string, limit?: number): Promise<(CheckIn & { location: Location })[]>;
  
  // Redemptions
  createRedemption(redemption: InsertRedemption): Promise<Redemption>;
  getUserRedemptions(userId: string): Promise<Redemption[]>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<User[]>;
  
  // Community Posts
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  getCommunityPosts(limit?: number): Promise<(CommunityPost & { user: User; location?: Location })[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  likeCommunityPost(postId: string, userId: string): Promise<void>;
  unlikeCommunityPost(postId: string, userId: string): Promise<void>;
  
  // Post Comments
  createPostComment(comment: InsertPostComment): Promise<PostComment>;
  getPostComments(postId: string): Promise<(PostComment & { user: User })[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<string, Location>;
  private rewards: Map<string, Reward>;
  private checkIns: Map<string, CheckIn>;
  private redemptions: Map<string, Redemption>;
  private communityPosts: Map<string, CommunityPost>;
  private postComments: Map<string, PostComment>;
  private postLikes: Map<string, PostLike>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.rewards = new Map();
    this.checkIns = new Map();
    this.redemptions = new Map();
    this.communityPosts = new Map();
    this.postComments = new Map();
    this.postLikes = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed locations
    const seedLocations: InsertLocation[] = [
      {
        name: "Kensington Community Farm",
        type: "farm",
        description: "Help with harvesting and community gardening",
        address: "1234 Kensington Ave, Philadelphia, PA",
        distance: "0.3 miles away",
        points: 75,
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        isActive: true,
      },
      {
        name: "North Philly Recycling Hub",
        type: "recycling",
        description: "Sort materials and learn sustainability",
        address: "5678 North Broad St, Philadelphia, PA",
        distance: "0.7 miles away",
        points: 60,
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        isActive: true,
      },
      {
        name: "Central Library",
        type: "library",
        description: "Reading program and homework help",
        address: "1901 Vine St, Philadelphia, PA",
        distance: "1.2 miles away",
        points: 40,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        isActive: true,
      },
      {
        name: "Franklin Institute",
        type: "landmark",
        description: "Science museum and educational activities",
        address: "222 N 20th St, Philadelphia, PA",
        distance: "2.1 miles away",
        points: 100,
        imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        isActive: true,
      },
    ];

    seedLocations.forEach(location => {
      const id = randomUUID();
      this.locations.set(id, { 
        ...location, 
        id,
        distance: location.distance || null,
        imageUrl: location.imageUrl || null,
        isActive: location.isActive ?? true
      });
    });

    // Seed rewards
    const seedRewards: InsertReward[] = [
      {
        title: "AMC Movie Ticket",
        description: "Single admission to any AMC theater",
        points: 850,
        category: "movie",
        imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        isActive: true,
      },
      {
        title: "$10 Amazon Gift Card",
        description: "Digital gift card for Amazon purchases",
        points: 1000,
        category: "gift_card",
        imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        isActive: true,
      },
      {
        title: "Franklin Institute Entry",
        description: "Free admission to Philadelphia's premier science museum",
        points: 500,
        category: "local_attraction",
        imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        isActive: true,
      },
      {
        title: "Spotify Premium (1 Month)",
        description: "One month of Spotify Premium subscription",
        points: 750,
        category: "gift_card",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        isActive: true,
      },
      {
        title: "V-Bucks ($10)",
        description: "In-game currency for Fortnite",
        points: 800,
        category: "gaming",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
        isActive: true,
      },
    ];

    seedRewards.forEach(reward => {
      const id = randomUUID();
      this.rewards.set(id, { 
        ...reward, 
        id,
        description: reward.description || null,
        imageUrl: reward.imageUrl || null,
        isActive: reward.isActive ?? true
      });
    });

    // Create a demo user
    const demoUser: User = {
      id: randomUUID(),
      username: "demo_user",
      email: "demo@example.com",
      points: 2847,
      level: 3,
      avatar: null,
      joinedAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Seed some community posts
    const seedPosts = [
      {
        userId: demoUser.id,
        title: "Amazing day at Kensington Community Farm! 🌱",
        content: "Just finished helping with the harvest today. Got to learn about sustainable farming and met some awesome people. The tomatoes we grew are going to local families - feels great to give back to the community!",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        locationId: Array.from(this.locations.values())[0]?.id,
        points: 75,
        likes: 12,
      },
      {
        userId: demoUser.id,
        title: "Recycling center volunteer day",
        content: "Spent the morning sorting materials and learning about the recycling process. Did you know that aluminum cans can be recycled infinitely? Every little bit helps our environment! 🌍",
        imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        locationId: Array.from(this.locations.values())[1]?.id,
        points: 60,
        likes: 8,
      }
    ];

    seedPosts.forEach(post => {
      const id = randomUUID();
      this.communityPosts.set(id, {
        ...post,
        id,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7), // Random time within last week
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      points: 0, 
      level: 1, 
      avatar: null,
      joinedAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    user.points = points;
    user.level = Math.floor(points / 1000) + 1; // Level up every 1000 points
    this.users.set(userId, user);
    return user;
  }

  // Location methods
  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getActiveLocations(): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(location => location.isActive);
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { 
      ...insertLocation, 
      id,
      distance: insertLocation.distance || null,
      imageUrl: insertLocation.imageUrl || null,
      isActive: insertLocation.isActive ?? true
    };
    this.locations.set(id, location);
    return location;
  }

  // Reward methods
  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }

  async getActiveRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(reward => reward.isActive);
  }

  async getReward(id: string): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = { 
      ...insertReward, 
      id,
      description: insertReward.description || null,
      imageUrl: insertReward.imageUrl || null,
      isActive: insertReward.isActive ?? true
    };
    this.rewards.set(id, reward);
    return reward;
  }

  // Check-in methods
  async createCheckIn(insertCheckIn: InsertCheckIn): Promise<CheckIn> {
    const id = randomUUID();
    const checkIn: CheckIn = { 
      ...insertCheckIn, 
      id, 
      timestamp: new Date() 
    };
    this.checkIns.set(id, checkIn);
    
    // Update user points
    const user = this.users.get(insertCheckIn.userId);
    if (user) {
      await this.updateUserPoints(insertCheckIn.userId, user.points + insertCheckIn.points);
    }
    
    return checkIn;
  }

  async getUserCheckIns(userId: string): Promise<CheckIn[]> {
    return Array.from(this.checkIns.values()).filter(checkIn => checkIn.userId === userId);
  }

  async getRecentCheckIns(userId: string, limit: number = 10): Promise<(CheckIn & { location: Location })[]> {
    const userCheckIns = await this.getUserCheckIns(userId);
    const sortedCheckIns = userCheckIns
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return sortedCheckIns.map(checkIn => {
      const location = this.locations.get(checkIn.locationId)!;
      return { ...checkIn, location };
    });
  }

  // Redemption methods
  async createRedemption(insertRedemption: InsertRedemption): Promise<Redemption> {
    const id = randomUUID();
    const redemption: Redemption = { 
      ...insertRedemption, 
      id, 
      timestamp: new Date() 
    };
    this.redemptions.set(id, redemption);
    
    // Deduct user points
    const user = this.users.get(insertRedemption.userId);
    if (user) {
      await this.updateUserPoints(insertRedemption.userId, user.points - insertRedemption.points);
    }
    
    return redemption;
  }

  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    return Array.from(this.redemptions.values()).filter(redemption => redemption.userId === userId);
  }

  // Leaderboard
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }

  // Community Posts methods
  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const post: CommunityPost = {
      ...insertPost,
      id,
      imageUrl: insertPost.imageUrl || null,
      locationId: insertPost.locationId || null,
      points: insertPost.points || 0,
      likes: 0,
      timestamp: new Date(),
    };
    this.communityPosts.set(id, post);
    return post;
  }

  async getCommunityPosts(limit: number = 20): Promise<(CommunityPost & { user: User; location?: Location })[]> {
    const posts = Array.from(this.communityPosts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return posts.map(post => {
      const user = this.users.get(post.userId)!;
      const location = post.locationId ? this.locations.get(post.locationId) : undefined;
      return { ...post, user, location };
    });
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async likeCommunityPost(postId: string, userId: string): Promise<void> {
    const existingLike = Array.from(this.postLikes.values())
      .find(like => like.postId === postId && like.userId === userId);
    
    if (!existingLike) {
      const likeId = randomUUID();
      this.postLikes.set(likeId, {
        id: likeId,
        postId,
        userId,
        timestamp: new Date(),
      });

      // Update post likes count
      const post = this.communityPosts.get(postId);
      if (post) {
        post.likes += 1;
        this.communityPosts.set(postId, post);
      }
    }
  }

  async unlikeCommunityPost(postId: string, userId: string): Promise<void> {
    const existingLike = Array.from(this.postLikes.values())
      .find(like => like.postId === postId && like.userId === userId);
    
    if (existingLike) {
      this.postLikes.delete(existingLike.id);

      // Update post likes count
      const post = this.communityPosts.get(postId);
      if (post && post.likes > 0) {
        post.likes -= 1;
        this.communityPosts.set(postId, post);
      }
    }
  }

  async createPostComment(insertComment: InsertPostComment): Promise<PostComment> {
    const id = randomUUID();
    const comment: PostComment = {
      ...insertComment,
      id,
      timestamp: new Date(),
    };
    this.postComments.set(id, comment);
    return comment;
  }

  async getPostComments(postId: string): Promise<(PostComment & { user: User })[]> {
    const comments = Array.from(this.postComments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return comments.map(comment => {
      const user = this.users.get(comment.userId)!;
      return { ...comment, user };
    });
  }
}

export const storage = new MemStorage();

// Initialize with sample data
async function initializeSampleData() {
  // Demo user
  await storage.createUser({
    username: "demo_user",
    email: "demo@example.com",
  });

  // Sample locations
  const locations = [
    {
      name: "Kensington Community Farm",
      type: "farm" as const,
      description: "Help with harvesting and community gardening",
      address: "1234 Kensington Ave, Philadelphia, PA",
      distance: "0.3 miles away",
      points: 75,
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
    {
      name: "North Philly Recycling Hub",
      type: "recycling" as const,
      description: "Sort materials and learn sustainability",
      address: "5678 North Broad St, Philadelphia, PA",
      distance: "0.7 miles away",
      points: 60,
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
    {
      name: "Central Library",
      type: "library" as const,
      description: "Reading program and homework help",
      address: "1901 Vine St, Philadelphia, PA",
      distance: "1.2 miles away",
      points: 40,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
    {
      name: "Franklin Institute",
      type: "landmark" as const,
      description: "Science museum and educational activities",
      address: "222 N 20th St, Philadelphia, PA",
      distance: "2.1 miles away",
      points: 100,
      imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    },
  ];

  for (const location of locations) {
    await storage.createLocation(location);
  }

  // Sample rewards
  const rewards = [
    {
      title: "AMC Movie Ticket",
      description: "Single admission to any AMC theater",
      points: 850,
      category: "movie" as const,
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      title: "$10 Amazon Gift Card",
      description: "Digital gift card for Amazon purchases",
      points: 1000,
      category: "gift_card" as const,
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      title: "Franklin Institute Entry",
      description: "Free admission to Philadelphia's premier science museum",
      points: 500,
      category: "local_attraction" as const,
      imageUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      title: "Spotify Premium (1 Month)",
      description: "One month of Spotify Premium subscription",
      points: 750,
      category: "gift_card" as const,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      title: "V-Bucks ($10)",
      description: "In-game currency for Fortnite",
      points: 800,
      category: "gaming" as const,
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
  ];

  for (const reward of rewards) {
    await storage.createReward(reward);
  }
}

// Initialize sample data on startup
initializeSampleData().catch(console.error);
