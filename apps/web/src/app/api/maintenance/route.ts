import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth-guard";
import {
  createMaintenanceOrder,
  getMaintenanceOrdersWithRelations,
} from "@/lib/repositories/workflow-repo";

const createMaintenanceSchema = z.object({
  inspectionOrderId: z.string().min(1),
  quoteAmount: z.number().positive(),
  warrantyDays: z.number().int().min(0).max(3650),
});

export async function GET() {
  try {
    await requirePermission("maintenance:update");
    const data = await getMaintenanceOrdersWithRelations();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "无权限访问维保工单" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("maintenance:update");
    const payload = await request.json();
    const parsed = createMaintenanceSchema.parse(payload);
    const data = await createMaintenanceOrder(parsed);
    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "参数不合法", detail: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "创建维保订单失败" }, { status: 400 });
  }
}
