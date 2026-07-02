import type { RoleType } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: RoleType;
      phone: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: RoleType;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: RoleType;
    phone?: string;
  }
}
