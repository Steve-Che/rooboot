import { getListingsWithRelations } from "@/lib/repositories/workflow-repo";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const listings = await getListingsWithRelations();

  return (
    <div>
      <h1>二手撮合</h1>
      <p>提供发布、询价、沟通和成交回填，首期采用轻撮合模式。</p>
      <ul style={{ display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
        {listings.map((listing) => (
          <li
            key={listing.id}
            style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{listing.title}</h3>
            <div>价格：{Number(listing.expectedPrice)} 元</div>
            <div>设备：{listing.robotDevice.deviceModel.brand} {listing.robotDevice.deviceModel.modelName}</div>
            <div>状态：{listing.listingStatus}</div>
            <div>检测报告：{listing.hasInspectionReport ? "已附带" : "未附带"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
