import { getStoreOverviewsFromDb } from "@/lib/repositories/workflow-repo";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const stores = await getStoreOverviewsFromDb();

  return (
    <div>
      <h1>门店后台</h1>
      <p>帮助合作门店实现工单数字化、经营可视化与线索闭环。</p>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
        <thead>
          <tr>
            <th>门店</th>
            <th>城市</th>
            <th>月工单</th>
            <th>完结率</th>
            <th>评分</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.city}</td>
              <td>{store.monthlyOrders}</td>
              <td>{(store.completionRate * 100).toFixed(1)}%</td>
              <td>{store.averageRating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
