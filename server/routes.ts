import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCheckInSchema, insertRedemptionSchema, insertUserSchema, insertCommunityPostSchema, insertPostCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Get demo user (for development)
  app.get("/api/demo-user", async (req, res) => {
    try {
      const demoUser = await storage.getUserByUsername("demo_user");
      if (!demoUser) {
        return res.status(404).json({ error: "Demo user not found" });
      }
      res.json(demoUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demo user" });
    }
  });

  // Location routes
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getActiveLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const location = await storage.getLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });

  // Reward routes
  app.get("/api/rewards", async (req, res) => {
    try {
      const rewards = await storage.getActiveRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });

  // Check-in routes
  app.post("/api/check-ins", async (req, res) => {
    try {
      const checkInData = insertCheckInSchema.parse(req.body);
      
      // Verify location exists and get points
      const location = await storage.getLocation(checkInData.locationId);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      // Create check-in with location points
      const checkIn = await storage.createCheckIn({
        ...checkInData,
        points: location.points,
      });

      res.status(201).json(checkIn);
    } catch (error) {
      console.error("Check-in validation error:", error);
      res.status(400).json({ error: "Invalid check-in data", details: (error as Error).message });
    }
  });

  app.get("/api/users/:userId/check-ins", async (req, res) => {
    try {
      const checkIns = await storage.getUserCheckIns(req.params.userId);
      res.json(checkIns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch check-ins" });
    }
  });

  app.get("/api/users/:userId/recent-activity", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentActivity = await storage.getRecentCheckIns(req.params.userId, limit);
      res.json(recentActivity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent activity" });
    }
  });

  // Redemption routes
  app.post("/api/redemptions", async (req, res) => {
    try {
      const redemptionData = insertRedemptionSchema.parse(req.body);
      
      // Verify reward exists and get points
      const reward = await storage.getReward(redemptionData.rewardId);
      if (!reward) {
        return res.status(404).json({ error: "Reward not found" });
      }

      // Verify user has enough points
      const user = await storage.getUser(redemptionData.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.points < reward.points) {
        return res.status(400).json({ error: "Insufficient points" });
      }

      // Create redemption
      const redemption = await storage.createRedemption({
        ...redemptionData,
        points: reward.points,
      });

      res.status(201).json(redemption);
    } catch (error) {
      console.error("Redemption validation error:", error);
      res.status(400).json({ error: "Invalid redemption data", details: (error as Error).message });
    }
  });

  app.get("/api/users/:userId/redemptions", async (req, res) => {
    try {
      const redemptions = await storage.getUserRedemptions(req.params.userId);
      res.json(redemptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch redemptions" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Community routes
  app.post("/api/community/posts", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Post creation error:", error);
      res.status(400).json({ error: "Invalid post data", details: (error as Error).message });
    }
  });

  app.get("/api/community/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const posts = await storage.getCommunityPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch community posts" });
    }
  });

  app.post("/api/community/posts/:postId/like", async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      await storage.likeCommunityPost(postId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to like post" });
    }
  });

  app.delete("/api/community/posts/:postId/like", async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      await storage.unlikeCommunityPost(postId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to unlike post" });
    }
  });

  app.post("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const commentData = insertPostCommentSchema.parse({
        ...req.body,
        postId,
      });
      
      const comment = await storage.createPostComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Comment creation error:", error);
      res.status(400).json({ error: "Invalid comment data", details: (error as Error).message });
    }
  });

  app.get("/api/community/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await storage.getPostComments(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
