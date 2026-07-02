import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-guard";
import { getStoreOverviewsFromDb } from "@/lib/repositories/workflow-repo";

export async function GET() {
  try {
    await requirePermission("store:dashboard:read");
    const data = await getStoreOverviewsFromDb();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "无权限访问门店看板" }, { status: 401 });
  }
}
