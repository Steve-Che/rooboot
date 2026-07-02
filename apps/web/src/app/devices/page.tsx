import { getDeviceSummaries } from "@/lib/repositories/workflow-repo";

export const dynamic = "force-dynamic";

export default async function DevicesPage() {
  const devices = await getDeviceSummaries();

  return (
    <div>
      <h1>设备档案</h1>
      <p>统一管理机器人设备身份、机型与健康状态。</p>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
        <thead>
          <tr>
            <th>品牌</th>
            <th>型号</th>
            <th>分类</th>
            <th>成色</th>
            <th>所有者</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>{device.deviceModel.brand}</td>
              <td>{device.deviceModel.modelName}</td>
              <td>{device.deviceModel.category}</td>
              <td>{device.conditionLevel}</td>
              <td>{device.ownerUserId.slice(0, 6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
