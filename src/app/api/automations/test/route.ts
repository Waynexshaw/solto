import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conditionKeyword, actionType, actionValue, ruleId } = body;

    if (!conditionKeyword || !actionType || !actionValue) {
      return NextResponse.json(
        { success: false, error: "Keyword, action type, and action value are required for testing" },
        { status: 400 }
      );
    }

    const testResults = await db.testRuleAgainstHistory({
      conditionKeyword,
      actionType,
      actionValue,
      ruleId,
    });

    return NextResponse.json({
      success: true,
      report: testResults,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
