import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { requirePermission } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import {
  createInspectionOrder,
  createInspectionReport,
  createListing,
  createMaintenanceOrder,
  getDeviceSummaries,
  getInspectionOrdersWithRelations,
  getListingsWithRelations,
  getMaintenanceOrdersWithRelations,
} from "@/lib/repositories/workflow-repo";

export const dynamic = "force-dynamic";

async function createInspectionOrderAction(formData: FormData) {
  "use server";
  const session = await requirePermission("inspection:create");

  const robotDeviceId = String(formData.get("robotDeviceId") ?? "");
  const organizationId = String(formData.get("organizationId") ?? "");
  const problemDescription = String(formData.get("problemDescription") ?? "");
  const appointmentAt = String(formData.get("appointmentAt") ?? "");

  await createInspectionOrder({
    userId: session.user.id,
    robotDeviceId,
    organizationId,
    problemDescription,
    appointmentAt: new Date(appointmentAt),
  });

  revalidatePath("/workflow");
}

async function createInspectionReportAction(formData: FormData) {
  "use server";
  await requirePermission("inspection:update");

  await createInspectionReport({
    inspectionOrderId: String(formData.get("inspectionOrderId") ?? ""),
    overallScore: Number(formData.get("overallScore") ?? 0),
    batteryHealth: Number(formData.get("batteryHealth") ?? 0),
    motorHealth: Number(formData.get("motorHealth") ?? 0),
    sensorHealth: Number(formData.get("sensorHealth") ?? 0),
    navigationHealth: Number(formData.get("navigationHealth") ?? 0),
    safetyRiskLevel: String(formData.get("safetyRiskLevel") ?? "P2") as "P1" | "P2" | "P3",
    suggestedActions: String(formData.get("suggestedActions") ?? ""),
  });

  revalidatePath("/workflow");
}

async function createMaintenanceOrderAction(formData: FormData) {
  "use server";
  await requirePermission("maintenance:update");

  await createMaintenanceOrder({
    inspectionOrderId: String(formData.get("inspectionOrderId") ?? ""),
    quoteAmount: Number(formData.get("quoteAmount") ?? 0),
    warrantyDays: Number(formData.get("warrantyDays") ?? 0),
  });

  revalidatePath("/workflow");
}

async function createListingAction(formData: FormData) {
  "use server";
  const session = await requirePermission("listing:create");

  await createListing({
    sellerUserId: session.user.id,
    robotDeviceId: String(formData.get("robotDeviceId") ?? ""),
    title: String(formData.get("title") ?? ""),
    expectedPrice: Number(formData.get("expectedPrice") ?? 0),
  });

  revalidatePath("/workflow");
}

export default async function WorkflowPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/workflow" as any);
  }

  const [devices, stores, inspections, maintenanceOrders, listings] = await Promise.all([
    getDeviceSummaries(),
    prisma.organization.findMany({ where: { type: "store", qualificationStatus: "approved" } }),
    getInspectionOrdersWithRelations(),
    getMaintenanceOrdersWithRelations(),
    getListingsWithRelations(),
  ]);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1>端到端流程工作台</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        真实数据库流程：检测下单 → 检测报告 → 维修报价 → 二手挂单
      </p>

      <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
        <h2>1) 检测下单（C端）</h2>
        <form action={createInspectionOrderAction} style={{ display: "grid", gap: 8, maxWidth: 560 }}>
          <select name="robotDeviceId" required>
            <option value="">选择设备</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.deviceModel.brand} {device.deviceModel.modelName} / {device.serialNumber}
              </option>
            ))}
          </select>

          <select name="organizationId" required>
            <option value="">选择服务门店</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}（{store.city}）
              </option>
            ))}
          </select>

          <input name="problemDescription" placeholder="故障描述" required />
          <input type="datetime-local" name="appointmentAt" required />
          <button type="submit">创建检测工单</button>
        </form>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
        <h2>2) 检测报告（门店/技师）</h2>
        <form action={createInspectionReportAction} style={{ display: "grid", gap: 8, maxWidth: 560 }}>
          <select name="inspectionOrderId" required>
            <option value="">选择检测工单</option>
            {inspections.map((order) => (
              <option key={order.id} value={order.id}>
                {order.id} / {order.user.name} / {order.robotDevice.deviceModel.brand}
              </option>
            ))}
          </select>
          <input type="number" name="overallScore" min={0} max={100} placeholder="总分" required />
          <input type="number" name="batteryHealth" min={0} max={100} placeholder="电池健康" required />
          <input type="number" name="motorHealth" min={0} max={100} placeholder="电机健康" required />
          <input type="number" name="sensorHealth" min={0} max={100} placeholder="传感器健康" required />
          <input type="number" name="navigationHealth" min={0} max={100} placeholder="导航健康" required />
          <select name="safetyRiskLevel" required>
            <option value="P1">P1 高风险</option>
            <option value="P2">P2 中风险</option>
            <option value="P3">P3 低风险</option>
          </select>
          <input name="suggestedActions" placeholder="维修建议" required />
          <button type="submit">提交检测报告</button>
        </form>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
        <h2>3) 维修报价（门店）</h2>
        <form action={createMaintenanceOrderAction} style={{ display: "grid", gap: 8, maxWidth: 560 }}>
          <select name="inspectionOrderId" required>
            <option value="">选择检测工单</option>
            {inspections.map((order) => (
              <option key={order.id} value={order.id}>
                {order.id} / {order.status}
              </option>
            ))}
          </select>
          <input type="number" name="quoteAmount" min={1} placeholder="报价金额" required />
          <input type="number" name="warrantyDays" min={0} placeholder="质保天数" required />
          <button type="submit">创建维修订单</button>
        </form>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
        <h2>4) 二手挂单（C端）</h2>
        <form action={createListingAction} style={{ display: "grid", gap: 8, maxWidth: 560 }}>
          <select name="robotDeviceId" required>
            <option value="">选择设备</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.deviceModel.brand} {device.deviceModel.modelName} / {device.serialNumber}
              </option>
            ))}
          </select>
          <input name="title" placeholder="挂单标题" required />
          <input type="number" name="expectedPrice" min={1} placeholder="预期价格" required />
          <button type="submit">创建二手挂单</button>
        </form>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
        <h2>流程看板</h2>
        <p>检测工单：{inspections.length}，维修订单：{maintenanceOrders.length}，二手挂单：{listings.length}</p>
      </section>
    </div>
  );
}
