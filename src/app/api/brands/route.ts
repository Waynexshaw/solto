import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const brands = await db.getBrands();
    return NextResponse.json({ success: true, brands });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, logoText, primaryColor } = body;

    if (!name || !logoText) {
      return NextResponse.json({ success: false, error: "Brand name and logo text are required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const brand = await db.addBrand({
      name,
      slug,
      logoText,
      primaryColor: primaryColor || "#4f46e5",
    });

    return NextResponse.json({ success: true, brand }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
