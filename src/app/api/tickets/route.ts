import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;

    const tickets = await db.getTickets({ status, priority });
    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, priority, tags } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Conversation/Ticket ID required" }, { status: 400 });
    }

    const updated = await db.updateTicket(id, { status, priority, tags });
    return NextResponse.json({ success: true, ticket: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
