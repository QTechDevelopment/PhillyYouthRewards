import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  points: integer("points").notNull().default(0),
  level: integer("level").notNull().default(1),
  avatar: text("avatar"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // farm, library, recycling, landmark
  description: text("description").notNull(),
  address: text("address").notNull(),
  distance: text("distance"), // e.g. "0.3 miles away"
  points: integer("points").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  category: text("category").notNull(), // movie, gift_card, local_attraction, gaming
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
});

export const checkIns = pgTable("check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  locationId: varchar("location_id").notNull(),
  points: integer("points").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const redemptions = pgTable("redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  rewardId: varchar("reward_id").notNull(),
  points: integer("points").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  locationId: varchar("location_id"),
  points: integer("points").default(0),
  likes: integer("likes").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const postComments = pgTable("post_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const postLikes = pgTable("post_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
});

export const insertCheckInSchema = createInsertSchema(checkIns).omit({
  id: true,
  timestamp: true,
  points: true, // Points are calculated server-side based on location
});

export const insertRedemptionSchema = createInsertSchema(redemptions).omit({
  id: true,
  timestamp: true,
  points: true, // Points are calculated server-side based on reward cost
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  timestamp: true,
  likes: true,
});

export const insertPostCommentSchema = createInsertSchema(postComments).omit({
  id: true,
  timestamp: true,
});

export const insertPostLikeSchema = createInsertSchema(postLikes).omit({
  id: true,
  timestamp: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;
export type Redemption = typeof redemptions.$inferSelect;
export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;
export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = z.infer<typeof insertPostLikeSchema>;
