import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const keywords = await db.getKeywords();
    return NextResponse.json({ success: true, keywords });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword, channel } = body;

    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return NextResponse.json({ success: false, error: "Keyword cannot be empty" }, { status: 400 });
    }

    const created = await db.addKeyword(keyword.trim(), channel || "all");
    return NextResponse.json({ success: true, keyword: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing keyword ID" }, { status: 400 });
    }

    await db.deleteKeyword(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
