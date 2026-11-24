import { NextRequest, NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db, inspirationTemplates } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await db
      .delete(inspirationTemplates)
      .where(eq(inspirationTemplates.id, id));

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
