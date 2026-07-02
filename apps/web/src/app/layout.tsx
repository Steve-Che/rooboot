import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import "./globals.css";

export const metadata: Metadata = {
  title: "机器人检测维保与二手交易平台",
  description: "面向中国市场的机器人全生命周期服务平台",
};

const navItems: Array<{ href: string; label: string }> = [
  { href: "/", label: "总览" },
  { href: "/workflow", label: "端到端流程" },
  { href: "/devices", label: "设备档案" },
  { href: "/inspections", label: "检测工单" },
  { href: "/maintenance", label: "维保管理" },
  { href: "/marketplace", label: "二手撮合" },
  { href: "/store", label: "门店后台" },
];

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="zh-CN">
      <body>
        <header
          style={{
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "14px 20px",
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            <strong>Rooboot</strong>
            <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href as any}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              {session?.user ? (
                <>
                  <span style={{ color: "#4b5563", fontSize: 14 }}>
                    {session.user.name}（{session.user.role}）
                  </span>
                  <LogoutButton />
                </>
              ) : (
                <Link href={"/login" as any}>登录</Link>
              )}
            </div>
          </div>
        </header>
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
