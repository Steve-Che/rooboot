import { getMaintenanceOrdersWithRelations } from "@/lib/repositories/workflow-repo";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const orders = await getMaintenanceOrdersWithRelations();

  return (
    <div>
      <h1>维保管理</h1>
      <p>管理报价、维修进度、质保周期和复修风险。</p>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
        <thead>
          <tr>
            <th>维保单号</th>
            <th>关联检测单</th>
            <th>报价</th>
            <th>状态</th>
            <th>质保天数</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.inspectionOrderId}</td>
              <td>{Number(order.quoteAmount)} 元</td>
              <td>{order.status}</td>
              <td>{order.warrantyDays}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
