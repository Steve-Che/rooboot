import { NextResponse } from "next/server";
import { z } from "zod";
import { requirePermission } from "@/lib/auth-guard";
import { createListing, getListingsWithRelations } from "@/lib/repositories/workflow-repo";

const createListingSchema = z.object({
  robotDeviceId: z.string().min(1),
  title: z.string().min(3),
  expectedPrice: z.number().positive(),
});

export async function GET() {
  try {
    await requirePermission("device:read");
    const data = await getListingsWithRelations();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "无权限访问挂单数据" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission("listing:create");
    const payload = await request.json();
    const parsed = createListingSchema.parse(payload);

    const data = await createListing({
      sellerUserId: session.user.id,
      robotDeviceId: parsed.robotDeviceId,
      title: parsed.title,
      expectedPrice: parsed.expectedPrice,
    });

    return NextResponse.json({ data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "参数不合法", detail: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "创建二手挂单失败" }, { status: 400 });
  }
}
