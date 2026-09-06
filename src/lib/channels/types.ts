export interface SendMessagePayload {
  toHandleOrEmail: string;
  content: string;
  replyToMessageId?: string;
  mediaUrls?: string[];
}

export interface ChannelSendResult {
  success: boolean;
  channelMessageId: string;
  timestamp: string;
  provider: "twitter_api_v2" | "resend_smtp" | "simulator";
  note?: string;
}

export interface PublishPostPayload {
  channelType: "twitter" | "email";
  content: string;
  mediaUrl?: string;
}

export interface ChannelPublishResult {
  success: boolean;
  publishedUrl?: string;
  channelPostId: string;
  provider: string;
}
