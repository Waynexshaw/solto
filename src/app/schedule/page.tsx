"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Mail,
  Send,
  Clock,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Twitter } from "@/components/icons/TwitterIcon";

interface ScheduledPost {
  id: string;
  channelType: "twitter" | "email";
  content: string;
  mediaUrl?: string;
  scheduledFor: string;
  status: "draft" | "scheduled" | "published" | "failed";
  publishedAt?: string;
  createdAt: string;
}

export default function SchedulePage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [channelType, setChannelType] = useState<"twitter" | "email">("twitter");
  const [content, setContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/schedule");
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load scheduled posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Default schedule time to tomorrow 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const isoLocal = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setScheduledDateTime(isoLocal);
  }, []);

  const handleSubmit = async (publishNow: boolean) => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);

    const fullContent = channelType === "email" && emailSubject
      ? `Subject: ${emailSubject}\n\n${content}`
      : content;

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelType,
          content: fullContent,
          mediaUrl: mediaUrl.trim() || undefined,
          scheduledFor: scheduledDateTime,
          publishNow,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          message: publishNow
            ? "Post successfully published live to channel!"
            : "Post scheduled successfully.",
        });
        setContent("");
        setEmailSubject("");
        setMediaUrl("");
        fetchPosts();
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to schedule post" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const twitterCharLimit = 280;
  const remainingChars = twitterCharLimit - content.length;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Publishing & Scheduling</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-normal">
              {posts.length} queued / published
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compose rich multi-channel posts with media attachments for Twitter/X and Email newsletters.
          </p>
        </div>

        <button
          onClick={fetchPosts}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition self-start sm:self-auto"
          title="Refresh Queue"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Layout: Composer (5 Cols) + Scheduled Queue (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Composer */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>Compose Post</span>
            </h2>

            {/* Channel Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setChannelType("twitter")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                  channelType === "twitter"
                    ? "bg-sky-600 text-white font-medium shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Twitter className="w-3.5 h-3.5" />
                Twitter / X
              </button>
              <button
                type="button"
                onClick={() => setChannelType("email")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                  channelType === "email"
                    ? "bg-emerald-600 text-white font-medium shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </button>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                feedback.type === "success"
                  ? "bg-emerald-950/70 border-emerald-800 text-emerald-300"
                  : "bg-rose-950/70 border-rose-800 text-rose-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Email Subject Line if channel is Email */}
          {channelType === "email" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Subject Line
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Product Update: Introducing Solto 0.1..."
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Post Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Post Content
              </label>
              {channelType === "twitter" && (
                <span
                  className={`text-[11px] font-mono ${
                    remainingChars < 0
                      ? "text-rose-400 font-bold"
                      : remainingChars < 20
                      ? "text-amber-400"
                      : "text-slate-500"
                  }`}
                >
                  {remainingChars} chars remaining
                </span>
              )}
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                channelType === "twitter"
                  ? "What's happening? Share insights, release updates, or announcements..."
                  : "Compose your email announcement body (supports markdown and paragraphs)..."
              }
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Media / Attachment URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Media Attachment (Image URL)</span>
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or media link"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
            {mediaUrl && (
              <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-800 max-h-40 bg-slate-950 flex items-center justify-center">
                <img
                  src={mediaUrl}
                  alt="Post preview"
                  className="max-h-40 object-cover w-full"
                  onError={() => {}}
                />
              </div>
            )}
          </div>

          {/* Schedule Date Time Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Schedule Date & Time</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting || !content.trim() || (channelType === "twitter" && remainingChars < 0)}
              onClick={() => handleSubmit(false)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Schedule Post</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting || !content.trim() || (channelType === "twitter" && remainingChars < 0)}
              onClick={() => handleSubmit(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Now</span>
            </button>
          </div>
        </div>

        {/* Right: Scheduled Queue Timeline */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col min-h-0">
          <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Scheduled & Published Posts</span>
            </h2>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="text-center text-xs text-slate-500 py-12">Loading posts queue...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CalendarIcon className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">No scheduled posts yet</p>
                <p className="text-xs text-slate-500 mt-1">Compose a post on the left to schedule publishing.</p>
              </div>
            ) : (
              posts.map((post) => {
                const isTwitter = post.channelType === "twitter";
                const isPublished = post.status === "published";

                return (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${
                            isTwitter ? "bg-sky-600" : "bg-emerald-600"
                          }`}
                        >
                          {isTwitter ? <Twitter className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 capitalize">
                          {isTwitter ? "Twitter / X Post" : "Email Broadcast"}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                          isPublished
                            ? "bg-emerald-950/70 text-emerald-300 border-emerald-800"
                            : "bg-indigo-950/70 text-indigo-300 border-indigo-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.mediaUrl && (
                      <div className="rounded-lg overflow-hidden border border-slate-800 max-h-36">
                        <img src={post.mediaUrl} alt="Attached media" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-900">
                      <span>Scheduled for: {new Date(post.scheduledFor).toLocaleString()}</span>
                      {post.publishedAt && (
                        <span className="text-emerald-400">Published {new Date(post.publishedAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
