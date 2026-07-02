import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

config({ path: ".env.local" });

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "",
  }),
});

async function main() {
  const passwordHash = await hash("Passw0rd!", 10);

  const customer = await prisma.user.upsert({
    where: { phone: "13800000001" },
    update: {
      name: "测试用户",
      city: "深圳",
      passwordHash,
      defaultRole: "customer",
    },
    create: {
      phone: "13800000001",
      email: "customer@rooboot.local",
      name: "测试用户",
      city: "深圳",
      passwordHash,
      defaultRole: "customer",
    },
  });

  const storeOwner = await prisma.user.upsert({
    where: { phone: "13800000002" },
    update: {
      name: "门店店长",
      city: "深圳",
      passwordHash,
      defaultRole: "store_owner",
    },
    create: {
      phone: "13800000002",
      email: "store-owner@rooboot.local",
      name: "门店店长",
      city: "深圳",
      passwordHash,
      defaultRole: "store_owner",
    },
  });

  const technician = await prisma.user.upsert({
    where: { phone: "13800000003" },
    update: {
      name: "门店技师",
      city: "深圳",
      passwordHash,
      defaultRole: "technician",
    },
    create: {
      phone: "13800000003",
      email: "tech@rooboot.local",
      name: "门店技师",
      city: "深圳",
      passwordHash,
      defaultRole: "technician",
    },
  });

  const operator = await prisma.user.upsert({
    where: { phone: "13800000004" },
    update: {
      name: "平台运营",
      city: "深圳",
      passwordHash,
      defaultRole: "operator",
    },
    create: {
      phone: "13800000004",
      email: "operator@rooboot.local",
      name: "平台运营",
      city: "深圳",
      passwordHash,
      defaultRole: "operator",
    },
  });

  const store = await prisma.organization.upsert({
    where: { id: "store_seed_sz_01" },
    update: {
      name: "深维机器人服务中心",
      city: "深圳",
      type: "store",
      qualificationStatus: "approved",
    },
    create: {
      id: "store_seed_sz_01",
      name: "深维机器人服务中心",
      city: "深圳",
      type: "store",
      qualificationStatus: "approved",
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId_role: {
        userId: storeOwner.id,
        organizationId: store.id,
        role: "store_owner",
      },
    },
    update: {},
    create: {
      userId: storeOwner.id,
      organizationId: store.id,
      role: "store_owner",
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId_role: {
        userId: technician.id,
        organizationId: store.id,
        role: "technician",
      },
    },
    update: {},
    create: {
      userId: technician.id,
      organizationId: store.id,
      role: "technician",
    },
  });

  const model = await prisma.deviceModel.upsert({
    where: {
      brand_modelName: {
        brand: "Roborock",
        modelName: "S8 MaxV Ultra",
      },
    },
    update: {
      category: "home_cleaning",
    },
    create: {
      brand: "Roborock",
      modelName: "S8 MaxV Ultra",
      category: "home_cleaning",
    },
  });

  await prisma.robotDevice.upsert({
    where: { serialNumber: "RR-S8-2026-0001" },
    update: {
      ownerUserId: customer.id,
      deviceModelId: model.id,
      firmwareVersion: "4.8.2",
      conditionLevel: "A",
    },
    create: {
      ownerUserId: customer.id,
      deviceModelId: model.id,
      serialNumber: "RR-S8-2026-0001",
      firmwareVersion: "4.8.2",
      conditionLevel: "A",
      purchaseDate: new Date("2026-01-05T00:00:00.000Z"),
    },
  });

  console.log("Seed completed.");
  console.log("登录账号:");
  console.log("C端: 13800000001 / Passw0rd!");
  console.log("店长: 13800000002 / Passw0rd!");
  console.log("技师: 13800000003 / Passw0rd!");
  console.log("运营: 13800000004 / Passw0rd!");
  console.log(`示例运营用户: ${operator.phone}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
