-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('customer', 'store_owner', 'technician', 'operator');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('store', 'platform');

-- CreateEnum
CREATE TYPE "QualificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "DeviceCategory" AS ENUM ('home_cleaning', 'window_cleaning', 'delivery', 'commercial_cleaning');

-- CreateEnum
CREATE TYPE "DeviceConditionLevel" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "InspectionStatus" AS ENUM ('pending', 'assigned', 'inspecting', 'reported', 'closed', 'cancelled');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('quoted', 'confirmed', 'in_progress', 'completed', 'warranty');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('draft', 'published', 'negotiating', 'closed', 'removed');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('sent', 'accepted', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('P1', 'P2', 'P3');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "defaultRole" "RoleType" NOT NULL DEFAULT 'customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "city" TEXT NOT NULL,
    "qualificationStatus" "QualificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "RoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceModel" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "category" "DeviceCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RobotDevice" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "deviceModelId" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "conditionLevel" "DeviceConditionLevel" NOT NULL DEFAULT 'B',
    "firmwareVersion" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RobotDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnershipHistory" (
    "id" TEXT NOT NULL,
    "robotDeviceId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnershipHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "robotDeviceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "InspectionStatus" NOT NULL DEFAULT 'pending',
    "problemDescription" TEXT NOT NULL,
    "appointmentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspectionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionReport" (
    "id" TEXT NOT NULL,
    "inspectionOrderId" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "batteryHealth" INTEGER NOT NULL,
    "motorHealth" INTEGER NOT NULL,
    "sensorHealth" INTEGER NOT NULL,
    "navigationHealth" INTEGER NOT NULL,
    "safetyRiskLevel" "RiskLevel" NOT NULL,
    "suggestedActions" TEXT NOT NULL,
    "mediaUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspectionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceOrder" (
    "id" TEXT NOT NULL,
    "inspectionOrderId" TEXT NOT NULL,
    "quoteAmount" DECIMAL(10,2) NOT NULL,
    "finalAmount" DECIMAL(10,2),
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'quoted',
    "warrantyDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartItem" (
    "id" TEXT NOT NULL,
    "maintenanceOrderId" TEXT NOT NULL,
    "partName" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "sellerUserId" TEXT NOT NULL,
    "organizationId" TEXT,
    "robotDeviceId" TEXT NOT NULL,
    "inspectionReportId" TEXT,
    "title" TEXT NOT NULL,
    "expectedPrice" DECIMAL(10,2) NOT NULL,
    "listingStatus" "ListingStatus" NOT NULL DEFAULT 'draft',
    "hasInspectionReport" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerUserId" TEXT NOT NULL,
    "offerPrice" DECIMAL(10,2) NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'sent',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "finalAmount" DECIMAL(10,2) NOT NULL,
    "dealAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisputeCase" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisputeCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceReference" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "medianPrice" DECIMAL(10,2) NOT NULL,
    "sampleSize" INTEGER NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskEvent" (
    "id" TEXT NOT NULL,
    "robotDeviceId" TEXT,
    "listingId" TEXT,
    "riskType" TEXT NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_city_idx" ON "User"("city");

-- CreateIndex
CREATE INDEX "Organization_city_qualificationStatus_idx" ON "Organization"("city", "qualificationStatus");

-- CreateIndex
CREATE INDEX "Membership_organizationId_role_idx" ON "Membership"("organizationId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_organizationId_role_key" ON "Membership"("userId", "organizationId", "role");

-- CreateIndex
CREATE INDEX "DeviceModel_category_idx" ON "DeviceModel"("category");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceModel_brand_modelName_key" ON "DeviceModel"("brand", "modelName");

-- CreateIndex
CREATE UNIQUE INDEX "RobotDevice_serialNumber_key" ON "RobotDevice"("serialNumber");

-- CreateIndex
CREATE INDEX "RobotDevice_ownerUserId_idx" ON "RobotDevice"("ownerUserId");

-- CreateIndex
CREATE INDEX "RobotDevice_deviceModelId_idx" ON "RobotDevice"("deviceModelId");

-- CreateIndex
CREATE INDEX "OwnershipHistory_robotDeviceId_startAt_idx" ON "OwnershipHistory"("robotDeviceId", "startAt");

-- CreateIndex
CREATE INDEX "InspectionOrder_organizationId_status_idx" ON "InspectionOrder"("organizationId", "status");

-- CreateIndex
CREATE INDEX "InspectionOrder_robotDeviceId_status_idx" ON "InspectionOrder"("robotDeviceId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "InspectionReport_inspectionOrderId_key" ON "InspectionReport"("inspectionOrderId");

-- CreateIndex
CREATE INDEX "MaintenanceOrder_inspectionOrderId_status_idx" ON "MaintenanceOrder"("inspectionOrderId", "status");

-- CreateIndex
CREATE INDEX "PartItem_maintenanceOrderId_idx" ON "PartItem"("maintenanceOrderId");

-- CreateIndex
CREATE INDEX "Listing_sellerUserId_listingStatus_idx" ON "Listing"("sellerUserId", "listingStatus");

-- CreateIndex
CREATE INDEX "Listing_organizationId_listingStatus_idx" ON "Listing"("organizationId", "listingStatus");

-- CreateIndex
CREATE INDEX "Listing_inspectionReportId_idx" ON "Listing"("inspectionReportId");

-- CreateIndex
CREATE INDEX "Offer_listingId_status_idx" ON "Offer"("listingId", "status");

-- CreateIndex
CREATE INDEX "Offer_buyerUserId_status_idx" ON "Offer"("buyerUserId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_offerId_key" ON "Deal"("offerId");

-- CreateIndex
CREATE INDEX "DisputeCase_listingId_resolved_idx" ON "DisputeCase"("listingId", "resolved");

-- CreateIndex
CREATE INDEX "PriceReference_brand_modelName_city_idx" ON "PriceReference"("brand", "modelName", "city");

-- CreateIndex
CREATE UNIQUE INDEX "PriceReference_brand_modelName_city_calculatedAt_key" ON "PriceReference"("brand", "modelName", "city", "calculatedAt");

-- CreateIndex
CREATE INDEX "RiskEvent_robotDeviceId_riskLevel_idx" ON "RiskEvent"("robotDeviceId", "riskLevel");

-- CreateIndex
CREATE INDEX "RiskEvent_listingId_riskLevel_idx" ON "RiskEvent"("listingId", "riskLevel");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RobotDevice" ADD CONSTRAINT "RobotDevice_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RobotDevice" ADD CONSTRAINT "RobotDevice_deviceModelId_fkey" FOREIGN KEY ("deviceModelId") REFERENCES "DeviceModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnershipHistory" ADD CONSTRAINT "OwnershipHistory_robotDeviceId_fkey" FOREIGN KEY ("robotDeviceId") REFERENCES "RobotDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionOrder" ADD CONSTRAINT "InspectionOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionOrder" ADD CONSTRAINT "InspectionOrder_robotDeviceId_fkey" FOREIGN KEY ("robotDeviceId") REFERENCES "RobotDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionOrder" ADD CONSTRAINT "InspectionOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionReport" ADD CONSTRAINT "InspectionReport_inspectionOrderId_fkey" FOREIGN KEY ("inspectionOrderId") REFERENCES "InspectionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceOrder" ADD CONSTRAINT "MaintenanceOrder_inspectionOrderId_fkey" FOREIGN KEY ("inspectionOrderId") REFERENCES "InspectionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartItem" ADD CONSTRAINT "PartItem_maintenanceOrderId_fkey" FOREIGN KEY ("maintenanceOrderId") REFERENCES "MaintenanceOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_sellerUserId_fkey" FOREIGN KEY ("sellerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_robotDeviceId_fkey" FOREIGN KEY ("robotDeviceId") REFERENCES "RobotDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_inspectionReportId_fkey" FOREIGN KEY ("inspectionReportId") REFERENCES "InspectionReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisputeCase" ADD CONSTRAINT "DisputeCase_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskEvent" ADD CONSTRAINT "RiskEvent_robotDeviceId_fkey" FOREIGN KEY ("robotDeviceId") REFERENCES "RobotDevice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskEvent" ADD CONSTRAINT "RiskEvent_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
