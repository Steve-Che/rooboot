import Link from "next/link";
import { SectionCard } from "@robot/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [deviceCount, inspectionCount, maintenanceCount, listingCount, storeCount] =
    await prisma.$transaction([
      prisma.robotDevice.count(),
      prisma.inspectionOrder.count(),
      prisma.maintenanceOrder.count(),
      prisma.listing.count(),
      prisma.organization.count({ where: { type: "store", qualificationStatus: "approved" } }),
    ]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>机器人检测维保与二手交易平台</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        面向中国市场的 C+B 双边平台，覆盖设备档案、检测维保与二手流转。
      </p>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <SectionCard title="设备档案">
          当前设备数：<strong>{deviceCount}</strong>
        </SectionCard>
        <SectionCard title="检测工单">
          当前工单数：<strong>{inspectionCount}</strong>
        </SectionCard>
        <SectionCard title="维保工单">
          当前维保单数：<strong>{maintenanceCount}</strong>
        </SectionCard>
        <SectionCard title="二手挂单">
          当前挂单数：<strong>{listingCount}</strong>
        </SectionCard>
        <SectionCard title="合作门店">
          活跃门店数：<strong>{storeCount}</strong>
        </SectionCard>
        <SectionCard title="下一步">
          <Link href={"/workflow" as any}>进入端到端流程台</Link>
        </SectionCard>
      </div>
    </div>
  );
}
