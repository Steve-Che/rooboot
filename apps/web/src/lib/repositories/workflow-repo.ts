import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getDeviceSummaries() {
  return prisma.robotDevice.findMany({
    include: {
      deviceModel: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getInspectionOrdersWithRelations() {
  return prisma.inspectionOrder.findMany({
    include: {
      user: true,
      robotDevice: {
        include: { deviceModel: true },
      },
      organization: true,
      inspectionReport: true,
      maintenanceOrders: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function createInspectionOrder(input: {
  userId: string;
  robotDeviceId: string;
  organizationId: string;
  problemDescription: string;
  appointmentAt: Date;
}) {
  return prisma.inspectionOrder.create({
    data: {
      userId: input.userId,
      robotDeviceId: input.robotDeviceId,
      organizationId: input.organizationId,
      problemDescription: input.problemDescription,
      appointmentAt: input.appointmentAt,
      status: "pending",
    },
  });
}

export async function createInspectionReport(input: {
  inspectionOrderId: string;
  overallScore: number;
  batteryHealth: number;
  motorHealth: number;
  sensorHealth: number;
  navigationHealth: number;
  safetyRiskLevel: "P1" | "P2" | "P3";
  suggestedActions: string;
}) {
  return prisma.$transaction(async (tx) => {
    const report = await tx.inspectionReport.upsert({
      where: { inspectionOrderId: input.inspectionOrderId },
      create: {
        inspectionOrderId: input.inspectionOrderId,
        overallScore: input.overallScore,
        batteryHealth: input.batteryHealth,
        motorHealth: input.motorHealth,
        sensorHealth: input.sensorHealth,
        navigationHealth: input.navigationHealth,
        safetyRiskLevel: input.safetyRiskLevel,
        suggestedActions: input.suggestedActions,
        mediaUrls: [],
      },
      update: {
        overallScore: input.overallScore,
        batteryHealth: input.batteryHealth,
        motorHealth: input.motorHealth,
        sensorHealth: input.sensorHealth,
        navigationHealth: input.navigationHealth,
        safetyRiskLevel: input.safetyRiskLevel,
        suggestedActions: input.suggestedActions,
      },
    });

    await tx.inspectionOrder.update({
      where: { id: input.inspectionOrderId },
      data: { status: "reported" },
    });

    return report;
  });
}

export async function createMaintenanceOrder(input: {
  inspectionOrderId: string;
  quoteAmount: Prisma.Decimal | number;
  warrantyDays: number;
}) {
  return prisma.maintenanceOrder.create({
    data: {
      inspectionOrderId: input.inspectionOrderId,
      quoteAmount: input.quoteAmount,
      status: "quoted",
      warrantyDays: input.warrantyDays,
    },
  });
}

export async function createListing(input: {
  sellerUserId: string;
  robotDeviceId: string;
  title: string;
  expectedPrice: Prisma.Decimal | number;
}) {
  const latestReport = await prisma.inspectionReport.findFirst({
    where: { inspectionOrder: { robotDeviceId: input.robotDeviceId } },
    orderBy: { createdAt: "desc" },
  });

  return prisma.listing.create({
    data: {
      sellerUserId: input.sellerUserId,
      robotDeviceId: input.robotDeviceId,
      inspectionReportId: latestReport?.id,
      hasInspectionReport: Boolean(latestReport),
      title: input.title,
      expectedPrice: input.expectedPrice,
      listingStatus: "published",
    },
  });
}

export async function getListingsWithRelations() {
  return prisma.listing.findMany({
    include: {
      sellerUser: true,
      robotDevice: {
        include: { deviceModel: true },
      },
      inspectionReport: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getMaintenanceOrdersWithRelations() {
  return prisma.maintenanceOrder.findMany({
    include: {
      inspectionOrder: {
        include: {
          user: true,
          robotDevice: {
            include: { deviceModel: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getStoreOverviewsFromDb() {
  const organizations = await prisma.organization.findMany({
    where: { type: "store" },
    include: {
      _count: {
        select: {
          inspectionOrders: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return organizations.map((org) => ({
    id: org.id,
    name: org.name,
    city: org.city,
    monthlyOrders: org._count.inspectionOrders,
    completionRate: 0,
    averageRating: 0,
  }));
}
