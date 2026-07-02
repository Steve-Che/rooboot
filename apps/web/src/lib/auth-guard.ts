import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { hasPermission } from "@/lib/authz";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requirePermission(permission: string) {
  const session = await requireAuth();
  if (!hasPermission(session.user.role, permission)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
