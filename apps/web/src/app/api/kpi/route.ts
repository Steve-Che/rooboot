import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-guard";
import { getPlatformKpi } from "@/lib/kpi";

export async function GET() {
  try {
    await requirePermission("store:dashboard:read");
    const data = await getPlatformKpi();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "无权限访问KPI" }, { status: 401 });
  }
}
