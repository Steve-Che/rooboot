import type {
  InspectionOrder,
  Listing,
  MaintenanceOrder,
  RobotDevice,
  StoreOverview,
} from "./types";

export const devices: RobotDevice[] = [
  {
    id: "dev_001",
    brand: "Roborock",
    model: "S8 MaxV Ultra",
    category: "home_cleaning",
    serialNumber: "RR-S8-2026-0001",
    conditionLevel: "A",
    city: "深圳",
    firmwareVersion: "4.8.2",
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "dev_002",
    brand: "PUDU",
    model: "BellaBot Pro",
    category: "delivery",
    serialNumber: "PD-BB-2026-1022",
    conditionLevel: "B",
    city: "上海",
    firmwareVersion: "3.5.0",
    createdAt: "2026-06-10T10:20:00.000Z",
  },
];

export const inspectionOrders: InspectionOrder[] = [
  {
    id: "insp_001",
    deviceId: "dev_001",
    userName: "李女士",
    city: "深圳",
    status: "reported",
    appointmentAt: "2026-07-03T14:00:00.000Z",
  },
  {
    id: "insp_002",
    deviceId: "dev_002",
    userName: "张经理",
    city: "上海",
    status: "assigned",
    appointmentAt: "2026-07-04T10:30:00.000Z",
  },
];

export const maintenanceOrders: MaintenanceOrder[] = [
  {
    id: "maint_001",
    inspectionOrderId: "insp_001",
    quoteAmount: 680,
    status: "confirmed",
    warrantyDays: 180,
  },
];

export const listings: Listing[] = [
  {
    id: "list_001",
    deviceId: "dev_001",
    title: "95新扫地机器人，带检测报告",
    expectedPrice: 2899,
    city: "深圳",
    hasInspectionReport: true,
    status: "published",
  },
  {
    id: "list_002",
    deviceId: "dev_002",
    title: "商用配送机器人，门店升级转让",
    expectedPrice: 16800,
    city: "上海",
    hasInspectionReport: true,
    status: "negotiating",
  },
];

export const storeOverviews: StoreOverview[] = [
  {
    id: "store_001",
    name: "深维机器人服务中心",
    city: "深圳",
    monthlyOrders: 132,
    completionRate: 0.92,
    averageRating: 4.8,
  },
  {
    id: "store_002",
    name: "沪上机器人维保站",
    city: "上海",
    monthlyOrders: 106,
    completionRate: 0.89,
    averageRating: 4.7,
  },
];
