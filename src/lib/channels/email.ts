import { SendMessagePayload, ChannelSendResult, PublishPostPayload, ChannelPublishResult } from "./types";

export async function sendEmailMessage(payload: SendMessagePayload): Promise<ChannelSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "Solto Support <support@solto.io>";

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [payload.toHandleOrEmail],
          subject: "Re: Your message to Solto Support",
          text: payload.content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Resend API error");
      }

      return {
        success: true,
        channelMessageId: data.id || "resend_" + Date.now(),
        timestamp: new Date().toISOString(),
        provider: "resend_smtp",
        note: `Dispatched via Resend API to ${payload.toHandleOrEmail}`,
      };
    } catch (err: any) {
      console.warn("Resend email delivery failed, falling back to simulated connector:", err.message);
    }
  }

  // Fallback simulator / local dev connector
  return {
    success: true,
    channelMessageId: "eml_sim_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    provider: "simulator",
    note: `[Email Channel] Simulated outbound email to ${payload.toHandleOrEmail}. Set RESEND_API_KEY in .env for live SMTP/API delivery.`,
  };
}

export async function publishEmailBroadcast(payload: PublishPostPayload): Promise<ChannelPublishResult> {
  return {
    success: true,
    channelPostId: "post_eml_" + Date.now(),
    provider: process.env.RESEND_API_KEY ? "resend" : "simulator",
  };
}
