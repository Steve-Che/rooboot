import type { RoleType } from "@prisma/client";

export type AppRole = RoleType;

const permissionMap: Record<AppRole, string[]> = {
  customer: ["device:read", "inspection:create", "listing:create"],
  store_owner: [
    "device:read",
    "inspection:read",
    "inspection:update",
    "maintenance:update",
    "listing:update",
    "store:dashboard:read",
  ],
  technician: ["inspection:read", "inspection:update", "maintenance:update"],
  operator: ["*"],
};

export function hasPermission(role: AppRole, permission: string): boolean {
  const permissions = permissionMap[role];
  return permissions.includes("*") || permissions.includes(permission);
}
