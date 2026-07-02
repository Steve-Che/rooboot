import { getInspectionOrdersWithRelations } from "@/lib/repositories/workflow-repo";

export const dynamic = "force-dynamic";

export default async function InspectionsPage() {
  const orders = await getInspectionOrdersWithRelations();

  return (
    <div>
      <h1>检测工单</h1>
      <p>覆盖上门/到店检测，支持状态追踪与报告沉淀。</p>
      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {orders.map((order) => (
          <li
            key={order.id}
            style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}
          >
            <strong>{order.id}</strong> - {order.user.name} - {order.organization.city}
            <div>状态：{order.status}</div>
            <div>预约时间：{new Date(order.appointmentAt).toLocaleString("zh-CN")}</div>
            <div>
              报告状态：{order.inspectionReport ? "已提交" : "未提交"} / 维修单数：{order.maintenanceOrders.length}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
