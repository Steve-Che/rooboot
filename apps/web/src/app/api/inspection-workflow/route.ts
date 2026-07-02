import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

const transitionSchema = z.object({
  orderId: z.string().min(1),
  from: z.enum(["pending", "assigned", "inspecting", "reported", "closed"]),
  to: z.enum(["assigned", "inspecting", "reported", "closed"]),
});

const validTransitions: Record<string, string[]> = {
  pending: ["assigned"],
  assigned: ["inspecting"],
  inspecting: ["reported"],
  reported: ["closed"],
  closed: [],
};

export async function POST(request: NextRequest) {
  try {
    await requirePermission("inspection:update");
    const payload = await request.json();
    const parsed = transitionSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: "参数不合法", detail: parsed.error.flatten() }, { status: 400 });
    }

    const allowed = validTransitions[parsed.data.from] ?? [];
    if (!allowed.includes(parsed.data.to)) {
      return NextResponse.json({ error: "状态流转不合法" }, { status: 409 });
    }

    const updated = await prisma.inspectionOrder.update({
      where: { id: parsed.data.orderId },
      data: { status: parsed.data.to },
    });

    return NextResponse.json({
      message: "流转成功",
      data: updated,
    });
  } catch {
    return NextResponse.json({ error: "状态流转失败" }, { status: 400 });
  }
}
