import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requirePermission } from "@/lib/auth-guard";
import {
  createInspectionOrder,
  createInspectionReport,
  getInspectionOrdersWithRelations,
} from "@/lib/repositories/workflow-repo";

const createInspectionOrderSchema = z.object({
  robotDeviceId: z.string().min(1),
  organizationId: z.string().min(1),
  problemDescription: z.string().min(3),
  appointmentAt: z.string().datetime(),
});

const createInspectionReportSchema = z.object({
  inspectionOrderId: z.string().min(1),
  overallScore: z.number().min(0).max(100),
  batteryHealth: z.number().min(0).max(100),
  motorHealth: z.number().min(0).max(100),
  sensorHealth: z.number().min(0).max(100),
  navigationHealth: z.number().min(0).max(100),
  safetyRiskLevel: z.enum(["P1", "P2", "P3"]),
  suggestedActions: z.string().min(3),
});

export async function GET() {
  try {
    await requirePermission("inspection:read");
    const data = await getInspectionOrdersWithRelations();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "无权限访问检测工单" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const payload = await request.json();

    if (payload?.mode === "report") {
      await requirePermission("inspection:update");
      const reportInput = createInspectionReportSchema.parse(payload);
      const report = await createInspectionReport(reportInput);
      return NextResponse.json({ data: report });
    }

    const orderInput = createInspectionOrderSchema.parse(payload);
    const order = await createInspectionOrder({
      userId: session.user.id,
      robotDeviceId: orderInput.robotDeviceId,
      organizationId: orderInput.organizationId,
      problemDescription: orderInput.problemDescription,
      appointmentAt: new Date(orderInput.appointmentAt),
    });
    return NextResponse.json({ data: order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "参数不合法", detail: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "创建检测流程失败" }, { status: 400 });
  }
}
