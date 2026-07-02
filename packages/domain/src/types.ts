export type DeviceCategory =
  | "home_cleaning"
  | "window_cleaning"
  | "delivery"
  | "commercial_cleaning";

export type DeviceConditionLevel = "A" | "B" | "C" | "D";

export interface RobotDevice {
  id: string;
  brand: string;
  model: string;
  category: DeviceCategory;
  serialNumber: string;
  conditionLevel: DeviceConditionLevel;
  city: string;
  firmwareVersion: string;
  createdAt: string;
}

export type InspectionStatus =
  | "pending"
  | "assigned"
  | "inspecting"
  | "reported"
  | "closed";

export interface InspectionOrder {
  id: string;
  deviceId: string;
  userName: string;
  city: string;
  status: InspectionStatus;
  appointmentAt: string;
}

export type MaintenanceStatus =
  | "quoted"
  | "confirmed"
  | "in_progress"
  | "completed";

export interface MaintenanceOrder {
  id: string;
  inspectionOrderId: string;
  quoteAmount: number;
  status: MaintenanceStatus;
  warrantyDays: number;
}

export type ListingStatus = "published" | "negotiating" | "closed";

export interface Listing {
  id: string;
  deviceId: string;
  title: string;
  expectedPrice: number;
  city: string;
  hasInspectionReport: boolean;
  status: ListingStatus;
}

export interface StoreOverview {
  id: string;
  name: string;
  city: string;
  monthlyOrders: number;
  completionRate: number;
  averageRating: number;
}
