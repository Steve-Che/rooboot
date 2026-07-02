"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "6px 10px", background: "#fff" }}
    >
      退出登录
    </button>
  );
}
