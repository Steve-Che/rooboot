import {
  devices,
  inspectionOrders,
  listings,
  maintenanceOrders,
  storeOverviews,
} from "@robot/domain";

export function getDevices() {
  return devices;
}

export function getInspectionOrders() {
  return inspectionOrders;
}

export function getMaintenanceOrders() {
  return maintenanceOrders;
}

export function getListings() {
  return listings;
}

export function getStoreOverviews() {
  return storeOverviews;
}
