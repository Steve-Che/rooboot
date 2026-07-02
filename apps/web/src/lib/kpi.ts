import { prisma } from "@/lib/prisma";

export interface PlatformKpi {
  monthlyInspectionReports: number;
  monthlyGmv: number;
  listingCount: number;
  maintenanceCompletionRate: number;
}

export async function getPlatformKpi(): Promise<PlatformKpi> {
  const [inspections, listings, maintenance] = await Promise.all([
    prisma.inspectionOrder.findMany({
      select: { status: true },
    }),
    prisma.listing.findMany({
      select: { expectedPrice: true },
    }),
    prisma.maintenanceOrder.findMany({
      select: { status: true },
    }),
  ]);

  const monthlyInspectionReports = inspections.filter(
    (item) => item.status === "reported" || item.status === "closed",
  ).length;

  const monthlyGmv = listings.reduce((sum, item) => sum + Number(item.expectedPrice), 0);
  const completedMaintenance = maintenance.filter((item) => item.status === "completed").length;
  const maintenanceCompletionRate =
    maintenance.length === 0 ? 0 : completedMaintenance / maintenance.length;

  return {
    monthlyInspectionReports,
    monthlyGmv,
    listingCount: listings.length,
    maintenanceCompletionRate,
  };
}
