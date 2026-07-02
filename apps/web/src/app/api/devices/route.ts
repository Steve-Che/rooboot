import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-guard";
import { getDeviceSummaries } from "@/lib/repositories/workflow-repo";

export async function GET() {
  try {
    await requirePermission("device:read");
    const data = await getDeviceSummaries();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "无权限访问设备数据" }, { status: 401 });
  }
}
