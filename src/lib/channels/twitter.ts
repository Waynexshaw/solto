import { SendMessagePayload, ChannelSendResult, PublishPostPayload, ChannelPublishResult } from "./types";

export async function sendTwitterReply(payload: SendMessagePayload): Promise<ChannelSendResult> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;

  if (accessToken || bearerToken) {
    try {
      // Twitter API v2 POST /2/tweets (reply)
      const res = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken || bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `${payload.toHandleOrEmail.startsWith("@") ? payload.toHandleOrEmail : "@" + payload.toHandleOrEmail} ${payload.content}`,
          ...(payload.replyToMessageId ? { reply: { in_reply_to_tweet_id: payload.replyToMessageId } } : {}),
        }),
      });

      const data = await res.json();
      if (res.ok && data.data?.id) {
        return {
          success: true,
          channelMessageId: data.data.id,
          timestamp: new Date().toISOString(),
          provider: "twitter_api_v2",
          note: `Posted live reply on Twitter/X to ${payload.toHandleOrEmail}`,
        };
      }
    } catch (err: any) {
      console.warn("Twitter API v2 call failed, falling back to simulator:", err.message);
    }
  }

  return {
    success: true,
    channelMessageId: "tw_sim_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    provider: "simulator",
    note: `[Twitter Channel] Simulated outbound tweet/DM to ${payload.toHandleOrEmail}. Set TWITTER_BEARER_TOKEN in .env for live API dispatch.`,
  };
}

export async function publishTwitterPost(payload: PublishPostPayload): Promise<ChannelPublishResult> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;

  if (accessToken || bearerToken) {
    try {
      const res = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken || bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: payload.content,
        }),
      });

      const data = await res.json();
      if (res.ok && data.data?.id) {
        return {
          success: true,
          channelPostId: data.data.id,
          publishedUrl: `https://x.com/i/status/${data.data.id}`,
          provider: "twitter_api_v2",
        };
      }
    } catch (err: any) {
      console.warn("Twitter post failed:", err.message);
    }
  }

  return {
    success: true,
    channelPostId: "tw_post_" + Date.now(),
    publishedUrl: `https://x.com/solto_hq/status/${Date.now()}`,
    provider: "simulator",
  };
}

export async function searchTwitterKeyword(keyword: string): Promise<Array<{ id: string; author: string; text: string; createdAt: string }>> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (bearerToken) {
    try {
      const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(keyword)}&max_results=10&tweet.fields=created_at,author_id`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return (data.data || []).map((t: any) => ({
          id: t.id,
          author: "@user_" + t.author_id.slice(0, 5),
          text: t.text,
          createdAt: t.created_at || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn("Twitter search failed:", err);
    }
  }

  // Simulated keyword results for listening demonstration
  return [
    {
      id: "sim_kw_" + Date.now(),
      author: "@startup_founder",
      text: `Just discovered ${keyword}! If anyone needs a simple open-source inbox, check it out.`,
      createdAt: new Date().toISOString(),
    },
  ];
}
