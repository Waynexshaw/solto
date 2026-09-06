import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const rules = await db.getAutomationRules();
    return NextResponse.json({ success: true, rules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, conditionKeyword, actionType, actionValue } = body;

    if (!name || !conditionKeyword || !actionType || !actionValue) {
      return NextResponse.json({ success: false, error: "Missing required automation rule fields" }, { status: 400 });
    }

    const rule = await db.addAutomationRule({
      name,
      conditionKeyword,
      actionType,
      actionValue,
      isActive: false, // Rule starts inactive until tested!
      matchCount: 0,
    });

    return NextResponse.json({ success: true, rule }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Rule ID required" }, { status: 400 });
    }

    const updated = await db.updateAutomationRule(id, { isActive });
    return NextResponse.json({ success: true, rule: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Rule ID required" }, { status: 400 });
    }

    await db.deleteAutomationRule(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
