import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1>登录平台</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>
        请输入手机号和密码。测试账号将在种子数据中自动创建。
      </p>
      <LoginForm />
    </div>
  );
}
