import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const config = await db.getGovernanceConfig();
    const approvals = await db.getApprovals();
    return NextResponse.json({ success: true, config, approvals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { approvalRequired, complianceWords } = body;

    const updated = await db.updateGovernanceConfig({
      approvalRequired: approvalRequired !== undefined ? !!approvalRequired : undefined,
      complianceWords: Array.isArray(complianceWords) ? complianceWords : undefined,
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
