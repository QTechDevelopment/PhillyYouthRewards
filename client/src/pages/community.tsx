import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Camera, MapPin, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, CommunityPost, Location, PostComment } from "@shared/schema";

type CommunityPostWithDetails = CommunityPost & { user: User; location?: Location };
type CommentWithUser = PostComment & { user: User };

export default function Community() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/demo-user"],
  });

  const { data: posts, isLoading } = useQuery<CommunityPostWithDetails[]>({
    queryKey: ["/api/community/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; imageUrl?: string; userId: string }) => {
      await apiRequest("POST", "/api/community/posts", postData);
    },
    onSuccess: () => {
      toast({
        title: "Post created!",
        description: "Your community post has been shared successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostImage("");
      setShowCreatePost(false);
    },
    onError: () => {
      toast({
        title: "Failed to create post",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      await apiRequest("POST", `/api/community/posts/${postId}/like`, { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, userId, content }: { postId: string; userId: string; content: string }) => {
      await apiRequest("POST", `/api/community/posts/${postId}/comments`, { userId, content });
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Comment added!",
        description: "Your comment has been posted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts", variables.postId, "comments"] });
      setCommentInputs(prev => ({ ...prev, [variables.postId]: "" }));
    },
  });

  const handleCreatePost = () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return;
    
    createPostMutation.mutate({
      title: newPostTitle,
      content: newPostContent,
      imageUrl: newPostImage || undefined,
      userId: user.id,
    });
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;
    likePostMutation.mutate({ postId, userId: user.id });
  };

  const handleComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!user || !content) return;
    
    createCommentMutation.mutate({
      postId,
      userId: user.id,
      content,
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="pb-20">
        <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <h1 className="text-xl font-bold">Community</h1>
        </header>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
        <h1 className="text-xl font-bold">Community</h1>
        <p className="text-sm opacity-90">Share your experiences and achievements</p>
      </header>

      <div className="p-4 space-y-4">
        {/* Create Post Button */}
        {!showCreatePost && (
          <Card>
            <CardContent className="p-4">
              <Button
                onClick={() => setShowCreatePost(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                Share Your Experience
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Post Form */}
        {showCreatePost && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Create a Post</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Give your post a title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="Share your experience, what did you learn, how did you help the community?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={4}
              />
              <Input
                placeholder="Add a photo URL (optional)"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending || !newPostTitle.trim() || !newPostContent.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  {createPostMutation.isPending ? "Posting..." : "Post"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreatePost(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Community Posts */}
        <div className="space-y-4">
          {posts?.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{post.user.username}</div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(new Date(post.timestamp))}
                      {post.location && (
                        <span className="ml-2 inline-flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {post.location.name}
                        </span>
                      )}
                    </div>
                  </div>
                  {(post.points || 0) > 0 && (
                    <Badge variant="secondary" className="bg-philly-gold text-philly-blue">
                      +{post.points || 0} pts
                    </Badge>
                  )}
                </div>

                {/* Post Content */}
                <div className="mb-3">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                  
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-4 py-2 border-t border-gray-100">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  
                  <div className="flex items-center space-x-1 text-gray-600">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Comment</span>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim() || createCommentMutation.isPending}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts?.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="font-semibold text-gray-800 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share your community experience!</p>
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}