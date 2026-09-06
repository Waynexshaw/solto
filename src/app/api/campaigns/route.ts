import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId") || undefined;
    const campaigns = await db.getPaidCampaigns(brandId);
    return NextResponse.json({ success: true, campaigns });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, budget, targetChannel, durationDays, startDate, endDate, headline, creativeUrl, brandId } = body;

    if (!name || !budget || !targetChannel || !headline) {
      return NextResponse.json(
        { success: false, error: "Name, budget, target channel, and headline are required" },
        { status: 400 }
      );
    }

    const campaign = await db.addPaidCampaign({
      brandId: brandId || "brand_default",
      name,
      budget: Number(budget),
      targetChannel,
      durationDays: Number(durationDays) || 30,
      startDate: startDate || new Date().toISOString().slice(0, 10),
      endDate: endDate || new Date(Date.now() + 3600000 * 24 * 30).toISOString().slice(0, 10),
      headline,
      creativeUrl: creativeUrl || undefined,
      status: "active",
    });

    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Campaign ID required" }, { status: 400 });
    }

    const updated = await db.updatePaidCampaign(id, { status });
    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Campaign ID required" }, { status: 400 });
    }

    await db.deletePaidCampaign(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
